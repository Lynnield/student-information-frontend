import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { ResourceDetailsPage } from '../features/shared/ResourceDetailsPage'
import { getAcademicTerm } from '../services/academicTermService'
import type { AcademicTerm } from '../types/academicTerm'

export function AcademicTermDetailsPage() {
  const { id } = useParams<{ id: string }>()

  const fetchById = useCallback(
    (termId: string) => getAcademicTerm(termId),
    [],
  )

  return (
    <ResourceDetailsPage<AcademicTerm>
      title="academic term"
      basePath="/academic-terms"
      fetchById={fetchById}
      id={id}
      heading={(term) => `${term.semester} — ${term.academic_year}`}
      rows={(term) => [
        ['Academic year', term.academic_year],
        ['Semester', term.semester],
        ['Term start date', term.term_start_date?.slice(0, 10)],
        ['Term end date', term.term_end_date?.slice(0, 10)],
        ['Status', term.status],
      ]}
    />
  )
}
