import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ProgramForm } from '../features/programs/ProgramForm'
import { createProgram } from '../services/programService'
import type { ProgramPayload } from '../types/program'
import { useToast } from '../components/Toast'

export function ProgramCreatePage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(payload: ProgramPayload) {
    setIsSubmitting(true)

    try {
      const created = await createProgram(payload)
      toast.success('Program created.')
      navigate(`/programs/${created.id}`, { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">New program</h1>
        <Link
          to="/programs"
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Cancel
        </Link>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <ProgramForm
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          submitLabel="Create program"
        />
      </div>
    </div>
  )
}
