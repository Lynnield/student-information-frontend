import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { ResourceDetailsPage } from '../features/shared/ResourceDetailsPage'
import { getCourse } from '../services/courseService'
import type { Course } from '../types/course'

export function CourseDetailsPage() {
  const { id } = useParams<{ id: string }>()

  const fetchById = useCallback((courseId: string) => getCourse(courseId), [])

  return (
    <ResourceDetailsPage<Course>
      title="course"
      basePath="/courses"
      fetchById={fetchById}
      id={id}
      heading={(course) => course.course_title}
      rows={(course) => [
        ['Course code', course.course_code],
        ['Course title', course.course_title],
        ['Description', course.description],
        ['Units', course.units],
        ['Status', course.status],
      ]}
    />
  )
}
