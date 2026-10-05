import { useCallback, useEffect, useState } from 'react'
import {
  ResourceIndexPage,
  type ResourceListParams,
} from '../features/shared/ResourceIndexPage'
import { useAuth } from '../hooks/useAuth'
import { listAcademicTerms } from '../services/academicTermService'
import {
  deleteCourseOffering,
  listCourseOfferings,
} from '../services/courseOfferingService'
import { listCourses } from '../services/courseService'
import type { AcademicTerm } from '../types/academicTerm'
import type { Course } from '../types/course'
import type { CourseOffering } from '../types/courseOffering'
import { COURSE_OFFERING_STATUSES } from '../types/courseOffering'
import { canManageReferenceData } from '../utils/roles'

export function CourseOfferingsPage() {
  const { user } = useAuth()
  const canManage = user ? canManageReferenceData(user.role) : false

  const [courses, setCourses] = useState<Course[]>([])
  const [academicTerms, setAcademicTerms] = useState<AcademicTerm[]>([])

  useEffect(() => {
    if (!canManage) {
      return
    }

    listCourses({ per_page: 100 })
      .then((result) => setCourses(result.data))
      .catch(() => setCourses([]))
    listAcademicTerms({ per_page: 100 })
      .then((result) => setAcademicTerms(result.data))
      .catch(() => setAcademicTerms([]))
  }, [canManage])

  const fetchPage = useCallback(
    (params: ResourceListParams) =>
      listCourseOfferings({
        search: params.search,
        course_id: params.course_id,
        academic_term_id: params.academic_term_id,
        status: (params.status || '') as CourseOffering['status'] | '',
        sort: params.sort,
        direction: params.direction,
        page: params.page,
        per_page: params.per_page,
      }),
    [],
  )

  const remove = useCallback((id: number) => deleteCourseOffering(id), [])

  const selectClass =
    'rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700'

  return (
    <ResourceIndexPage<CourseOffering>
      title="Course Offerings"
      description="Manage course offerings and class sections."
      basePath="/course-offerings"
      canManage={canManage}
      fetchPage={fetchPage}
      remove={remove}
      searchPlaceholder="Search section, schedule, room, or course..."
      statusOptions={COURSE_OFFERING_STATUSES}
      defaultSort="created_at"
      defaultDirection="desc"
      sortOptions={[
        { value: 'created_at', label: 'Date created' },
        { value: 'section', label: 'Section' },
        { value: 'capacity', label: 'Capacity' },
        { value: 'status', label: 'Status' },
      ]}
      columns={[
        {
          header: 'Course',
          render: (o) =>
            o.course
              ? `${o.course.course_code} — ${o.course.course_title}`
              : `#${o.course_id}`,
        },
        {
          header: 'Term',
          render: (o) =>
            o.academic_term
              ? `${o.academic_term.semester} ${o.academic_term.academic_year}`
              : `#${o.academic_term_id}`,
        },
        { header: 'Instructor', render: (o) => o.instructor?.name ?? '—' },
        { header: 'Section', render: (o) => o.section },
        { header: 'Schedule', render: (o) => o.schedule },
        { header: 'Room', render: (o) => o.room ?? '—' },
        { header: 'Capacity', render: (o) => o.capacity },
        { header: 'Status', render: (o) => o.status },
      ]}
      renderExtraFilters={
        canManage
          ? (params, updateParams) => (
              <>
                <select
                  value={params.course_id ?? ''}
                  onChange={(event) =>
                    updateParams({
                      course_id: event.target.value || undefined,
                    })
                  }
                  className={selectClass}
                  aria-label="Filter by course"
                >
                  <option value="">All courses</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.course_code}
                    </option>
                  ))}
                </select>
                <select
                  value={params.academic_term_id ?? ''}
                  onChange={(event) =>
                    updateParams({
                      academic_term_id: event.target.value || undefined,
                    })
                  }
                  className={selectClass}
                  aria-label="Filter by academic term"
                >
                  <option value="">All academic terms</option>
                  {academicTerms.map((term) => (
                    <option key={term.id} value={term.id}>
                      {term.semester} {term.academic_year}
                    </option>
                  ))}
                </select>
              </>
            )
          : undefined
      }
    />
  )
}
