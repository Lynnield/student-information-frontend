export type CourseStatus = 'active' | 'inactive'

export interface Course {
  id: number
  course_code: string
  course_title: string
  description?: string | null
  units: number
  status: CourseStatus
  created_at?: string
  updated_at?: string
  courseOfferings?: unknown[]
}

export interface CourseListParams {
  search?: string
  status?: CourseStatus | ''
  sort?: string
  direction?: 'asc' | 'desc'
  page?: number
  per_page?: number
}

export interface CoursePayload {
  course_code: string
  course_title: string
  description?: string
  units: number | string
  status?: CourseStatus
}

export const COURSE_STATUSES: CourseStatus[] = ['active', 'inactive']
