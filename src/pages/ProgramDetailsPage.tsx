import { useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { ResourceDetailsPage } from '../features/shared/ResourceDetailsPage'
import { getProgram } from '../services/programService'
import type { Program } from '../types/program'

export function ProgramDetailsPage() {
  const { id } = useParams<{ id: string }>()

  const fetchById = useCallback((programId: string) => getProgram(programId), [])

  return (
    <ResourceDetailsPage<Program>
      title="program"
      basePath="/programs"
      fetchById={fetchById}
      id={id}
      heading={(program) => program.name}
      rows={(program) => [
        ['Code', program.code],
        ['Name', program.name],
        ['Description', program.description],
        ['Status', program.status],
      ]}
    />
  )
}
