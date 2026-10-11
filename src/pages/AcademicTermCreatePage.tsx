import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AcademicTermForm } from '../features/academicTerms/AcademicTermForm'
import { createAcademicTerm } from '../services/academicTermService'
import type { AcademicTermPayload } from '../types/academicTerm'
import { useToast } from '../components/Toast'

export function AcademicTermCreatePage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(payload: AcademicTermPayload) {
    setIsSubmitting(true)

    try {
      const created = await createAcademicTerm(payload)
      toast.success('Academic term created.')
      navigate(`/academic-terms/${created.id}`, { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">
          New academic term
        </h1>
        <Link
          to="/academic-terms"
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Cancel
        </Link>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <AcademicTermForm
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          submitLabel="Create academic term"
        />
      </div>
    </div>
  )
}
