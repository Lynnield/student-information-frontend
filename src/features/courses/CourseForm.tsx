import { useState, type FormEvent } from 'react'
import { Alert } from '../../components/Alert'
import {
  COURSE_STATUSES,
  type Course,
  type CoursePayload,
  type CourseStatus,
} from '../../types/course'
import { ApiRequestError } from '../../utils/apiError'

interface CourseFormProps {
  initialCourse?: Course | null
  isSubmitting: boolean
  onSubmit: (payload: CoursePayload) => Promise<void>
  submitLabel: string
}

export function CourseForm({
  initialCourse,
  isSubmitting,
  onSubmit,
  submitLabel,
}: CourseFormProps) {
  const [courseCode, setCourseCode] = useState(initialCourse?.course_code ?? '')
  const [courseTitle, setCourseTitle] = useState(
    initialCourse?.course_title ?? '',
  )
  const [description, setDescription] = useState(
    initialCourse?.description ?? '',
  )
  const [units, setUnits] = useState(initialCourse ? String(initialCourse.units) : '')
  const [status, setStatus] = useState<CourseStatus>(
    initialCourse?.status ?? 'active',
  )
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [formError, setFormError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFieldErrors({})
    setFormError(null)

    const payload: CoursePayload = {
      course_code: courseCode.trim(),
      course_title: courseTitle.trim(),
      description: description.trim() || undefined,
      units,
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
        setFormError('Unable to save the course. Please try again.')
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
          <label htmlFor="course_code" className={labelClass}>
            Course code <span className="text-red-600">*</span>
          </label>
          <input
            id="course_code"
            className={inputClass}
            value={courseCode}
            onChange={(e) => setCourseCode(e.target.value)}
            required
          />
          {fieldError('course_code') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('course_code')}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="course_title" className={labelClass}>
            Course title <span className="text-red-600">*</span>
          </label>
          <input
            id="course_title"
            className={inputClass}
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            required
          />
          {fieldError('course_title') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('course_title')}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="units" className={labelClass}>
            Units (1–10) <span className="text-red-600">*</span>
          </label>
          <input
            id="units"
            type="number"
            min={1}
            max={10}
            className={inputClass}
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            required
          />
          {fieldError('units') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('units')}
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
            onChange={(e) => setStatus(e.target.value as CourseStatus)}
          >
            {COURSE_STATUSES.map((value) => (
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
