import { useCallback } from 'react'
import {
  ResourceIndexPage,
  type ResourceListParams,
} from '../features/shared/ResourceIndexPage'
import { useAuth } from '../hooks/useAuth'
import {
  deleteAcademicTerm,
  listAcademicTerms,
} from '../services/academicTermService'
import {
  ACADEMIC_TERM_STATUSES,
  type AcademicTerm,
} from '../types/academicTerm'
import { canManageReferenceData } from '../utils/roles'

export function AcademicTermsPage() {
  const { user } = useAuth()
  const canManage = user ? canManageReferenceData(user.role) : false

  const fetchPage = useCallback(
    (params: ResourceListParams) =>
      listAcademicTerms({
        search: params.search,
        status: (params.status || '') as AcademicTerm['status'] | '',
        sort: params.sort,
        direction: params.direction,
        page: params.page,
        per_page: params.per_page,
      }),
    [],
  )

  const remove = useCallback((id: number) => deleteAcademicTerm(id), [])

  return (
    <ResourceIndexPage<AcademicTerm>
      title="Academic Terms"
      description="Manage academic terms and semesters."
      basePath="/academic-terms"
      canManage={canManage}
      fetchPage={fetchPage}
      remove={remove}
      searchPlaceholder="Search academic year or semester..."
      statusOptions={ACADEMIC_TERM_STATUSES}
      defaultSort="term_start_date"
      defaultDirection="desc"
      sortOptions={[
        { value: 'term_start_date', label: 'Start date' },
        { value: 'term_end_date', label: 'End date' },
        { value: 'academic_year', label: 'Academic year' },
        { value: 'semester', label: 'Semester' },
        { value: 'status', label: 'Status' },
        { value: 'created_at', label: 'Date created' },
      ]}
      columns={[
        { header: 'Academic year', render: (t) => t.academic_year },
        { header: 'Semester', render: (t) => t.semester },
        {
          header: 'Start',
          render: (t) => t.term_start_date?.slice(0, 10) ?? '—',
        },
        { header: 'End', render: (t) => t.term_end_date?.slice(0, 10) ?? '—' },
        { header: 'Status', render: (t) => t.status },
      ]}
    />
  )
}
