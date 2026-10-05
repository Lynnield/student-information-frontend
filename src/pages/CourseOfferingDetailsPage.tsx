import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { ResourceDetailsPage } from '../features/shared/ResourceDetailsPage'
import { getCourseOffering } from '../services/courseOfferingService'
import type { CourseOffering } from '../types/courseOffering'

export function CourseOfferingDetailsPage() {
  const { id } = useParams<{ id: string }>()

  const fetchById = useCallback(
    (offeringId: string) => getCourseOffering(offeringId),
    [],
  )

  return (
    <ResourceDetailsPage<CourseOffering>
      title="course offering"
      basePath="/course-offerings"
      fetchById={fetchById}
      id={id}
      heading={(offering) =>
        offering.course
          ? `${offering.course.course_code} — ${offering.section}`
          : `Offering #${offering.id}`
      }
      rows={(offering) => [
        [
          'Course',
          offering.course
            ? `${offering.course.course_code} — ${offering.course.course_title}`
            : String(offering.course_id),
        ],
        [
          'Academic term',
          offering.academic_term
            ? `${offering.academic_term.semester} — ${offering.academic_term.academic_year}`
            : String(offering.academic_term_id),
        ],
        ['Instructor', offering.instructor?.name],
        ['Section', offering.section],
        ['Schedule', offering.schedule],
        ['Room', offering.room],
        ['Capacity', offering.capacity],
        ['Status', offering.status],
      ]}
    />
  )
}
