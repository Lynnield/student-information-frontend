import type { ApiSuccess, AuthUser, LoginData } from '../types/api'
import { apiClient } from './apiClient'

export interface LoginPayload {
  email: string
  password: string
}

export async function login(payload: LoginPayload): Promise<LoginData> {
  const response = await apiClient.post<ApiSuccess<LoginData>>(
    '/auth/login',
    payload,
  )

  return response.data.data
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout')
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await apiClient.get<ApiSuccess<AuthUser>>('/auth/me')

  return response.data.data
}
