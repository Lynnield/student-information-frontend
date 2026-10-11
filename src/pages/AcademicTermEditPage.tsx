import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ErrorState } from '../components/ErrorState'
import { Spinner } from '../components/Spinner'
import { AcademicTermForm } from '../features/academicTerms/AcademicTermForm'
import {
  getAcademicTerm,
  updateAcademicTerm,
} from '../services/academicTermService'
import type {
  AcademicTerm,
  AcademicTermPayload,
} from '../types/academicTerm'
import { ApiRequestError } from '../utils/apiError'
import { useToast } from '../components/Toast'

export function AcademicTermEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const [term, setTerm] = useState<AcademicTerm | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<ApiRequestError | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!id) {
      return
    }

    let cancelled = false

    getAcademicTerm(id)
      .then((result) => {
        if (!cancelled) {
          setTerm(result)
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

  async function handleSubmit(payload: AcademicTermPayload) {
    if (!id) {
      return
    }

    setIsSubmitting(true)

    try {
      const updated = await updateAcademicTerm(id, payload)
      toast.success('Academic term updated.')
      navigate(`/academic-terms/${updated.id}`, { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner label="Loading academic term..." />
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="space-y-3">
        <ErrorState error={loadError} title="Could not load the academic term" />
        <Link
          to="/academic-terms"
          className="inline-block rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Back to academic terms
        </Link>
      </div>
    )
  }

  if (!term) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">
          Edit academic term
        </h1>
        <Link
          to={`/academic-terms/${term.id}`}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Cancel
        </Link>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <AcademicTermForm
          initialTerm={term}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          submitLabel="Update academic term"
        />
      </div>
    </div>
  )
}
