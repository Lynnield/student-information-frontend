export type StudentStatus = 'active' | 'inactive' | 'graduated' | 'dropped'

export interface ProgramRef {
  id: number
  code: string
  name: string
  description?: string | null
  status?: string
}

export interface Student {
  id: number
  student_number: string
  first_name: string
  middle_name?: string | null
  last_name: string
  suffix?: string | null
  birth_date: string
  email: string
  contact_number?: string | null
  address?: string | null
  program_id: number
  year_level: number
  status: StudentStatus
  created_at?: string
  updated_at?: string
  program?: ProgramRef | null
  enrollments?: unknown[]
}

export interface Paginated<T> {
  current_page: number
  data: T[]
  first_page_url?: string | null
  from: number | null
  last_page: number
  last_page_url?: string | null
  next_page_url?: string | null
  path?: string
  per_page: number
  prev_page_url?: string | null
  to: number | null
  total: number
}

export interface StudentListParams {
  search?: string
  program_id?: number | string
  status?: StudentStatus | ''
  sort?: string
  direction?: 'asc' | 'desc'
  page?: number
  per_page?: number
}

export interface StudentPayload {
  student_number: string
  first_name: string
  middle_name?: string
  last_name: string
  suffix?: string
  birth_date: string
  email: string
  contact_number?: string
  address?: string
  program_id: number | string
  year_level: number | string
  status?: StudentStatus
}

export const STUDENT_STATUSES: StudentStatus[] = [
  'active',
  'inactive',
  'graduated',
  'dropped',
]
