import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert } from '../components/Alert'
import { ErrorState } from '../components/ErrorState'
import { Spinner } from '../components/Spinner'
import { useToast } from '../components/Toast'
import { useAuth } from '../hooks/useAuth'
import { listAllPrograms } from '../services/programService'
import { deleteStudent, listStudents } from '../services/studentService'
import type {
  Paginated,
  ProgramRef,
  Student,
  StudentListParams,
} from '../types/student'
import { ApiRequestError } from '../utils/apiError'
import { canManageStudents } from '../utils/roles'

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'last_name', label: 'Last name' },
  { value: 'first_name', label: 'First name' },
  { value: 'student_number', label: 'Student number' },
  { value: 'email', label: 'Email' },
  { value: 'year_level', label: 'Year level' },
  { value: 'status', label: 'Status' },
  { value: 'created_at', label: 'Date created' },
]

const STATUS_OPTIONS = ['active', 'inactive', 'graduated', 'dropped'] as const

export function StudentsPage() {
  const { user } = useAuth()
  const toast = useToast()
  const canManage = user ? canManageStudents(user.role) : false

  const [students, setStudents] = useState<Paginated<Student> | null>(null)
  const [programs, setPrograms] = useState<ProgramRef[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ApiRequestError | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const [searchInput, setSearchInput] = useState('')
  const [params, setParams] = useState<StudentListParams>({
    page: 1,
    per_page: 15,
    sort: 'last_name',
    direction: 'asc',
    status: '',
  })

  const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(
    null,
  )
  const [isDeleting, setIsDeleting] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  // Debounce the search box before pushing it into the query params.
  useEffect(() => {
    const timer = setTimeout(() => {
      setParams((previous) => ({
        ...previous,
        search: searchInput.trim() || undefined,
        page: 1,
      }))
    }, 400)

    return () => clearTimeout(timer)
  }, [searchInput])

  // Programs power the program filter; only admin/registrar can call it.
  useEffect(() => {
    if (!canManage) {
      return
    }

    listAllPrograms()
      .then(setPrograms)
      .catch(() => setPrograms([]))
  }, [canManage])

  useEffect(() => {
    let cancelled = false

    setIsLoading(true)
    setError(null)

    listStudents(params)
      .then((result) => {
        if (!cancelled) {
          setStudents(result)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setStudents(null)
          setError(
            err instanceof ApiRequestError
              ? err
              : new ApiRequestError('An unexpected error occurred.'),
          )
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [params, reloadKey])

  function updateParams(patch: Partial<StudentListParams>) {
    setParams((previous) => ({ ...previous, page: 1, ...patch }))
  }

  async function handleDelete(id: number) {
    setActionError(null)
    setIsDeleting(true)

    try {
      await deleteStudent(id)
      toast.success('Student deleted.')
      setConfirmingDeleteId(null)
      setReloadKey((key) => key + 1)
    } catch (err) {
      setActionError(
        err instanceof ApiRequestError
          ? err.message
          : 'Unable to delete the student. Please try again.',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const selectClass =
    'rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700'

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Students</h1>
          <p className="text-sm text-slate-600">
            Manage and view student records.
          </p>
        </div>
        {canManage ? (
          <Link
            to="/students/new"
            className="rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700"
          >
            New student
          </Link>
        ) : null}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <input
            type="search"
            placeholder="Search number, name, or email..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className={`${selectClass} sm:col-span-2 lg:col-span-1`}
            aria-label="Search students"
          />

          {canManage ? (
            <select
              value={params.program_id ?? ''}
              onChange={(event) =>
                updateParams({ program_id: event.target.value || undefined })
              }
              className={selectClass}
              aria-label="Filter by program"
            >
              <option value="">All programs</option>
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.code}
                </option>
              ))}
            </select>
          ) : null}

          <select
            value={params.status ?? ''}
            onChange={(event) =>
              updateParams({
                status: (event.target.value || '') as StudentListParams['status'],
              })
            }
            className={selectClass}
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            value={params.sort ?? 'last_name'}
            onChange={(event) => updateParams({ sort: event.target.value })}
            className={selectClass}
            aria-label="Sort by"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                Sort: {option.label}
              </option>
            ))}
          </select>

          <select
            value={params.direction ?? 'asc'}
            onChange={(event) =>
              updateParams({
                direction: event.target.value as 'asc' | 'desc',
              })
            }
            className={selectClass}
            aria-label="Sort direction"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {actionError ? <Alert>{actionError}</Alert> : null}

      <div className="rounded-lg border border-slate-200 bg-white">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Spinner label="Loading students..." />
          </div>
        ) : error ? (
          <div className="space-y-3 p-6">
            <ErrorState error={error} title="Could not load students" />
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Retry
            </button>
          </div>
        ) : students && students.data.length === 0 ? (
          <p className="p-6 text-sm text-slate-600">
            No students found. Try adjusting your search or filters.
          </p>
        ) : students ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-slate-600">
                      Student no.
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-slate-600">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-slate-600">
                      Email
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-slate-600">
                      Program
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-slate-600">
                      Year
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-slate-600">
                      Status
                    </th>
                    <th className="px-4 py-2 text-right font-medium text-slate-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.data.map((student) => (
                    <tr key={student.id}>
                      <td className="px-4 py-2 font-mono text-xs text-slate-700">
                        {student.student_number}
                      </td>
                      <td className="px-4 py-2 text-slate-900">
                        {student.last_name}, {student.first_name}
                        {student.suffix ? ` ${student.suffix}` : ''}
                      </td>
                      <td className="px-4 py-2 text-slate-700">
                        {student.email}
                      </td>
                      <td className="px-4 py-2 text-slate-700">
                        {student.program?.code ?? '—'}
                      </td>
                      <td className="px-4 py-2 text-slate-700">
                        {student.year_level}
                      </td>
                      <td className="px-4 py-2 text-slate-700">
                        {student.status}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/students/${student.id}`}
                            className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-800 hover:bg-slate-50"
                          >
                            View
                          </Link>
                          {canManage ? (
                            <Link
                              to={`/students/${student.id}/edit`}
                              className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-800 hover:bg-slate-50"
                            >
                              Edit
                            </Link>
                          ) : null}
                          {canManage ? (
                            confirmingDeleteId === student.id ? (
                              <>
                                <button
                                  type="button"
                                  disabled={isDeleting}
                                  onClick={() => void handleDelete(student.id)}
                                  className="rounded bg-red-700 px-2 py-1 text-xs text-white hover:bg-red-600 disabled:opacity-60"
                                >
                                  {isDeleting ? 'Deleting...' : 'Confirm'}
                                </button>
                                <button
                                  type="button"
                                  disabled={isDeleting}
                                  onClick={() => setConfirmingDeleteId(null)}
                                  className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-800 hover:bg-slate-50"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  setConfirmingDeleteId(student.id)
                                }
                                className="rounded border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                              >
                                Delete
                              </button>
                            )
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-sm text-slate-600">
              <span>
                Page {students.current_page} of {students.last_page} ·{' '}
                {students.total} record(s)
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={params.per_page ?? 15}
                  onChange={(event) =>
                    updateParams({
                      per_page: Number(event.target.value),
                    })
                  }
                  className="rounded-md border border-slate-300 px-2 py-1 text-sm"
                  aria-label="Rows per page"
                >
                  {[10, 15, 25, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size} / page
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={students.current_page <= 1}
                  onClick={() =>
                    setParams((previous) => ({
                      ...previous,
                      page: (previous.page ?? 1) - 1,
                    }))
                  }
                  className="rounded border border-slate-300 px-3 py-1 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={students.current_page >= students.last_page}
                  onClick={() =>
                    setParams((previous) => ({
                      ...previous,
                      page: (previous.page ?? 1) + 1,
                    }))
                  }
                  className="rounded border border-slate-300 px-3 py-1 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
