import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Alert } from '../../components/Alert'
import { Spinner } from '../../components/Spinner'
import type { Paginated } from '../../types/student'
import { ApiRequestError } from '../../utils/apiError'

export interface ResourceListParams {
  search?: string
  status?: string
  sort?: string
  direction?: 'asc' | 'desc'
  page?: number
  per_page?: number
  course_id?: number | string
  academic_term_id?: number | string
  instructor_id?: number | string
  section?: string
  student_id?: number | string
  course_offering_id?: number | string
  remarks?: string
}

export interface Column<T> {
  header: string
  render: (row: T) => ReactNode
}

interface ResourceIndexPageProps<T extends { id: number }> {
  title: string
  description: string
  basePath: string
  canManage: boolean
  fetchPage: (params: ResourceListParams) => Promise<Paginated<T>>
  remove: (id: number) => Promise<void>
  columns: Column<T>[]
  sortOptions: { value: string; label: string }[]
  statusOptions: readonly string[]
  searchPlaceholder: string
  defaultSort: string
  defaultDirection?: 'asc' | 'desc'
  showSearch?: boolean
  renderExtraFilters?: (
    params: ResourceListParams,
    updateParams: (patch: Partial<ResourceListParams>) => void,
  ) => ReactNode
  showStatusFilter?: boolean
  canCreate?: boolean
  canUpdate?: boolean
  canDelete?: boolean
}

export function ResourceIndexPage<T extends { id: number }>({
  title,
  description,
  basePath,
  canManage,
  fetchPage,
  remove,
  columns,
  sortOptions,
  statusOptions,
  searchPlaceholder,
  defaultSort,
  defaultDirection = 'asc',
  showSearch = true,
  renderExtraFilters,
  showStatusFilter = true,
  canCreate,
  canUpdate,
  canDelete,
}: ResourceIndexPageProps<T>) {
  const allowCreate = canCreate ?? canManage
  const allowUpdate = canUpdate ?? canManage
  const allowDelete = canDelete ?? canManage
  const [result, setResult] = useState<Paginated<T> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<ApiRequestError | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const [searchInput, setSearchInput] = useState('')
  const [params, setParams] = useState<ResourceListParams>({
    page: 1,
    per_page: 15,
    sort: defaultSort,
    direction: defaultDirection,
    status: '',
  })

  const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(
    null,
  )
  const [isDeleting, setIsDeleting] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setParams((previous) => ({
        ...previous,
        search: searchInput.trim() || undefined,
        page: 1,
      }))
    }, 400)

    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    let cancelled = false

    setIsLoading(true)
    setError(null)

    fetchPage(params)
      .then((data) => {
        if (!cancelled) {
          setResult(data)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setResult(null)
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
  }, [params, reloadKey, fetchPage])

  function updateParams(patch: Partial<ResourceListParams>) {
    setParams((previous) => ({ ...previous, page: 1, ...patch }))
  }

  async function handleDelete(id: number) {
    setActionError(null)
    setIsDeleting(true)

    try {
      await remove(id)
      setConfirmingDeleteId(null)
      setReloadKey((key) => key + 1)
    } catch (err) {
      setActionError(
        err instanceof ApiRequestError
          ? err.message
          : 'Unable to delete the record. Please try again.',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  const selectClass =
    'rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700'

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
        {allowCreate ? (
          <Link
            to={`${basePath}/new`}
            className="rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700"
          >
            New
          </Link>
        ) : null}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {showSearch ? (
            <input
              type="search"
              placeholder={searchPlaceholder}
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              className={selectClass}
              aria-label={`Search ${title}`}
            />
          ) : null}

          {showStatusFilter ? (
            <select
              value={params.status ?? ''}
              onChange={(event) =>
                updateParams({ status: event.target.value || undefined })
              }
              className={selectClass}
              aria-label="Filter by status"
            >
              <option value="">All statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          ) : null}

          <select
            value={params.sort ?? defaultSort}
            onChange={(event) => updateParams({ sort: event.target.value })}
            className={selectClass}
            aria-label="Sort by"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                Sort: {option.label}
              </option>
            ))}
          </select>

          <select
            value={params.direction ?? defaultDirection}
            onChange={(event) =>
              updateParams({ direction: event.target.value as 'asc' | 'desc' })
            }
            className={selectClass}
            aria-label="Sort direction"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>

          {renderExtraFilters
            ? renderExtraFilters(params, updateParams)
            : null}
        </div>
      </div>

      {actionError ? <Alert>{actionError}</Alert> : null}

      <div className="rounded-lg border border-slate-200 bg-white">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Spinner label={`Loading ${title.toLowerCase()}...`} />
          </div>
        ) : error ? (
          <div className="space-y-3 p-6">
            <Alert title={`Could not load ${title.toLowerCase()}`}>
              {error.message}
            </Alert>
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Retry
            </button>
          </div>
        ) : result && result.data.length === 0 ? (
          <p className="p-6 text-sm text-slate-600">
            No records found. Try adjusting your search or filters.
          </p>
        ) : result ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.header}
                        className="px-4 py-2 text-left font-medium text-slate-600"
                      >
                        {column.header}
                      </th>
                    ))}
                    <th className="px-4 py-2 text-right font-medium text-slate-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {result.data.map((row) => (
                    <tr key={row.id}>
                      {columns.map((column) => (
                        <td
                          key={column.header}
                          className="px-4 py-2 text-slate-700"
                        >
                          {column.render(row)}
                        </td>
                      ))}
                      <td className="px-4 py-2">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`${basePath}/${row.id}`}
                            className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-800 hover:bg-slate-50"
                          >
                            View
                          </Link>
                          {allowUpdate ? (
                            <Link
                              to={`${basePath}/${row.id}/edit`}
                              className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-800 hover:bg-slate-50"
                            >
                              Edit
                            </Link>
                          ) : null}
                          {allowDelete ? (
                            confirmingDeleteId === row.id ? (
                              <>
                                <button
                                  type="button"
                                  disabled={isDeleting}
                                  onClick={() => void handleDelete(row.id)}
                                  className="rounded bg-red-700 px-2 py-1 text-xs text-white hover:bg-red-600 disabled:opacity-60"
                                >
                                  {isDeleting ? 'Deleting...' : 'Confirm'}
                                </button>
                                <button
                                  type="button"
                                  disabled={isDeleting}
                                  onClick={() => setConfirmingDeleteId(null)}
                                  className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-800 hover:bg-slate-50"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmingDeleteId(row.id)}
                                className="rounded border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                              >
                                Delete
                              </button>
                            )
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-sm text-slate-600">
              <span>
                Page {result.current_page} of {result.last_page} ·{' '}
                {result.total} record(s)
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={params.per_page ?? 15}
                  onChange={(event) =>
                    updateParams({ per_page: Number(event.target.value) })
                  }
                  className="rounded-md border border-slate-300 px-2 py-1 text-sm"
                  aria-label="Rows per page"
                >
                  {[10, 15, 25, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size} / page
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={result.current_page <= 1}
                  onClick={() =>
                    setParams((previous) => ({
                      ...previous,
                      page: (previous.page ?? 1) - 1,
                    }))
                  }
                  className="rounded border border-slate-300 px-3 py-1 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={result.current_page >= result.last_page}
                  onClick={() =>
                    setParams((previous) => ({
                      ...previous,
                      page: (previous.page ?? 1) + 1,
                    }))
                  }
                  className="rounded border border-slate-300 px-3 py-1 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
