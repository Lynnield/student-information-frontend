import { useState, type FormEvent } from 'react'
import { Alert } from '../../components/Alert'
import type { CourseOffering } from '../../types/courseOffering'
import {
  ENROLLMENT_STATUSES,
  type Enrollment,
  type EnrollmentPayload,
  type EnrollmentStatus,
} from '../../types/enrollment'
import type { Student } from '../../types/student'
import { ApiRequestError } from '../../utils/apiError'

interface EnrollmentFormProps {
  initialEnrollment?: Enrollment | null
  students: Student[]
  courseOfferings: CourseOffering[]
  isSubmitting: boolean
  onSubmit: (payload: EnrollmentPayload) => Promise<void>
  submitLabel: string
}

function toDateInputValue(value?: string | null): string {
  if (!value) {
    return ''
  }

  return value.slice(0, 10)
}

export function EnrollmentForm({
  initialEnrollment,
  students,
  courseOfferings,
  isSubmitting,
  onSubmit,
  submitLabel,
}: EnrollmentFormProps) {
  const [studentId, setStudentId] = useState(
    initialEnrollment ? String(initialEnrollment.student_id) : '',
  )
  const [courseOfferingId, setCourseOfferingId] = useState(
    initialEnrollment ? String(initialEnrollment.course_offering_id) : '',
  )
  const [enrollmentDate, setEnrollmentDate] = useState(
    toDateInputValue(initialEnrollment?.enrollment_date),
  )
  const [status, setStatus] = useState<EnrollmentStatus>(
    initialEnrollment?.status ?? 'enrolled',
  )
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [formError, setFormError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFieldErrors({})
    setFormError(null)

    const payload: EnrollmentPayload = {
      student_id: studentId,
      course_offering_id: courseOfferingId,
      enrollment_date: enrollmentDate,
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
        setFormError('Unable to save the enrollment. Please try again.')
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
          <label htmlFor="student_id" className={labelClass}>
            Student <span className="text-red-600">*</span>
          </label>
          <select
            id="student_id"
            className={inputClass}
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          >
            <option value="">Select a student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.student_number} — {student.last_name},{' '}
                {student.first_name}
              </option>
            ))}
          </select>
          {fieldError('student_id') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('student_id')}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="course_offering_id" className={labelClass}>
            Course offering <span className="text-red-600">*</span>
          </label>
          <select
            id="course_offering_id"
            className={inputClass}
            value={courseOfferingId}
            onChange={(e) => setCourseOfferingId(e.target.value)}
            required
          >
            <option value="">Select a course offering</option>
            {courseOfferings.map((offering) => (
              <option key={offering.id} value={offering.id}>
                {offering.course?.course_code ?? `#${offering.course_id}`} —{' '}
                {offering.section} (
                {offering.academic_term?.semester ?? `#${offering.academic_term_id}`}
                )
              </option>
            ))}
          </select>
          {fieldError('course_offering_id') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('course_offering_id')}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="enrollment_date" className={labelClass}>
            Enrollment date <span className="text-red-600">*</span>
          </label>
          <input
            id="enrollment_date"
            type="date"
            className={inputClass}
            value={enrollmentDate}
            onChange={(e) => setEnrollmentDate(e.target.value)}
            required
          />
          {fieldError('enrollment_date') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('enrollment_date')}
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
            onChange={(e) => setStatus(e.target.value as EnrollmentStatus)}
          >
            {ENROLLMENT_STATUSES.map((value) => (
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
