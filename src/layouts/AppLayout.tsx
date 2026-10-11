import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { useAuth } from '../hooks/useAuth'
import type { UserRole } from '../types/api'
import { ROLE_LABELS } from '../utils/roles'

interface NavItem {
  to: string
  label: string
  roles: UserRole[] | 'all'
}

const navItems: NavItem[] = [
  { to: '/', label: 'Dashboard', roles: 'all' },
  {
    to: '/students',
    label: 'Students',
    roles: ['administrator', 'registrar'],
  },
  {
    to: '/programs',
    label: 'Programs',
    roles: ['administrator', 'registrar'],
  },
  {
    to: '/courses',
    label: 'Courses',
    roles: ['administrator', 'registrar'],
  },
  {
    to: '/academic-terms',
    label: 'Academic Terms',
    roles: ['administrator', 'registrar'],
  },
  {
    to: '/course-offerings',
    label: 'Course Offerings',
    roles: ['administrator', 'registrar', 'instructor', 'student'],
  },
  {
    to: '/enrollments',
    label: 'Enrollments',
    roles: ['administrator', 'registrar', 'instructor', 'student'],
  },
  {
    to: '/grades',
    label: 'Grades',
    roles: ['administrator', 'registrar', 'instructor', 'student'],
  },
  {
    to: '/academic-record',
    label: 'Academic Record',
    roles: ['administrator', 'registrar', 'student'],
  },
  { to: '/profile', label: 'Profile', roles: 'all' },
]

function isVisible(item: NavItem, role: UserRole): boolean {
  return item.roles === 'all' || item.roles.includes(role)
}

export function AppLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logoutError, setLogoutError] = useState<string | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  if (!user) {
    return null
  }

  const items = navItems.filter((item) => isVisible(item, user.role))

  async function handleLogout() {
    setLogoutError(null)
    setIsLoggingOut(true)

    try {
      await logout()
    } catch (error) {
      setIsLoggingOut(false)
      setLogoutError(
        error instanceof Error
          ? error.message
          : 'Unable to log out. Please try again.',
      )
    }
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
      isActive
        ? 'bg-slate-800 text-white'
        : 'text-slate-200 hover:bg-slate-800 hover:text-white'
    }`

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <div
        className={`fixed inset-0 z-20 bg-slate-900/50 lg:hidden ${mobileOpen ? 'block' : 'hidden'}`}
      >
        <button
          type="button"
          className="h-full w-full cursor-default"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      </div>

      <aside
        id="mobile-nav"
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-slate-900 p-4 text-slate-100 transition-transform lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <p className="px-3 text-xs font-semibold tracking-wide text-slate-400 uppercase">
          Student Information
        </p>
        <nav className="mt-6 flex flex-col gap-1" aria-label="Main">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={navLinkClass}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
          <button
            type="button"
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-800 lg:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700"
            onClick={() => setMobileOpen(true)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
          >
            Menu
          </button>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">
              {user.name}
            </p>
            <p className="text-xs text-slate-600">
              {ROLE_LABELS[user.role]} · {user.email}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void handleLogout()}
            disabled={isLoggingOut}
            className="rounded-md bg-slate-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700"
          >
            {isLoggingOut ? 'Logging out...' : 'Log out'}
          </button>
        </header>

        {logoutError ? (
          <p className="bg-red-50 px-4 py-2 text-sm text-red-800" role="alert">
            {logoutError}
          </p>
        ) : null}

        <main className="flex-1 p-4 lg:p-6">
          <ErrorBoundary key={location.pathname}>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
