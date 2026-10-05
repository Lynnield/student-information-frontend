import { useState, type FormEvent } from 'react'
import { Alert } from '../../components/Alert'
import type { Enrollment } from '../../types/enrollment'
import type { Grade, GradePayload } from '../../types/grade'
import { ApiRequestError } from '../../utils/apiError'

interface GradeFormProps {
  initialGrade?: Grade | null
  enrollments: Enrollment[]
  isSubmitting: boolean
  onSubmit: (payload: GradePayload) => Promise<void>
  submitLabel: string
}

export function GradeForm({
  initialGrade,
  enrollments,
  isSubmitting,
  onSubmit,
  submitLabel,
}: GradeFormProps) {
  const [enrollmentId, setEnrollmentId] = useState(
    initialGrade ? String(initialGrade.enrollment_id) : '',
  )
  const [midtermGrade, setMidtermGrade] = useState(
    initialGrade?.midterm_grade != null ? String(initialGrade.midterm_grade) : '',
  )
  const [finalGrade, setFinalGrade] = useState(
    initialGrade?.final_grade != null ? String(initialGrade.final_grade) : '',
  )
  const [finalRating, setFinalRating] = useState(
    initialGrade?.final_rating != null ? String(initialGrade.final_rating) : '',
  )
  const [remarks, setRemarks] = useState(initialGrade?.remarks ?? '')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [formError, setFormError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFieldErrors({})
    setFormError(null)

    const payload: GradePayload = {
      enrollment_id: enrollmentId,
      midterm_grade: midtermGrade === '' ? null : midtermGrade,
      final_grade: finalGrade === '' ? null : finalGrade,
      final_rating: finalRating === '' ? null : finalRating,
      remarks: remarks.trim() || undefined,
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
        setFormError('Unable to save the grade. Please try again.')
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

      <div>
        <label htmlFor="enrollment_id" className={labelClass}>
          Enrollment <span className="text-red-600">*</span>
        </label>
        <select
          id="enrollment_id"
          className={inputClass}
          value={enrollmentId}
          onChange={(e) => setEnrollmentId(e.target.value)}
          required
        >
          <option value="">Select an enrollment</option>
          {enrollments.map((enrollment) => (
            <option key={enrollment.id} value={enrollment.id}>
              {enrollment.student
                ? `${enrollment.student.last_name}, ${enrollment.student.first_name}`
                : `#${enrollment.student_id}`}{' '}
              —{' '}
              {enrollment.course_offering?.course?.course_code ??
                `#${enrollment.course_offering_id}`}{' '}
              {enrollment.course_offering?.section ?? ''}
            </option>
          ))}
        </select>
        {fieldError('enrollment_id') ? (
          <p className="mt-1 text-sm text-red-700" role="alert">
            {fieldError('enrollment_id')}
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="midterm_grade" className={labelClass}>
            Midterm grade (0–100)
          </label>
          <input
            id="midterm_grade"
            type="number"
            step="0.01"
            min={0}
            max={100}
            className={inputClass}
            value={midtermGrade}
            onChange={(e) => setMidtermGrade(e.target.value)}
          />
          {fieldError('midterm_grade') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('midterm_grade')}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="final_grade" className={labelClass}>
            Final grade (0–100)
          </label>
          <input
            id="final_grade"
            type="number"
            step="0.01"
            min={0}
            max={100}
            className={inputClass}
            value={finalGrade}
            onChange={(e) => setFinalGrade(e.target.value)}
          />
          {fieldError('final_grade') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('final_grade')}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="final_rating" className={labelClass}>
            Final rating (0–100)
          </label>
          <input
            id="final_rating"
            type="number"
            step="0.01"
            min={0}
            max={100}
            className={inputClass}
            value={finalRating}
            onChange={(e) => setFinalRating(e.target.value)}
          />
          {fieldError('final_rating') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('final_rating')}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="remarks" className={labelClass}>
          Remarks
        </label>
        <input
          id="remarks"
          className={inputClass}
          value={remarks ?? ''}
          onChange={(e) => setRemarks(e.target.value)}
        />
        {fieldError('remarks') ? (
          <p className="mt-1 text-sm text-red-700" role="alert">
            {fieldError('remarks')}
          </p>
        ) : null}
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
