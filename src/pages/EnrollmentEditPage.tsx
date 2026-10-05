import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Alert } from '../components/Alert'
import { Spinner } from '../components/Spinner'
import { EnrollmentForm } from '../features/enrollments/EnrollmentForm'
import { useEnrollmentFormOptions } from '../features/enrollments/useEnrollmentFormOptions'
import {
  getEnrollment,
  updateEnrollment,
} from '../services/enrollmentService'
import type { Enrollment, EnrollmentPayload } from '../types/enrollment'
import { ApiRequestError } from '../utils/apiError'

export function EnrollmentEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { students, courseOfferings, isLoading: optionsLoading, error: optionsError } =
    useEnrollmentFormOptions()
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<ApiRequestError | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!id) {
      return
    }

    let cancelled = false

    getEnrollment(id)
      .then((result) => {
        if (!cancelled) {
          setEnrollment(result)
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

  async function handleSubmit(payload: EnrollmentPayload) {
    if (!id) {
      return
    }

    setIsSubmitting(true)

    try {
      const updated = await updateEnrollment(id, payload)
      navigate(`/enrollments/${updated.id}`, { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || optionsLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner label="Loading enrollment..." />
      </div>
    )
  }

  if (loadError || optionsError) {
    return (
      <div className="space-y-3">
        <Alert title="Could not load the enrollment">
          {loadError?.message ?? optionsError}
        </Alert>
        <Link
          to="/enrollments"
          className="inline-block rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Back to enrollments
        </Link>
      </div>
    )
  }

  if (!enrollment) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Edit enrollment</h1>
        <Link
          to={`/enrollments/${enrollment.id}`}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Cancel
        </Link>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <EnrollmentForm
          initialEnrollment={enrollment}
          students={students}
          courseOfferings={courseOfferings}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          submitLabel="Update enrollment"
        />
      </div>
    </div>
  )
}
