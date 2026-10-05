import { useCallback, useEffect, useState } from 'react'
import {
  ResourceIndexPage,
  type ResourceListParams,
} from '../features/shared/ResourceIndexPage'
import { useAuth } from '../hooks/useAuth'
import { listCourseOfferings } from '../services/courseOfferingService'
import { deleteEnrollment, listEnrollments } from '../services/enrollmentService'
import { listStudents } from '../services/studentService'
import type { CourseOffering } from '../types/courseOffering'
import type { Enrollment } from '../types/enrollment'
import { ENROLLMENT_STATUSES } from '../types/enrollment'
import type { Student } from '../types/student'
import { canManageReferenceData } from '../utils/roles'

export function EnrollmentsPage() {
  const { user } = useAuth()
  const canManage = user ? canManageReferenceData(user.role) : false

  const [students, setStudents] = useState<Student[]>([])
  const [courseOfferings, setCourseOfferings] = useState<CourseOffering[]>([])

  useEffect(() => {
    if (!canManage) {
      return
    }

    listStudents({ per_page: 100 })
      .then((result) => setStudents(result.data))
      .catch(() => setStudents([]))
    listCourseOfferings({ per_page: 100 })
      .then((result) => setCourseOfferings(result.data))
      .catch(() => setCourseOfferings([]))
  }, [canManage])

  const fetchPage = useCallback(
    (params: ResourceListParams) =>
      listEnrollments({
        student_id: params.student_id,
        course_offering_id: params.course_offering_id,
        status: (params.status || '') as Enrollment['status'] | '',
        sort: params.sort,
        direction: params.direction,
        page: params.page,
        per_page: params.per_page,
      }),
    [],
  )

  const remove = useCallback((id: number) => deleteEnrollment(id), [])

  const selectClass =
    'rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700'

  return (
    <ResourceIndexPage<Enrollment>
      title="Enrollments"
      description="Manage student course enrollments."
      basePath="/enrollments"
      canManage={canManage}
      fetchPage={fetchPage}
      remove={remove}
      showSearch={false}
      searchPlaceholder=""
      statusOptions={ENROLLMENT_STATUSES}
      defaultSort="enrollment_date"
      defaultDirection="desc"
      sortOptions={[
        { value: 'enrollment_date', label: 'Enrollment date' },
        { value: 'status', label: 'Status' },
        { value: 'created_at', label: 'Date created' },
      ]}
      columns={[
        {
          header: 'Student',
          render: (e) =>
            e.student
              ? `${e.student.last_name}, ${e.student.first_name}`
              : `#${e.student_id}`,
        },
        {
          header: 'Course offering',
          render: (e) =>
            e.course_offering
              ? `${e.course_offering.course?.course_code ?? ''} ${e.course_offering.section}`
              : `#${e.course_offering_id}`,
        },
        {
          header: 'Term',
          render: (e) =>
            e.course_offering?.academic_term
              ? `${e.course_offering.academic_term.semester} ${e.course_offering.academic_term.academic_year}`
              : '—',
        },
        {
          header: 'Date',
          render: (e) => e.enrollment_date?.slice(0, 10) ?? '—',
        },
        { header: 'Status', render: (e) => e.status },
      ]}
      renderExtraFilters={
        canManage
          ? (params, updateParams) => (
              <>
                <select
                  value={params.student_id ?? ''}
                  onChange={(event) =>
                    updateParams({
                      student_id: event.target.value || undefined,
                    })
                  }
                  className={selectClass}
                  aria-label="Filter by student"
                >
                  <option value="">All students</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.last_name}, {student.first_name}
                    </option>
                  ))}
                </select>
                <select
                  value={params.course_offering_id ?? ''}
                  onChange={(event) =>
                    updateParams({
                      course_offering_id: event.target.value || undefined,
                    })
                  }
                  className={selectClass}
                  aria-label="Filter by course offering"
                >
                  <option value="">All course offerings</option>
                  {courseOfferings.map((offering) => (
                    <option key={offering.id} value={offering.id}>
                      {offering.course?.course_code ?? `#${offering.course_id}`}{' '}
                      {offering.section}
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
