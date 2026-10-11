import axios from 'axios'
import type { ValidationErrorBody } from '../types/api'

export class ApiRequestError extends Error {
  status: number | null
  fieldErrors: Record<string, string[]>
  isNetworkError: boolean

  constructor(
    message: string,
    status: number | null = null,
    fieldErrors: Record<string, string[]> = {},
    isNetworkError = false,
  ) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
    this.fieldErrors = fieldErrors
    this.isNetworkError = isNetworkError
  }
}

export function parseApiError(error: unknown): ApiRequestError {
  if (error instanceof ApiRequestError) {
    return error
  }

  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return new ApiRequestError(
        'Unable to connect to the server. Please make sure the API is running.',
        null,
        {},
        true,
      )
    }

    const status = error.response.status
    const data = error.response.data as ValidationErrorBody | undefined
    const fieldErrors = data?.errors ?? {}

    // 500-class bodies can contain internal details (SQL, stack traces in
    // debug mode), so never show them to the user.
    if (status >= 500) {
      return new ApiRequestError(
        'The server encountered an error. Please try again later.',
        status,
      )
    }

    const message =
      data?.message ||
      (status === 401
        ? 'Unauthenticated.'
        : status === 403
          ? 'You do not have permission to perform this action.'
          : status === 404
            ? 'The requested record was not found.'
            : status === 409
              ? 'This request conflicts with existing data.'
              : 'The request could not be completed.')

    return new ApiRequestError(message, status, fieldErrors)
  }

  return new ApiRequestError('An unexpected error occurred.')
}
