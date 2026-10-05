import { useState, type FormEvent } from 'react'
import { Alert } from '../../components/Alert'
import {
  PROGRAM_STATUSES,
  type Program,
  type ProgramPayload,
  type ProgramStatus,
} from '../../types/program'
import { ApiRequestError } from '../../utils/apiError'

interface ProgramFormProps {
  initialProgram?: Program | null
  isSubmitting: boolean
  onSubmit: (payload: ProgramPayload) => Promise<void>
  submitLabel: string
}

export function ProgramForm({
  initialProgram,
  isSubmitting,
  onSubmit,
  submitLabel,
}: ProgramFormProps) {
  const [code, setCode] = useState(initialProgram?.code ?? '')
  const [name, setName] = useState(initialProgram?.name ?? '')
  const [description, setDescription] = useState(
    initialProgram?.description ?? '',
  )
  const [status, setStatus] = useState<ProgramStatus>(
    initialProgram?.status ?? 'active',
  )
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [formError, setFormError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFieldErrors({})
    setFormError(null)

    const payload: ProgramPayload = {
      code: code.trim(),
      name: name.trim(),
      description: description.trim() || undefined,
      status,
    }

    try {
      await onSubmit(payload)
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setFieldErrors(error.fieldErrors)
        setFormError(
          Object.keys(error.fieldErrors).length > 0 ? null : error.message,
        )
      } else {
        setFormError('Unable to save the program. Please try again.')
      }
    }
  }

  function fieldError(name: string) {
    return fieldErrors[name]?.[0] ?? null
  }

  const inputClass =
    'mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700'
  const labelClass = 'block text-sm font-medium text-slate-800'

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => void handleSubmit(event)}
      noValidate
    >
      {formError ? <Alert>{formError}</Alert> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="code" className={labelClass}>
            Code <span className="text-red-600">*</span>
          </label>
          <input
            id="code"
            className={inputClass}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          {fieldError('code') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('code')}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="name" className={labelClass}>
            Name <span className="text-red-600">*</span>
          </label>
          <input
            id="name"
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {fieldError('name') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('name')}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="status" className={labelClass}>
            Status
          </label>
          <select
            id="status"
            className={inputClass}
            value={status}
            onChange={(e) => setStatus(e.target.value as ProgramStatus)}
          >
            {PROGRAM_STATUSES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          {fieldError('status') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('status')}
            </p>
          ) : null}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className={labelClass}>
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            className={inputClass}
            value={description ?? ''}
            onChange={(e) => setDescription(e.target.value)}
          />
          {fieldError('description') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('description')}
            </p>
          ) : null}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700"
      >
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  )
}
