import type { ApiSuccess } from '../types/api'
import type { Paginated } from '../types/student'
import type {
  Program,
  ProgramListParams,
  ProgramPayload,
} from '../types/program'
import { apiClient } from './apiClient'

export async function listPrograms(
  params: ProgramListParams = { per_page: 100 },
): Promise<Paginated<Program>> {
  const response = await apiClient.get<ApiSuccess<Paginated<Program>>>(
    '/programs',
    { params },
  )

  return response.data.data
}

export async function listAllPrograms(): Promise<Program[]> {
  const result = await listPrograms({ per_page: 100 })

  return result.data
}

export async function getProgram(id: number | string): Promise<Program> {
  const response = await apiClient.get<ApiSuccess<Program>>(`/programs/${id}`)

  return response.data.data
}

export async function createProgram(payload: ProgramPayload): Promise<Program> {
  const response = await apiClient.post<ApiSuccess<Program>>(
    '/programs',
    payload,
  )

  return response.data.data
}

export async function updateProgram(
  id: number | string,
  payload: Partial<ProgramPayload>,
): Promise<Program> {
  const response = await apiClient.put<ApiSuccess<Program>>(
    `/programs/${id}`,
    payload,
  )

  return response.data.data
}

export async function deleteProgram(id: number | string): Promise<void> {
  await apiClient.delete(`/programs/${id}`)
}
