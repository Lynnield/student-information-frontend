import { useState, type FormEvent } from 'react'
import { Alert } from '../components/Alert'
import { useAuth } from '../hooks/useAuth'
import { ApiRequestError } from '../utils/apiError'

export function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setEmailError(null)
    setPasswordError(null)
    setFormError(null)
    setIsSubmitting(true)

    try {
      await login(email, password)
    } catch (error) {
      if (error instanceof ApiRequestError) {
        setEmailError(error.fieldErrors.email?.[0] ?? null)
        setPasswordError(error.fieldErrors.password?.[0] ?? null)
        setFormError(error.message)
      } else {
        setFormError('Unable to sign in. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">
          Student Information System
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Sign in with your account.
        </p>

        <form className="mt-6 space-y-4" onSubmit={(event) => void handleSubmit(event)} noValidate>
          {formError ? <Alert>{formError}</Alert> : null}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-800">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700"
            />
            {emailError ? (
              <p className="mt-1 text-sm text-red-700" role="alert">
                {emailError}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-800">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700"
            />
            {passwordError ? (
              <p className="mt-1 text-sm text-red-700" role="alert">
                {passwordError}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
