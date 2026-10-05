import type { AcademicTerm } from './academicTerm'
import type { Course } from './course'

export type CourseOfferingStatus = 'open' | 'closed' | 'cancelled' | 'completed'

export interface OfferingInstructor {
  id: number
  name: string
  email: string
  role?: string
  status?: string
}

export interface CourseOffering {
  id: number
  course_id: number
  academic_term_id: number
  instructor_id: number
  section: string
  schedule: string
  room?: string | null
  capacity: number
  status: CourseOfferingStatus
  created_at?: string
  updated_at?: string
  course?: Course | null
  academic_term?: AcademicTerm | null
  instructor?: OfferingInstructor | null
  enrollments?: unknown[]
}

export interface CourseOfferingListParams {
  search?: string
  course_id?: number | string
  academic_term_id?: number | string
  instructor_id?: number | string
  section?: string
  status?: CourseOfferingStatus | ''
  sort?: string
  direction?: 'asc' | 'desc'
  page?: number
  per_page?: number
}

export interface CourseOfferingPayload {
  course_id: number | string
  academic_term_id: number | string
  instructor_id: number | string
  section: string
  schedule: string
  room?: string
  capacity: number | string
  status?: CourseOfferingStatus
}

export const COURSE_OFFERING_STATUSES: CourseOfferingStatus[] = [
  'open',
  'closed',
  'cancelled',
  'completed',
]
