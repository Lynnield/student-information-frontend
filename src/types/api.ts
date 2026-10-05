export type UserRole =
  | 'administrator'
  | 'registrar'
  | 'instructor'
  | 'student'

export type UserStatus = 'active' | 'inactive'

export interface AuthUser {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
}

export interface ApiSuccess<T> {
  success: true
  message?: string
  data: T
}

export interface LoginData {
  token: string
  token_type: string
  user: AuthUser
}

export interface ValidationErrorBody {
  message: string
  errors?: Record<string, string[]>
}

export interface AppErrorBody {
  success?: boolean
  message?: string
}
