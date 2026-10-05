import { useCallback, useEffect, useState } from 'react'
import {
  ResourceIndexPage,
  type ResourceListParams,
} from '../features/shared/ResourceIndexPage'
import { useAuth } from '../hooks/useAuth'
import { listCourseOfferings } from '../services/courseOfferingService'
import { deleteGrade, listGrades } from '../services/gradeService'
import { listStudents } from '../services/studentService'
import type { CourseOffering } from '../types/courseOffering'
import type { Grade } from '../types/grade'
import type { Student } from '../types/student'
import { canDeleteGrades, canManageGrades } from '../utils/roles'

export function GradesPage() {
  const { user } = useAuth()
  const canManage = user ? canManageGrades(user.role) : false
  const canDelete = user ? canDeleteGrades(user.role) : false

  const [students, setStudents] = useState<Student[]>([])
  const [courseOfferings, setCourseOfferings] = useState<CourseOffering[]>([])

  useEffect(() => {
    if (!user || user.role === 'student') {
      return
    }

    listStudents({ per_page: 100 })
      .then((result) => setStudents(result.data))
      .catch(() => setStudents([]))
    listCourseOfferings({ per_page: 100 })
      .then((result) => setCourseOfferings(result.data))
      .catch(() => setCourseOfferings([]))
  }, [user])

  const fetchPage = useCallback(
    (params: ResourceListParams) =>
      listGrades({
        student_id: params.student_id,
        course_offering_id: params.course_offering_id,
        remarks: params.remarks || undefined,
        sort: params.sort,
        direction: params.direction,
        page: params.page,
        per_page: params.per_page,
      }),
    [],
  )

  const remove = useCallback((id: number) => deleteGrade(id), [])

  const selectClass =
    'rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700'

  return (
    <ResourceIndexPage<Grade>
      title="Grades"
      description="Manage and view student grades."
      basePath="/grades"
      canManage={canManage}
      canCreate={canManage}
      canUpdate={canManage}
      canDelete={canDelete}
      fetchPage={fetchPage}
      remove={remove}
      showSearch={false}
      searchPlaceholder=""
      showStatusFilter={false}
      statusOptions={[]}
      defaultSort="created_at"
      defaultDirection="desc"
      sortOptions={[
        { value: 'created_at', label: 'Date created' },
        { value: 'midterm_grade', label: 'Midterm grade' },
        { value: 'final_grade', label: 'Final grade' },
        { value: 'final_rating', label: 'Final rating' },
      ]}
      columns={[
        {
          header: 'Student',
          render: (g) =>
            g.enrollment?.student
              ? `${g.enrollment.student.last_name}, ${g.enrollment.student.first_name}`
              : '—',
        },
        {
          header: 'Course',
          render: (g) =>
            g.enrollment?.course_offering?.course?.course_code ?? '—',
        },
        {
          header: 'Term',
          render: (g) =>
            g.enrollment?.course_offering?.academic_term
              ? `${g.enrollment.course_offering.academic_term.semester} ${g.enrollment.course_offering.academic_term.academic_year}`
              : '—',
        },
        { header: 'Midterm', render: (g) => g.midterm_grade ?? '—' },
        { header: 'Final', render: (g) => g.final_grade ?? '—' },
        { header: 'Rating', render: (g) => g.final_rating ?? '—' },
        { header: 'Remarks', render: (g) => g.remarks ?? '—' },
      ]}
      renderExtraFilters={(params, updateParams) => (
        <>
          {user && user.role !== 'student' ? (
            <select
              value={params.student_id ?? ''}
              onChange={(event) =>
                updateParams({ student_id: event.target.value || undefined })
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
          ) : null}
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
          <input
            type="search"
            placeholder="Filter by remarks..."
            value={params.remarks ?? ''}
            onChange={(event) =>
              updateParams({ remarks: event.target.value || undefined })
            }
            className={selectClass}
            aria-label="Filter by remarks"
          />
        </>
      )}
    />
  )
}
