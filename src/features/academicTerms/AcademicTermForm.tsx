import { useState, type FormEvent } from 'react'
import { Alert } from '../../components/Alert'
import {
  ACADEMIC_TERM_STATUSES,
  SEMESTERS,
  type AcademicTerm,
  type AcademicTermPayload,
  type AcademicTermStatus,
} from '../../types/academicTerm'
import { ApiRequestError } from '../../utils/apiError'

interface AcademicTermFormProps {
  initialTerm?: AcademicTerm | null
  isSubmitting: boolean
  onSubmit: (payload: AcademicTermPayload) => Promise<void>
  submitLabel: string
}

function toDateInputValue(value?: string | null): string {
  if (!value) {
    return ''
  }

  return value.slice(0, 10)
}

export function AcademicTermForm({
  initialTerm,
  isSubmitting,
  onSubmit,
  submitLabel,
}: AcademicTermFormProps) {
  const [academicYear, setAcademicYear] = useState(
    initialTerm?.academic_year ?? '',
  )
  const [semester, setSemester] = useState(initialTerm?.semester ?? '')
  const [termStartDate, setTermStartDate] = useState(
    toDateInputValue(initialTerm?.term_start_date),
  )
  const [termEndDate, setTermEndDate] = useState(
    toDateInputValue(initialTerm?.term_end_date),
  )
  const [status, setStatus] = useState<AcademicTermStatus>(
    initialTerm?.status ?? 'active',
  )
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [formError, setFormError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFieldErrors({})
    setFormError(null)

    const payload: AcademicTermPayload = {
      academic_year: academicYear.trim(),
      semester,
      term_start_date: termStartDate,
      term_end_date: termEndDate,
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
        setFormError('Unable to save the academic term. Please try again.')
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
          <label htmlFor="academic_year" className={labelClass}>
            Academic year <span className="text-red-600">*</span>
          </label>
          <input
            id="academic_year"
            placeholder="e.g. 2026-2027"
            className={inputClass}
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            required
          />
          {fieldError('academic_year') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('academic_year')}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="semester" className={labelClass}>
            Semester <span className="text-red-600">*</span>
          </label>
          <select
            id="semester"
            className={inputClass}
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            required
          >
            <option value="">Select semester</option>
            {SEMESTERS.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          {fieldError('semester') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('semester')}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="term_start_date" className={labelClass}>
            Term start date <span className="text-red-600">*</span>
          </label>
          <input
            id="term_start_date"
            type="date"
            className={inputClass}
            value={termStartDate}
            onChange={(e) => setTermStartDate(e.target.value)}
            required
          />
          {fieldError('term_start_date') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('term_start_date')}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="term_end_date" className={labelClass}>
            Term end date <span className="text-red-600">*</span>
          </label>
          <input
            id="term_end_date"
            type="date"
            className={inputClass}
            value={termEndDate}
            onChange={(e) => setTermEndDate(e.target.value)}
            required
          />
          {fieldError('term_end_date') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('term_end_date')}
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
            onChange={(e) => setStatus(e.target.value as AcademicTermStatus)}
          >
            {ACADEMIC_TERM_STATUSES.map((value) => (
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
