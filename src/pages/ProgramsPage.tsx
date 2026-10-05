import { useCallback } from 'react'
import {
  ResourceIndexPage,
  type ResourceListParams,
} from '../features/shared/ResourceIndexPage'
import { useAuth } from '../hooks/useAuth'
import { deleteProgram, listPrograms } from '../services/programService'
import { PROGRAM_STATUSES, type Program } from '../types/program'
import { canManageReferenceData } from '../utils/roles'

export function ProgramsPage() {
  const { user } = useAuth()
  const canManage = user ? canManageReferenceData(user.role) : false

  const fetchPage = useCallback(
    (params: ResourceListParams) =>
      listPrograms({
        search: params.search,
        status: (params.status || '') as Program['status'] | '',
        sort: params.sort,
        direction: params.direction,
        page: params.page,
        per_page: params.per_page,
      }),
    [],
  )

  const remove = useCallback((id: number) => deleteProgram(id), [])

  return (
    <ResourceIndexPage<Program>
      title="Programs"
      description="Manage academic programs."
      basePath="/programs"
      canManage={canManage}
      fetchPage={fetchPage}
      remove={remove}
      searchPlaceholder="Search code, name, or description..."
      statusOptions={PROGRAM_STATUSES}
      defaultSort="name"
      sortOptions={[
        { value: 'name', label: 'Name' },
        { value: 'code', label: 'Code' },
        { value: 'status', label: 'Status' },
        { value: 'created_at', label: 'Date created' },
      ]}
      columns={[
        { header: 'Code', render: (p) => p.code },
        { header: 'Name', render: (p) => p.name },
        { header: 'Status', render: (p) => p.status },
      ]}
    />
  )
}
