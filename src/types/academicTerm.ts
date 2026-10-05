export type AcademicTermStatus = 'active' | 'inactive' | 'completed'

export interface AcademicTerm {
  id: number
  academic_year: string
  semester: string
  term_start_date: string
  term_end_date: string
  status: AcademicTermStatus
  created_at?: string
  updated_at?: string
  courseOfferings?: unknown[]
}

export interface AcademicTermListParams {
  search?: string
  status?: AcademicTermStatus | ''
  sort?: string
  direction?: 'asc' | 'desc'
  page?: number
  per_page?: number
}

export interface AcademicTermPayload {
  academic_year: string
  semester: string
  term_start_date: string
  term_end_date: string
  status?: AcademicTermStatus
}

export const ACADEMIC_TERM_STATUSES: AcademicTermStatus[] = [
  'active',
  'inactive',
  'completed',
]

export const SEMESTERS = ['1st Semester', '2nd Semester', 'Summer'] as const
