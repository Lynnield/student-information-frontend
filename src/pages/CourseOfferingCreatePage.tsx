import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert } from '../components/Alert'
import { Spinner } from '../components/Spinner'
import { CourseOfferingForm } from '../features/courseOfferings/CourseOfferingForm'
import { useOfferingFormOptions } from '../features/courseOfferings/useOfferingFormOptions'
import { createCourseOffering } from '../services/courseOfferingService'
import type { CourseOfferingPayload } from '../types/courseOffering'

export function CourseOfferingCreatePage() {
  const navigate = useNavigate()
  const { courses, academicTerms, instructors, isLoading, error } =
    useOfferingFormOptions()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(payload: CourseOfferingPayload) {
    setIsSubmitting(true)

    try {
      const created = await createCourseOffering(payload)
      navigate(`/course-offerings/${created.id}`, { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner label="Loading form..." />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">
          New course offering
        </h1>
        <Link
          to="/course-offerings"
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Cancel
        </Link>
      </div>

      {error ? (
        <Alert>{error}</Alert>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <CourseOfferingForm
            courses={courses}
            academicTerms={academicTerms}
            instructors={instructors}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            submitLabel="Create course offering"
          />
        </div>
      )}
    </div>
  )
}
