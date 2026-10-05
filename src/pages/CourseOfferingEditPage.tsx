import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Alert } from '../components/Alert'
import { Spinner } from '../components/Spinner'
import { CourseOfferingForm } from '../features/courseOfferings/CourseOfferingForm'
import { useOfferingFormOptions } from '../features/courseOfferings/useOfferingFormOptions'
import {
  getCourseOffering,
  updateCourseOffering,
} from '../services/courseOfferingService'
import type {
  CourseOffering,
  CourseOfferingPayload,
} from '../types/courseOffering'
import { ApiRequestError } from '../utils/apiError'

export function CourseOfferingEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { courses, academicTerms, instructors, isLoading: optionsLoading, error: optionsError } =
    useOfferingFormOptions()
  const [offering, setOffering] = useState<CourseOffering | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<ApiRequestError | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!id) {
      return
    }

    let cancelled = false

    getCourseOffering(id)
      .then((result) => {
        if (!cancelled) {
          setOffering(result)
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

  async function handleSubmit(payload: CourseOfferingPayload) {
    if (!id) {
      return
    }

    setIsSubmitting(true)

    try {
      const updated = await updateCourseOffering(id, payload)
      navigate(`/course-offerings/${updated.id}`, { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || optionsLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner label="Loading course offering..." />
      </div>
    )
  }

  if (loadError || optionsError) {
    return (
      <div className="space-y-3">
        <Alert title="Could not load the course offering">
          {loadError?.message ?? optionsError}
        </Alert>
        <Link
          to="/course-offerings"
          className="inline-block rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Back to course offerings
        </Link>
      </div>
    )
  }

  if (!offering) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">
          Edit course offering
        </h1>
        <Link
          to={`/course-offerings/${offering.id}`}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Cancel
        </Link>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <CourseOfferingForm
          initialOffering={offering}
          courses={courses}
          academicTerms={academicTerms}
          instructors={instructors}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          submitLabel="Update course offering"
        />
      </div>
    </div>
  )
}
