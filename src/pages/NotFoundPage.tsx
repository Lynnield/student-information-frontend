import { Link, useLocation } from 'react-router-dom'

export function NotFoundPage() {
  const location = useLocation()

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <p className="text-sm font-medium text-slate-500">404</p>
      <h1 className="mt-1 text-xl font-semibold text-slate-900">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        There is no page at{' '}
        <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs">
          {location.pathname}
        </code>
        .
      </p>
      <Link
        to="/"
        className="mt-4 inline-flex rounded-md bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700"
      >
        Go to dashboard
      </Link>
    </div>
  )
}
