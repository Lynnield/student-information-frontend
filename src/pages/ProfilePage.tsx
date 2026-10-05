import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import {
  canDeleteGrades,
  canManageEnrollments,
  canManageGrades,
  canManageReferenceData,
  canManageStudents,
  ROLE_LABELS,
} from '../utils/roles'

export function ProfilePage() {
  const { user, logout } = useAuth()

  if (!user) {
    return null
  }

  const access: string[] = []

  if (canManageReferenceData(user.role)) {
    access.push('Programs, courses, and academic terms (full management)')
  }

  if (canManageStudents(user.role)) {
    access.push('Students (create, edit, delete)')
  }

  if (canManageEnrollments(user.role)) {
    access.push('Enrollments (create, update, delete)')
  }

  if (canManageGrades(user.role)) {
    access.push('Grades (create and update)')
  }

  if (canDeleteGrades(user.role)) {
    access.push('Grades (delete)')
  }

  if (user.role === 'student') {
    access.push('Your own profile, enrollments, grades, and academic record')
  }

  if (user.role === 'instructor') {
    access.push('Course offerings and grades for your assigned sections')
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Profile</h1>
        <p className="text-sm text-slate-600">
          View your account information and access details.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">User ID</dt>
            <dd className="font-medium text-slate-900">{user.id}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Name</dt>
            <dd className="font-medium text-slate-900">{user.name}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Email</dt>
            <dd className="font-medium text-slate-900">{user.email}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Role</dt>
            <dd className="font-medium text-slate-900">
              {ROLE_LABELS[user.role]}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Account status</dt>
            <dd className="font-medium text-slate-900">{user.status}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-base font-semibold text-slate-900">
          What you can access
        </h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {access.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-slate-500">
          The Laravel API remains the security boundary; this list is only a
          UI convenience.
        </p>
      </div>

      {user.role === 'student' ? (
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-base font-semibold text-slate-900">
            Your academic record
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            View your enrollments, courses, grades, and remarks.
          </p>
          <Link
            to="/academic-record"
            className="mt-3 inline-flex rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700"
          >
            Open academic record
          </Link>
        </div>
      ) : null}

      <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 text-sm text-sky-900">
        Profile details are read-only. The current backend does not provide
        endpoints to edit your name or email, change your password, upload an
        avatar, or manage sessions.
      </div>

      <button
        type="button"
        onClick={() => void logout()}
        className="rounded-md bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700"
      >
        Log out
      </button>
    </div>
  )
}
