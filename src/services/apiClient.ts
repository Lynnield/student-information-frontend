import axios, { type AxiosError } from 'axios'
import { parseApiError } from '../utils/apiError'
import { clearAccessToken, getAccessToken } from '../utils/tokenStorage'

const baseURL = import.meta.env.VITE_API_BASE_URL

if (!baseURL) {
  throw new Error(
    'VITE_API_BASE_URL is not set. Copy .env.example to .env and restart Vite.',
  )
}

export const apiClient = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

type UnauthorizedHandler = () => void

let unauthorizedHandler: UnauthorizedHandler | null = null

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  unauthorizedHandler = handler
}

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const parsed = parseApiError(error)
    const requestUrl = String(error.config?.url ?? '')
    const isLoginRequest = requestUrl.includes('/auth/login')

    if (parsed.status === 401 && !isLoginRequest) {
      clearAccessToken()
      unauthorizedHandler?.()
    }

    return Promise.reject(parsed)
  },
)
