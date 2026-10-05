import { useState, type FormEvent } from 'react'
import { Alert } from '../../components/Alert'
import {
  STUDENT_STATUSES,
  type ProgramRef,
  type Student,
  type StudentPayload,
  type StudentStatus,
} from '../../types/student'
import { ApiRequestError } from '../../utils/apiError'

interface StudentFormProps {
  initialStudent?: Student | null
  programs: ProgramRef[]
  isSubmitting: boolean
  onSubmit: (payload: StudentPayload) => Promise<void>
  submitLabel: string
}

function toDateInputValue(value?: string | null): string {
  if (!value) {
    return ''
  }

  return value.slice(0, 10)
}

export function StudentForm({
  initialStudent,
  programs,
  isSubmitting,
  onSubmit,
  submitLabel,
}: StudentFormProps) {
  const [studentNumber, setStudentNumber] = useState(
    initialStudent?.student_number ?? '',
  )
  const [firstName, setFirstName] = useState(initialStudent?.first_name ?? '')
  const [middleName, setMiddleName] = useState(
    initialStudent?.middle_name ?? '',
  )
  const [lastName, setLastName] = useState(initialStudent?.last_name ?? '')
  const [suffix, setSuffix] = useState(initialStudent?.suffix ?? '')
  const [birthDate, setBirthDate] = useState(
    toDateInputValue(initialStudent?.birth_date),
  )
  const [email, setEmail] = useState(initialStudent?.email ?? '')
  const [contactNumber, setContactNumber] = useState(
    initialStudent?.contact_number ?? '',
  )
  const [address, setAddress] = useState(initialStudent?.address ?? '')
  const [programId, setProgramId] = useState(
    initialStudent ? String(initialStudent.program_id) : '',
  )
  const [yearLevel, setYearLevel] = useState(
    initialStudent ? String(initialStudent.year_level) : '',
  )
  const [status, setStatus] = useState<StudentStatus>(
    initialStudent?.status ?? 'active',
  )
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [formError, setFormError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFieldErrors({})
    setFormError(null)

    const payload: StudentPayload = {
      student_number: studentNumber.trim(),
      first_name: firstName.trim(),
      middle_name: middleName.trim() || undefined,
      last_name: lastName.trim(),
      suffix: suffix.trim() || undefined,
      birth_date: birthDate,
      email: email.trim(),
      contact_number: contactNumber.trim() || undefined,
      address: address.trim() || undefined,
      program_id: programId,
      year_level: yearLevel,
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
        setFormError('Unable to save the student. Please try again.')
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
          <label htmlFor="student_number" className={labelClass}>
            Student number <span className="text-red-600">*</span>
          </label>
          <input
            id="student_number"
            className={inputClass}
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            required
          />
          {fieldError('student_number') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('student_number')}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email <span className="text-red-600">*</span>
          </label>
          <input
            id="email"
            type="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {fieldError('email') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('email')}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="first_name" className={labelClass}>
            First name <span className="text-red-600">*</span>
          </label>
          <input
            id="first_name"
            className={inputClass}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          {fieldError('first_name') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('first_name')}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="middle_name" className={labelClass}>
            Middle name
          </label>
          <input
            id="middle_name"
            className={inputClass}
            value={middleName ?? ''}
            onChange={(e) => setMiddleName(e.target.value)}
          />
          {fieldError('middle_name') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('middle_name')}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="last_name" className={labelClass}>
            Last name <span className="text-red-600">*</span>
          </label>
          <input
            id="last_name"
            className={inputClass}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          {fieldError('last_name') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('last_name')}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="suffix" className={labelClass}>
            Suffix
          </label>
          <input
            id="suffix"
            className={inputClass}
            value={suffix ?? ''}
            onChange={(e) => setSuffix(e.target.value)}
          />
          {fieldError('suffix') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('suffix')}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="birth_date" className={labelClass}>
            Birth date <span className="text-red-600">*</span>
          </label>
          <input
            id="birth_date"
            type="date"
            className={inputClass}
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
          />
          {fieldError('birth_date') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('birth_date')}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="contact_number" className={labelClass}>
            Contact number
          </label>
          <input
            id="contact_number"
            className={inputClass}
            value={contactNumber ?? ''}
            onChange={(e) => setContactNumber(e.target.value)}
          />
          {fieldError('contact_number') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('contact_number')}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="program_id" className={labelClass}>
            Program <span className="text-red-600">*</span>
          </label>
          <select
            id="program_id"
            className={inputClass}
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
            required
          >
            <option value="">Select a program</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.code} — {program.name}
              </option>
            ))}
          </select>
          {fieldError('program_id') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('program_id')}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="year_level" className={labelClass}>
            Year level <span className="text-red-600">*</span>
          </label>
          <select
            id="year_level"
            className={inputClass}
            value={yearLevel}
            onChange={(e) => setYearLevel(e.target.value)}
            required
          >
            <option value="">Select year level</option>
            {[1, 2, 3, 4, 5, 6].map((year) => (
              <option key={year} value={year}>
                Year {year}
              </option>
            ))}
          </select>
          {fieldError('year_level') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('year_level')}
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
            onChange={(e) => setStatus(e.target.value as StudentStatus)}
          >
            {STUDENT_STATUSES.map((value) => (
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
          <label htmlFor="address" className={labelClass}>
            Address
          </label>
          <textarea
            id="address"
            rows={2}
            className={inputClass}
            value={address ?? ''}
            onChange={(e) => setAddress(e.target.value)}
          />
          {fieldError('address') ? (
            <p className="mt-1 text-sm text-red-700" role="alert">
              {fieldError('address')}
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
