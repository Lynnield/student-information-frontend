export type ProgramStatus = 'active' | 'inactive'

export interface Program {
  id: number
  code: string
  name: string
  description?: string | null
  status: ProgramStatus
  created_at?: string
  updated_at?: string
  students?: unknown[]
}

export interface ProgramListParams {
  search?: string
  status?: ProgramStatus | ''
  sort?: string
  direction?: 'asc' | 'desc'
  page?: number
  per_page?: number
}

export interface ProgramPayload {
  code: string
  name: string
  description?: string
  status?: ProgramStatus
}

export const PROGRAM_STATUSES: ProgramStatus[] = ['active', 'inactive']
