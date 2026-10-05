import { useCallback, useEffect, useState } from 'react'
import { Alert } from '../components/Alert'
import { Spinner } from '../components/Spinner'
import { useAuth } from '../hooks/useAuth'
import { getAcademicRecord } from '../services/academicRecordService'
import { listStudents } from '../services/studentService'
import type { AcademicRecord } from '../types/academicRecord'
import type { Student } from '../types/student'
import { ApiRequestError } from '../utils/apiError'

export function AcademicRecordPage() {
  const { user } = useAuth()

  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState<string>('')
  const [record, setRecord] = useState<AcademicRecord | null>(null)
  const [isLoadingStudents, setIsLoadingStudents] = useState(false)
  const [isLoadingRecord, setIsLoadingRecord] = useState(false)
  const [error, setError] = useState<ApiRequestError | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const isStudentRole = user?.role === 'student'

  const loadRecord = useCallback(async (studentId: string) => {
    setIsLoadingRecord(true)
    setError(null)

    try {
      setRecord(await getAcademicRecord(studentId))
    } catch (err) {
      setRecord(null)
      setError(
        err instanceof ApiRequestError
          ? err
          : new ApiRequestError('An unexpected error occurred.'),
      )
    } finally {
      setIsLoadingRecord(false)
    }
  }, [])

  // Admin/registrar/instructor pick a student from the real list.
  useEffect(() => {
    if (isStudentRole) {
      return
    }

    setIsLoadingStudents(true)

    listStudents({ per_page: 100 })
      .then((page) => setStudents(page.data))
      .catch(() => setStudents([]))
      .finally(() => setIsLoadingStudents(false))
  }, [isStudentRole])

  // Student role: resolve own student profile via the real API (email match).
  useEffect(() => {
    if (!isStudentRole || !user) {
      return
    }

    let cancelled = false

    setIsLoadingStudents(true)

    listStudents({ search: user.email, per_page: 100 })
      .then((page) => {
        if (cancelled) {
          return
        }

        const own = page.data.find((s) => s.email === user.email)

        if (own) {
          setSelectedStudentId(String(own.id))
          void loadRecord(String(own.id))
        } else {
          setError(
            new ApiRequestError(
              'No student profile is linked to your account.',
              404,
            ),
          )
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
          setIsLoadingStudents(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [isStudentRole, user, loadRecord, reloadKey])

  async function handleSelect(studentId: string) {
    setSelectedStudentId(studentId)

    if (studentId) {
      await loadRecord(studentId)
    } else {
      setRecord(null)
      setError(null)
    }
  }

  const selectClass =
    'w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700'

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Academic Record
        </h1>
        <p className="text-sm text-slate-600">
          View student academic records and course history.
        </p>
      </div>

      {!isStudentRole ? (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <label
            htmlFor="student-select"
            className="block text-sm font-medium text-slate-800"
          >
            Select a student
          </label>
          {isLoadingStudents ? (
            <Spinner label="Loading students..." />
          ) : (
            <select
              id="student-select"
              className={selectClass}
              value={selectedStudentId}
              onChange={(event) => void handleSelect(event.target.value)}
            >
              <option value="">Choose a student...</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.student_number} — {student.last_name},{' '}
                  {student.first_name}
                </option>
              ))}
            </select>
          )}
        </div>
      ) : null}

      {isLoadingRecord ? (
        <div className="flex justify-center p-8">
          <Spinner label="Loading academic record..." />
        </div>
      ) : null}

      {error ? (
        <div className="space-y-3">
          <Alert title="Could not load the academic record">
            {error.message}
          </Alert>
          <button
            type="button"
            onClick={() => {
              setReloadKey((key) => key + 1)
              if (selectedStudentId) {
                void loadRecord(selectedStudentId)
              }
            }}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            Retry
          </button>
        </div>
      ) : null}

      {record && !isLoadingRecord ? (
        <>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-base font-semibold text-slate-900">
              {record.student.last_name}, {record.student.first_name}
            </h2>
            <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-slate-500">Student number</dt>
                <dd className="font-medium text-slate-900">
                  {record.student.student_number}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Program</dt>
                <dd className="font-medium text-slate-900">
                  {record.student.program
                    ? `${record.student.program.code} — ${record.student.program.name}`
                    : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Year level</dt>
                <dd className="font-medium text-slate-900">
                  {record.student.year_level}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Status</dt>
                <dd className="font-medium text-slate-900">
                  {record.student.status}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white">
            {record.academic_record.length === 0 ? (
              <p className="p-6 text-sm text-slate-600">
                No enrollment records found for this student.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-slate-600">
                        Term
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-slate-600">
                        Course
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-slate-600">
                        Section
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-slate-600">
                        Instructor
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-slate-600">
                        Enrolled
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-slate-600">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-slate-600">
                        Midterm
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-slate-600">
                        Final
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-slate-600">
                        Rating
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-slate-600">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {record.academic_record.map((enrollment) => (
                      <tr key={enrollment.id}>
                        <td className="px-4 py-2 text-slate-700">
                          {enrollment.course_offering?.academic_term
                            ? `${enrollment.course_offering.academic_term.semester} ${enrollment.course_offering.academic_term.academic_year}`
                            : '—'}
                        </td>
                        <td className="px-4 py-2 text-slate-700">
                          {enrollment.course_offering?.course
                            ? `${enrollment.course_offering.course.course_code} — ${enrollment.course_offering.course.course_title}`
                            : '—'}
                        </td>
                        <td className="px-4 py-2 text-slate-700">
                          {enrollment.course_offering?.section ?? '—'}
                        </td>
                        <td className="px-4 py-2 text-slate-700">
                          {enrollment.course_offering?.instructor?.name ??
                            '—'}
                        </td>
                        <td className="px-4 py-2 text-slate-700">
                          {enrollment.enrollment_date?.slice(0, 10) ?? '—'}
                        </td>
                        <td className="px-4 py-2 text-slate-700">
                          {enrollment.status}
                        </td>
                        <td className="px-4 py-2 text-slate-700">
                          {enrollment.grade?.midterm_grade ?? '—'}
                        </td>
                        <td className="px-4 py-2 text-slate-700">
                          {enrollment.grade?.final_grade ?? '—'}
                        </td>
                        <td className="px-4 py-2 text-slate-700">
                          {enrollment.grade?.final_rating ?? '—'}
                        </td>
                        <td className="px-4 py-2 text-slate-700">
                          {enrollment.grade?.remarks ?? '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  )
}
