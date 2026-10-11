import type { ProgramRef } from './student'

// Mirrors GET /students/{id}/academic-record (AcademicRecordController@show).

export interface AcademicRecordStudent {
  id: number
  student_number: string
  full_name: string
  program: Pick<ProgramRef, 'id' | 'code' | 'name'> | null
  year_level: number
  status: string
}

export interface AcademicRecordCourse {
  enrollment_id: number
  enrollment_status: string
  course_code: string
  course_title: string
  units: number
  section: string | null
  instructor: string | null
  midterm_grade: number | string | null
  final_grade: number | string | null
  final_rating: number | string | null
  remarks: string | null
}

export interface AcademicRecordTerm {
  academic_term_id: number
  academic_year: string
  semester: string
  term_start_date: string | null
  term_end_date: string | null
  courses: AcademicRecordCourse[]
  total_courses: number
  total_units: number
  graded_units: number
  term_weighted_average: number | null
}

export interface AcademicRecordSummary {
  total_terms: number
  total_courses: number
  total_units: number
  graded_units: number
  general_weighted_average: number | null
}

export interface AcademicRecord {
  student: AcademicRecordStudent
  terms: AcademicRecordTerm[]
  summary: AcademicRecordSummary
}
