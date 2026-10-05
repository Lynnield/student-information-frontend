import type { ApiSuccess } from '../types/api'
import type { Grade, GradeListParams, GradePayload } from '../types/grade'
import type { Paginated } from '../types/student'
import { apiClient } from './apiClient'

export async function listGrades(
  params: GradeListParams,
): Promise<Paginated<Grade>> {
  const response = await apiClient.get<ApiSuccess<Paginated<Grade>>>(
    '/grades',
    { params },
  )

  return response.data.data
}

export async function getGrade(id: number | string): Promise<Grade> {
  const response = await apiClient.get<ApiSuccess<Grade>>(`/grades/${id}`)

  return response.data.data
}

export async function createGrade(payload: GradePayload): Promise<Grade> {
  const response = await apiClient.post<ApiSuccess<Grade>>('/grades', payload)

  return response.data.data
}

export async function updateGrade(
  id: number | string,
  payload: Partial<GradePayload>,
): Promise<Grade> {
  const response = await apiClient.put<ApiSuccess<Grade>>(
    `/grades/${id}`,
    payload,
  )

  return response.data.data
}

export async function deleteGrade(id: number | string): Promise<void> {
  await apiClient.delete(`/grades/${id}`)
}
