import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Alert } from '../components/Alert'
import { ErrorState } from '../components/ErrorState'
import { Spinner } from '../components/Spinner'
import { GradeForm } from '../features/grades/GradeForm'
import { useGradeFormOptions } from '../features/grades/useGradeFormOptions'
import { getGrade, updateGrade } from '../services/gradeService'
import type { Grade, GradePayload } from '../types/grade'
import { ApiRequestError } from '../utils/apiError'
import { useToast } from '../components/Toast'

export function GradeEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const { enrollments, isLoading: optionsLoading, error: optionsError } =
    useGradeFormOptions()
  const [grade, setGrade] = useState<Grade | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<ApiRequestError | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!id) {
      return
    }

    let cancelled = false

    getGrade(id)
      .then((result) => {
        if (!cancelled) {
          setGrade(result)
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

  async function handleSubmit(payload: GradePayload) {
    if (!id) {
      return
    }

    setIsSubmitting(true)

    try {
      const updated = await updateGrade(id, payload)
      toast.success('Grade updated.')
      navigate(`/grades/${updated.id}`, { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || optionsLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner label="Loading grade..." />
      </div>
    )
  }

  if (loadError || optionsError) {
    return (
      <div className="space-y-3">
        {loadError ? (
          <ErrorState error={loadError} title="Could not load the grade" />
        ) : (
          <Alert title="Could not load the grade">{optionsError}</Alert>
        )}
        <Link
          to="/grades"
          className="inline-block rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Back to grades
        </Link>
      </div>
    )
  }

  if (!grade) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Edit grade</h1>
        <Link
          to={`/grades/${grade.id}`}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Cancel
        </Link>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <GradeForm
          initialGrade={grade}
          enrollments={enrollments}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          submitLabel="Update grade"
        />
      </div>
    </div>
  )
}
