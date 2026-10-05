import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROLE_LABELS } from '../utils/roles'

export function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">
          Welcome, {user.name}. You are signed in as {ROLE_LABELS[user.role]}.
        </p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Email</dt>
            <dd className="font-medium text-slate-900">{user.email}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Account status</dt>
            <dd className="font-medium text-slate-900">{user.status}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-base font-semibold text-slate-900">Quick links</h2>
        <p className="mt-1 text-sm text-slate-600">
          Academic modules are available from the navigation menu. Use your
          profile page for account information.
        </p>
        <Link
          to="/profile"
          className="mt-3 inline-flex rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700"
        >
          Open profile
        </Link>
      </section>
    </div>
  )
}
