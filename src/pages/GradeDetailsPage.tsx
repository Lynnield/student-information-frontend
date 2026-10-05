import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { ResourceDetailsPage } from '../features/shared/ResourceDetailsPage'
import { getGrade } from '../services/gradeService'
import type { Grade } from '../types/grade'

export function GradeDetailsPage() {
  const { id } = useParams<{ id: string }>()

  const fetchById = useCallback((gradeId: string) => getGrade(gradeId), [])

  return (
    <ResourceDetailsPage<Grade>
      title="grade"
      basePath="/grades"
      fetchById={fetchById}
      id={id}
      heading={(grade) =>
        grade.enrollment?.student
          ? `${grade.enrollment.student.last_name}, ${grade.enrollment.student.first_name}`
          : `Grade #${grade.id}`
      }
      rows={(grade) => [
        [
          'Student',
          grade.enrollment?.student
            ? `${grade.enrollment.student.student_number} — ${grade.enrollment.student.last_name}, ${grade.enrollment.student.first_name}`
            : null,
        ],
        [
          'Course',
          grade.enrollment?.course_offering?.course
            ? `${grade.enrollment.course_offering.course.course_code} — ${grade.enrollment.course_offering.course.course_title}`
            : null,
        ],
        [
          'Academic term',
          grade.enrollment?.course_offering?.academic_term
            ? `${grade.enrollment.course_offering.academic_term.semester} — ${grade.enrollment.course_offering.academic_term.academic_year}`
            : null,
        ],
        [
          'Instructor',
          grade.enrollment?.course_offering?.instructor?.name ?? null,
        ],
        ['Midterm grade', grade.midterm_grade],
        ['Final grade', grade.final_grade],
        ['Final rating', grade.final_rating],
        ['Remarks', grade.remarks],
      ]}
    />
  )
}
