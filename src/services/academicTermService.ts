import type { ApiSuccess } from '../types/api'
import type { Paginated } from '../types/student'
import type {
  AcademicTerm,
  AcademicTermListParams,
  AcademicTermPayload,
} from '../types/academicTerm'
import { apiClient } from './apiClient'

export async function listAcademicTerms(
  params: AcademicTermListParams,
): Promise<Paginated<AcademicTerm>> {
  const response = await apiClient.get<ApiSuccess<Paginated<AcademicTerm>>>(
    '/academic-terms',
    { params },
  )

  return response.data.data
}

export async function getAcademicTerm(
  id: number | string,
): Promise<AcademicTerm> {
  const response = await apiClient.get<ApiSuccess<AcademicTerm>>(
    `/academic-terms/${id}`,
  )

  return response.data.data
}

export async function createAcademicTerm(
  payload: AcademicTermPayload,
): Promise<AcademicTerm> {
  const response = await apiClient.post<ApiSuccess<AcademicTerm>>(
    '/academic-terms',
    payload,
  )

  return response.data.data
}

export async function updateAcademicTerm(
  id: number | string,
  payload: Partial<AcademicTermPayload>,
): Promise<AcademicTerm> {
  const response = await apiClient.put<ApiSuccess<AcademicTerm>>(
    `/academic-terms/${id}`,
    payload,
  )

  return response.data.data
}

export async function deleteAcademicTerm(id: number | string): Promise<void> {
  await apiClient.delete(`/academic-terms/${id}`)
}
