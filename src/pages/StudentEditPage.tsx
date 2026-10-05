import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Alert } from '../components/Alert'
import { Spinner } from '../components/Spinner'
import { StudentForm } from '../features/students/StudentForm'
import { listAllPrograms } from '../services/programService'
import { getStudent, updateStudent } from '../services/studentService'
import type {
  ProgramRef,
  Student,
  StudentPayload,
} from '../types/student'
import { ApiRequestError } from '../utils/apiError'

export function StudentEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [student, setStudent] = useState<Student | null>(null)
  const [programs, setPrograms] = useState<ProgramRef[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<ApiRequestError | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!id) {
      return
    }

    let cancelled = false

    Promise.all([getStudent(id), listAllPrograms()])
      .then(([studentResult, programsResult]) => {
        if (!cancelled) {
          setStudent(studentResult)
          setPrograms(programsResult)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLoadError(
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
  }, [id])

  async function handleSubmit(payload: StudentPayload) {
    if (!id) {
      return
    }

    setIsSubmitting(true)

    try {
      const updated = await updateStudent(id, payload)
      navigate(`/students/${updated.id}`, { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner label="Loading student..." />
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="space-y-3">
        <Alert title="Could not load the student">{loadError.message}</Alert>
        <Link
          to="/students"
          className="inline-block rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Back to students
        </Link>
      </div>
    )
  }

  if (!student) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Edit student</h1>
        <Link
          to={`/students/${student.id}`}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Cancel
        </Link>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <StudentForm
          initialStudent={student}
          programs={programs}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          submitLabel="Update student"
        />
      </div>
    </div>
  )
}
