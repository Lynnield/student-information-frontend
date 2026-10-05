import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Alert } from '../components/Alert'
import { Spinner } from '../components/Spinner'
import { ProgramForm } from '../features/programs/ProgramForm'
import { getProgram, updateProgram } from '../services/programService'
import type { Program, ProgramPayload } from '../types/program'
import { ApiRequestError } from '../utils/apiError'

export function ProgramEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [program, setProgram] = useState<Program | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<ApiRequestError | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!id) {
      return
    }

    let cancelled = false

    getProgram(id)
      .then((result) => {
        if (!cancelled) {
          setProgram(result)
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

  async function handleSubmit(payload: ProgramPayload) {
    if (!id) {
      return
    }

    setIsSubmitting(true)

    try {
      const updated = await updateProgram(id, payload)
      navigate(`/programs/${updated.id}`, { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner label="Loading program..." />
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="space-y-3">
        <Alert title="Could not load the program">{loadError.message}</Alert>
        <Link
          to="/programs"
          className="inline-block rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Back to programs
        </Link>
      </div>
    )
  }

  if (!program) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Edit program</h1>
        <Link
          to={`/programs/${program.id}`}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Cancel
        </Link>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <ProgramForm
          initialProgram={program}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          submitLabel="Update program"
        />
      </div>
    </div>
  )
}
