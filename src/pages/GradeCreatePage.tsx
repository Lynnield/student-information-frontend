import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert } from '../components/Alert'
import { Spinner } from '../components/Spinner'
import { GradeForm } from '../features/grades/GradeForm'
import { useGradeFormOptions } from '../features/grades/useGradeFormOptions'
import { createGrade } from '../services/gradeService'
import type { GradePayload } from '../types/grade'

export function GradeCreatePage() {
  const navigate = useNavigate()
  const { enrollments, isLoading, error } = useGradeFormOptions()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(payload: GradePayload) {
    setIsSubmitting(true)

    try {
      const created = await createGrade(payload)
      navigate(`/grades/${created.id}`, { replace: true })
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
        <h1 className="text-xl font-semibold text-slate-900">New grade</h1>
        <Link
          to="/grades"
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Cancel
        </Link>
      </div>

      {error ? (
        <Alert>{error}</Alert>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <GradeForm
            enrollments={enrollments}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            submitLabel="Create grade"
          />
        </div>
      )}
    </div>
  )
}
