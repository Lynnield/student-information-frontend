import type { Enrollment } from './enrollment'

export interface Grade {
  id: number
  enrollment_id: number
  midterm_grade?: number | null
  final_grade?: number | null
  final_rating?: number | null
  remarks?: string | null
  created_at?: string
  updated_at?: string
  enrollment?: Enrollment | null
}

export interface GradeListParams {
  student_id?: number | string
  course_offering_id?: number | string
  remarks?: string
  sort?: string
  direction?: 'asc' | 'desc'
  page?: number
  per_page?: number
}

export interface GradePayload {
  enrollment_id: number | string
  midterm_grade?: number | string | null
  final_grade?: number | string | null
  final_rating?: number | string | null
  remarks?: string
}
