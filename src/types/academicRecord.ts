import type { Enrollment } from './enrollment'
import type { Student } from './student'

export interface AcademicRecord {
  student: Student
  academic_record: Enrollment[]
}
