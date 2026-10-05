import { useCallback } from 'react'
import {
  ResourceIndexPage,
  type ResourceListParams,
} from '../features/shared/ResourceIndexPage'
import { useAuth } from '../hooks/useAuth'
import { deleteCourse, listCourses } from '../services/courseService'
import { COURSE_STATUSES, type Course } from '../types/course'
import { canManageReferenceData } from '../utils/roles'

export function CoursesPage() {
  const { user } = useAuth()
  const canManage = user ? canManageReferenceData(user.role) : false

  const fetchPage = useCallback(
    (params: ResourceListParams) =>
      listCourses({
        search: params.search,
        status: (params.status || '') as Course['status'] | '',
        sort: params.sort,
        direction: params.direction,
        page: params.page,
        per_page: params.per_page,
      }),
    [],
  )

  const remove = useCallback((id: number) => deleteCourse(id), [])

  return (
    <ResourceIndexPage<Course>
      title="Courses"
      description="Manage available courses."
      basePath="/courses"
      canManage={canManage}
      fetchPage={fetchPage}
      remove={remove}
      searchPlaceholder="Search code, title, or description..."
      statusOptions={COURSE_STATUSES}
      defaultSort="course_code"
      sortOptions={[
        { value: 'course_code', label: 'Course code' },
        { value: 'course_title', label: 'Course title' },
        { value: 'units', label: 'Units' },
        { value: 'status', label: 'Status' },
        { value: 'created_at', label: 'Date created' },
      ]}
      columns={[
        { header: 'Code', render: (c) => c.course_code },
        { header: 'Title', render: (c) => c.course_title },
        { header: 'Units', render: (c) => c.units },
        { header: 'Status', render: (c) => c.status },
      ]}
    />
  )
}
