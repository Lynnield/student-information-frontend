import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ErrorState } from '../components/ErrorState'
import { Spinner } from '../components/Spinner'
import { CourseForm } from '../features/courses/CourseForm'
import { getCourse, updateCourse } from '../services/courseService'
import type { Course, CoursePayload } from '../types/course'
import { ApiRequestError } from '../utils/apiError'
import { useToast } from '../components/Toast'

export function CourseEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const [course, setCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<ApiRequestError | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!id) {
      return
    }

    let cancelled = false

    getCourse(id)
      .then((result) => {
        if (!cancelled) {
          setCourse(result)
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

  async function handleSubmit(payload: CoursePayload) {
    if (!id) {
      return
    }

    setIsSubmitting(true)

    try {
      const updated = await updateCourse(id, payload)
      toast.success('Course updated.')
      navigate(`/courses/${updated.id}`, { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner label="Loading course..." />
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="space-y-3">
        <ErrorState error={loadError} title="Could not load the course" />
        <Link
          to="/courses"
          className="inline-block rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Back to courses
        </Link>
      </div>
    )
  }

  if (!course) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Edit course</h1>
        <Link
          to={`/courses/${course.id}`}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Cancel
        </Link>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <CourseForm
          initialCourse={course}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          submitLabel="Update course"
        />
      </div>
    </div>
  )
}
