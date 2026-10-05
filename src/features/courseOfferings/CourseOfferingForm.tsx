import { useState, type FormEvent } from 'react'
import { Alert } from '../../components/Alert'
import {
  COURSE_OFFERING_STATUSES,
  type CourseOffering,
  type CourseOfferingPayload,
  type CourseOfferingStatus,
  type OfferingInstructor,
} from '../../types/courseOffering'
import type { AcademicTerm } from '../../types/academicTerm'
import type { Course } from '../../types/course'
import { ApiRequestError } from '../../utils/apiError'

interface CourseOfferingFormProps {
  initialOffering?: CourseOffering | null
  courses: Course[]
  academicTerms: AcademicTerm[]
  instructors: OfferingInstructor[]
  isSubmitting: boolean
  onSubmit: (payload: CourseOfferingPayload) => Promise<void>
  submitLabel: string
}

export function CourseOfferingForm({
  initialOffering,
  courses,
  academicTerms,
  instructors,
  isSubmitting,
  onSubmit,
  submitLabel,
}: CourseOfferingFormProps) {
  const [courseId, setCourseId] = useState(
    initialOffering ? String(initialOffering.course_id) : '',
  )
  const [academicTermId, setAcademicTermId] = useState(
    initialOffering ? String(initialOffering.academic_term_id) : '',
  )
  const [instructorId, setInstructorId] = useState(
    initialOffering ? String(initialOffering.instructor_id) : '',
  )
  const [section, setSection] = useState(initialOffering?.section ?? '')
  const [schedule, setSchedule] = useState(initialOffering?.schedule ?? '')
  const [room, setRoom] = useState(initialOffering?.room ?? '')
  const [capacity, setCapacity] = useState(
    initialOffering ? String(initialOffering.capacity) : '',
  )
  const [status, setStatus] = useState<CourseOfferingStatus>(
    initialOffering?.status ?? 'open',
  )
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [formError, setFormError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFieldErrors({})
    setFormError(null)

    const payload: CourseOfferingPayload = {
      course_id: courseId,
      academic_term_id: academicTermId,
      instructor_id: instructorId,
      section: section.trim(),
      schedule: schedule.trim(),
      room: room.trim() || undefined,
      capacity,
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
        setFormError('Unable to save the course offering. Please try again.')
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
          <label htmlFor="course_id" className={labelClass}>
            Course <span className="text-red-600">*</span>
          </label>
          <select
            id="course_id"
            className={inputClass}
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.course_code} — {course.course_title}
              </option>
            ))}
          </select>
          {fieldError('course_id') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('course_id')}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="academic_term_id" className={labelClass}>
            Academic term <span className="text-red-600">*</span>
          </label>
          <select
            id="academic_term_id"
            className={inputClass}
            value={academicTermId}
            onChange={(e) => setAcademicTermId(e.target.value)}
            required
          >
            <option value="">Select an academic term</option>
            {academicTerms.map((term) => (
              <option key={term.id} value={term.id}>
                {term.semester} — {term.academic_year}
              </option>
            ))}
          </select>
          {fieldError('academic_term_id') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('academic_term_id')}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="instructor_id" className={labelClass}>
            Instructor <span className="text-red-600">*</span>
          </label>
          <input
            id="instructor_id"
            type="number"
            list="instructor-options"
            className={inputClass}
            value={instructorId}
            onChange={(e) => setInstructorId(e.target.value)}
            placeholder="Instructor user ID"
            required
          />
          <datalist id="instructor-options">
            {instructors.map((instructor) => (
              <option
                key={instructor.id}
                value={instructor.id}
                label={`${instructor.name} (${instructor.email})`}
              />
            ))}
          </datalist>
          {fieldError('instructor_id') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('instructor_id')}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="section" className={labelClass}>
            Section <span className="text-red-600">*</span>
          </label>
          <input
            id="section"
            className={inputClass}
            value={section}
            onChange={(e) => setSection(e.target.value)}
            required
          />
          {fieldError('section') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('section')}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="schedule" className={labelClass}>
            Schedule <span className="text-red-600">*</span>
          </label>
          <input
            id="schedule"
            className={inputClass}
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            required
          />
          {fieldError('schedule') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('schedule')}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="room" className={labelClass}>
            Room
          </label>
          <input
            id="room"
            className={inputClass}
            value={room ?? ''}
            onChange={(e) => setRoom(e.target.value)}
          />
          {fieldError('room') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('room')}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="capacity" className={labelClass}>
            Capacity (1–500) <span className="text-red-600">*</span>
          </label>
          <input
            id="capacity"
            type="number"
            min={1}
            max={500}
            className={inputClass}
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
          />
          {fieldError('capacity') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('capacity')}
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
            onChange={(e) =>
              setStatus(e.target.value as CourseOfferingStatus)
            }
          >
            {COURSE_OFFERING_STATUSES.map((value) => (
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
