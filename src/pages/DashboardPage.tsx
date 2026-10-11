import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Spinner } from '../components/Spinner'
import { useAuth } from '../hooks/useAuth'
import { listAcademicTerms } from '../services/academicTermService'
import { listCourseOfferings } from '../services/courseOfferingService'
import { listCourses } from '../services/courseService'
import { listEnrollments } from '../services/enrollmentService'
import { listGrades } from '../services/gradeService'
import { listPrograms } from '../services/programService'
import { listStudents } from '../services/studentService'
import type { UserRole } from '../types/api'
import { ApiRequestError } from '../utils/apiError'
import { ROLE_LABELS } from '../utils/roles'

interface SummaryCard {
  label: string
  to: string
  roles: UserRole[]
  // Fetches one record; the backend's pagination `total` is the count.
  fetchTotal: () => Promise<number>
}

const STAFF: UserRole[] = ['administrator', 'registrar']
const ALL: UserRole[] = ['administrator', 'registrar', 'instructor', 'student']

const summaryCards: SummaryCard[] = [
  {
    label: 'Students',
    to: '/students',
    roles: STAFF,
    fetchTotal: () => listStudents({ per_page: 1 }).then((r) => r.total),
  },
  {
    label: 'Programs',
    to: '/programs',
    roles: STAFF,
    fetchTotal: () => listPrograms({ per_page: 1 }).then((r) => r.total),
  },
  {
    label: 'Courses',
    to: '/courses',
    roles: STAFF,
    fetchTotal: () => listCourses({ per_page: 1 }).then((r) => r.total),
  },
  {
    label: 'Academic Terms',
    to: '/academic-terms',
    roles: STAFF,
    fetchTotal: () => listAcademicTerms({ per_page: 1 }).then((r) => r.total),
  },
  {
    label: 'Course Offerings',
    to: '/course-offerings',
    roles: ALL,
    fetchTotal: () =>
      listCourseOfferings({ per_page: 1 }).then((r) => r.total),
  },
  {
    label: 'Enrollments',
    to: '/enrollments',
    roles: ALL,
    fetchTotal: () => listEnrollments({ per_page: 1 }).then((r) => r.total),
  },
  {
    label: 'Grades',
    to: '/grades',
    roles: ALL,
    fetchTotal: () => listGrades({ per_page: 1 }).then((r) => r.total),
  },
]

type CardResult =
  | { state: 'loading' }
  | { state: 'ok'; total: number }
  | { state: 'error'; message: string }

export function DashboardPage() {
  const { user } = useAuth()
  const [results, setResults] = useState<Record<string, CardResult>>({})

  const role = user?.role
  const cards = role
    ? summaryCards.filter((card) => card.roles.includes(role))
    : []

  useEffect(() => {
    if (!role) {
      return
    }

    let cancelled = false
    const visible = summaryCards.filter((card) => card.roles.includes(role))

    for (const card of visible) {
      card
        .fetchTotal()
        .then((total) => {
          if (!cancelled) {
            setResults((prev) => ({ ...prev, [card.to]: { state: 'ok', total } }))
          }
        })
        .catch((err: unknown) => {
          if (!cancelled) {
            const message =
              err instanceof ApiRequestError && err.status === 403
                ? 'No access'
                : 'Unavailable'
            setResults((prev) => ({
              ...prev,
              [card.to]: { state: 'error', message },
            }))
          }
        })
    }

    return () => {
      cancelled = true
    }
  }, [role])

  if (!user) {
    return null
  }

  const scopeNote =
    user.role === 'student'
      ? 'Counts include only your own records.'
      : user.role === 'instructor'
        ? 'Counts include only records the server allows you to see.'
        : 'Totals as reported by the server.'

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

      <section aria-labelledby="overview-heading" className="space-y-3">
        <div>
          <h2
            id="overview-heading"
            className="text-base font-semibold text-slate-900"
          >
            Overview
          </h2>
          <p className="text-sm text-slate-600">{scopeNote}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => {
            const result = results[card.to] ?? { state: 'loading' }

            return (
              <Link
                key={card.to}
                to={card.to}
                className="rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700"
              >
                <p className="text-sm text-slate-600">{card.label}</p>
                <div className="mt-1 min-h-8">
                  {result.state === 'loading' ? (
                    <Spinner label="Loading..." />
                  ) : result.state === 'ok' ? (
                    <p className="text-2xl font-semibold text-slate-900">
                      {result.total}
                    </p>
                  ) : (
                    <p className="text-sm font-medium text-slate-500">
                      {result.message}
                    </p>
                  )}
                </div>
                <p className="mt-2 text-xs font-medium text-slate-700">
                  Open {card.label.toLowerCase()} →
                </p>
              </Link>
            )
          })}
        </div>

        {user.role !== 'instructor' ? (
          <Link
            to="/academic-record"
            className="inline-flex rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700"
          >
            View academic record
          </Link>
        ) : null}
      </section>
    </div>
  )
}
