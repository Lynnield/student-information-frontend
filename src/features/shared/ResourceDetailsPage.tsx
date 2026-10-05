import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert } from '../../components/Alert'
import { Spinner } from '../../components/Spinner'
import { ApiRequestError } from '../../utils/apiError'

interface ResourceDetailsPageProps<T> {
  title: string
  basePath: string
  fetchById: (id: string) => Promise<T>
  id: string | undefined
  rows: (record: T) => [string, string | number | null | undefined][]
  heading: (record: T) => string
}

export function ResourceDetailsPage<T>({
  title,
  basePath,
  fetchById,
  id,
  rows,
  heading,
}: ResourceDetailsPageProps<T>) {
  const [record, setRecord] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ApiRequestError | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (!id) {
      return
    }

    let cancelled = false

    setIsLoading(true)
    setError(null)

    fetchById(id)
      .then((result) => {
        if (!cancelled) {
          setRecord(result)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof ApiRequestError
              ? err
              : new ApiRequestError('An unexpected error occurred.'),
          )
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [id, reloadKey, fetchById])

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner label={`Loading ${title.toLowerCase()}...`} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-3">
        <Alert title={`Could not load the ${title.toLowerCase()}`}>
          {error.message}
        </Alert>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            Retry
          </button>
          <Link
            to={basePath}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            Back
          </Link>
        </div>
      </div>
    )
  }

  if (!record) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">
          {heading(record)}
        </h1>
        <Link
          to={basePath}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Back
        </Link>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          {rows(record).map(([label, value]) => (
            <div key={label}>
              <dt className="text-slate-500">{label}</dt>
              <dd className="font-medium text-slate-900">
                {value === null || value === undefined || value === ''
                  ? '—'
                  : value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
