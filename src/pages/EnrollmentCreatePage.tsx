import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert } from '../components/Alert'
import { Spinner } from '../components/Spinner'
import { EnrollmentForm } from '../features/enrollments/EnrollmentForm'
import { useEnrollmentFormOptions } from '../features/enrollments/useEnrollmentFormOptions'
import { createEnrollment } from '../services/enrollmentService'
import type { EnrollmentPayload } from '../types/enrollment'

export function EnrollmentCreatePage() {
  const navigate = useNavigate()
  const { students, courseOfferings, isLoading, error } =
    useEnrollmentFormOptions()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(payload: EnrollmentPayload) {
    setIsSubmitting(true)

    try {
      const created = await createEnrollment(payload)
      navigate(`/enrollments/${created.id}`, { replace: true })
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
        <h1 className="text-xl font-semibold text-slate-900">New enrollment</h1>
        <Link
          to="/enrollments"
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Cancel
        </Link>
      </div>

      {error ? (
        <Alert>{error}</Alert>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <EnrollmentForm
            students={students}
            courseOfferings={courseOfferings}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            submitLabel="Create enrollment"
          />
        </div>
      )}
    </div>
  )
}
