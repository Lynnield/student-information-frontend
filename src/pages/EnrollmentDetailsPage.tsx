import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { ResourceDetailsPage } from '../features/shared/ResourceDetailsPage'
import { getEnrollment } from '../services/enrollmentService'
import type { Enrollment } from '../types/enrollment'

export function EnrollmentDetailsPage() {
  const { id } = useParams<{ id: string }>()

  const fetchById = useCallback(
    (enrollmentId: string) => getEnrollment(enrollmentId),
    [],
  )

  return (
    <ResourceDetailsPage<Enrollment>
      title="enrollment"
      basePath="/enrollments"
      fetchById={fetchById}
      id={id}
      heading={(enrollment) =>
        enrollment.student
          ? `${enrollment.student.last_name}, ${enrollment.student.first_name}`
          : `Enrollment #${enrollment.id}`
      }
      rows={(enrollment) => [
        [
          'Student',
          enrollment.student
            ? `${enrollment.student.student_number} — ${enrollment.student.last_name}, ${enrollment.student.first_name}`
            : String(enrollment.student_id),
        ],
        [
          'Course offering',
          enrollment.course_offering
            ? `${enrollment.course_offering.course?.course_code ?? ''} — ${enrollment.course_offering.section}`
            : String(enrollment.course_offering_id),
        ],
        [
          'Academic term',
          enrollment.course_offering?.academic_term
            ? `${enrollment.course_offering.academic_term.semester} — ${enrollment.course_offering.academic_term.academic_year}`
            : null,
        ],
        [
          'Instructor',
          enrollment.course_offering?.instructor?.name ?? null,
        ],
        [
          'Enrollment date',
          enrollment.enrollment_date?.slice(0, 10) ?? null,
        ],
        ['Status', enrollment.status],
      ]}
    />
  )
}
