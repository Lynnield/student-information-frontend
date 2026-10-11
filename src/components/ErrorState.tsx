import { Alert } from './Alert'
import type { ApiRequestError } from '../utils/apiError'

interface ErrorStateProps {
  error: ApiRequestError
  // Heading used for errors that are not 403/404/network specific.
  title: string
}

// Maps an API error to a user-facing state. The backend decides what is
// allowed; this only explains the response it returned.
export function ErrorState({ error, title }: ErrorStateProps) {
  if (error.status === 403) {
    return (
      <Alert title="Access denied (403)">
        <p>
          Your account does not have permission to view or change this data.
        </p>
        <p className="mt-1 text-xs opacity-80">Server message: {error.message}</p>
      </Alert>
    )
  }

  if (error.status === 404) {
    return (
      <Alert tone="info" title="Not found (404)">
        {error.message}
      </Alert>
    )
  }

  if (error.isNetworkError) {
    return (
      <Alert title="Server unreachable">
        {error.message} Check your connection, then retry.
      </Alert>
    )
  }

  return (
    <Alert title={error.status ? `${title} (${error.status})` : title}>
      {error.message}
    </Alert>
  )
}
