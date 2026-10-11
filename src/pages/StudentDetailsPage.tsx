import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ErrorState } from '../components/ErrorState'
import { Spinner } from '../components/Spinner'
import { getStudent } from '../services/studentService'
import type { Student } from '../types/student'
import { ApiRequestError } from '../utils/apiError'

export function StudentDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const [student, setStudent] = useState<Student | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ApiRequestError | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!id) {
      return
    }

    let cancelled = false

    setIsLoading(true)
    setError(null)

    getStudent(id)
      .then((result) => {
        if (!cancelled) {
          setStudent(result)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
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
  }, [id, reloadKey])

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner label="Loading student..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-3">
        <ErrorState error={error} title="Could not load the student" />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            Retry
          </button>
          <Link
            to="/students"
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            Back to students
          </Link>
        </div>
      </div>
    )
  }

  if (!student) {
    return null
  }

  const rows: [string, string | number | null | undefined][] = [
    ['Student number', student.student_number],
    ['First name', student.first_name],
    ['Middle name', student.middle_name],
    ['Last name', student.last_name],
    ['Suffix', student.suffix],
    ['Birth date', student.birth_date?.slice(0, 10)],
    ['Email', student.email],
    ['Contact number', student.contact_number],
    ['Address', student.address],
    ['Program', student.program ? `${student.program.code} — ${student.program.name}` : '—'],
    ['Year level', student.year_level],
    ['Status', student.status],
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">
          {student.last_name}, {student.first_name}
        </h1>
        <Link
          to="/students"
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Back to students
        </Link>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt className="text-slate-500">{label}</dt>
              <dd className="font-medium text-slate-900">
                {value === null || value === undefined || value === ''
                  ? '—'
                  : value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
