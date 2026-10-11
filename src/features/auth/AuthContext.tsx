import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { setUnauthorizedHandler } from '../../services/apiClient'
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
} from '../../services/authService'
import type { AuthUser } from '../../types/api'
import { ApiRequestError } from '../../utils/apiError'
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from '../../utils/tokenStorage'

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isInitializing: boolean
  // Set when the session could not be restored because the API was unreachable.
  sessionError: ApiRequestError | null
  retrySession: () => void
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [sessionError, setSessionError] = useState<ApiRequestError | null>(
    null,
  )
  const [restoreKey, setRestoreKey] = useState(0)

  const retrySession = useCallback(() => {
    setSessionError(null)
    setIsInitializing(true)
    setRestoreKey((key) => key + 1)
  }, [])

  const clearSession = useCallback(() => {
    clearAccessToken()
    setUser(null)
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null)
    })

    return () => {
      setUnauthorizedHandler(null)
    }
  }, [])

  useEffect(() => {
    const token = getAccessToken()

    if (!token) {
      setIsInitializing(false)
      return
    }

    let cancelled = false

    getCurrentUser()
      .then((currentUser) => {
        if (!cancelled) {
          setUser(currentUser)
        }
      })
      .catch((error: unknown) => {
        if (cancelled) {
          return
        }

        if (error instanceof ApiRequestError) {
          if (error.status === 401) {
            clearSession()
          } else if (error.isNetworkError || (error.status ?? 0) >= 500) {
            // Keep the token: the session may still be valid once the API is back.
            setSessionError(error)
          }
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsInitializing(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [clearSession, restoreKey])

  const login = useCallback(async (email: string, password: string) => {
    const data = await loginRequest({ email, password })
    setAccessToken(data.token)
    const currentUser = await getCurrentUser()
    setSessionError(null)
    setUser(currentUser)
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutRequest()
    } catch (error) {
      if (
        error instanceof ApiRequestError &&
        !error.isNetworkError &&
        error.status !== 401
      ) {
        throw error
      }
    } finally {
      clearSession()
    }
  }, [clearSession])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isInitializing,
      sessionError,
      retrySession,
      login,
      logout,
    }),
    [user, isInitializing, sessionError, retrySession, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
