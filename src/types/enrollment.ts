import type { CourseOffering } from './courseOffering'
import type { Student } from './student'

export type EnrollmentStatus = 'enrolled' | 'dropped' | 'completed' | 'withdrawn'

export interface Enrollment {
  id: number
  student_id: number
  course_offering_id: number
  enrollment_date: string
  status: EnrollmentStatus
  created_at?: string
  updated_at?: string
  student?: (Student & { program?: { code: string; name: string } | null }) | null
  course_offering?: CourseOffering | null
  grade?: {
    id: number
    midterm_grade?: number | null
    final_grade?: number | null
    final_rating?: number | null
    remarks?: string | null
  } | null
}

export interface EnrollmentListParams {
  student_id?: number | string
  course_offering_id?: number | string
  status?: EnrollmentStatus | ''
  sort?: string
  direction?: 'asc' | 'desc'
  page?: number
  per_page?: number
}

export interface EnrollmentPayload {
  student_id: number | string
  course_offering_id: number | string
  enrollment_date: string
  status?: EnrollmentStatus
}

export const ENROLLMENT_STATUSES: EnrollmentStatus[] = [
  'enrolled',
  'dropped',
  'completed',
  'withdrawn',
]
