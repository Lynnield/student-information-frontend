import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ErrorState } from './ErrorState'
import { Spinner } from './Spinner'

export function ProtectedRoute() {
  const { isAuthenticated, isInitializing, sessionError, retrySession } =
    useAuth()
  const location = useLocation()

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Spinner label="Checking your session..." />
      </div>
    )
  }

  if (!isAuthenticated && sessionError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md space-y-3">
          <ErrorState error={sessionError} title="Could not restore your session" />
          <button
            type="button"
            onClick={retrySession}
            className="rounded-md bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
