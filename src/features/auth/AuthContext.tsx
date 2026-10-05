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
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)

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

        if (
          error instanceof ApiRequestError &&
          (error.status === 401 || error.isNetworkError)
        ) {
          if (error.status === 401) {
            clearSession()
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
  }, [clearSession])

  const login = useCallback(async (email: string, password: string) => {
    const data = await loginRequest({ email, password })
    setAccessToken(data.token)
    const currentUser = await getCurrentUser()
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
      login,
      logout,
    }),
    [user, isInitializing, login, logout],
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
