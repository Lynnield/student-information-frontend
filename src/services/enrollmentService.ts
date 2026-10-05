import type { ApiSuccess } from '../types/api'
import type {
  Enrollment,
  EnrollmentListParams,
  EnrollmentPayload,
} from '../types/enrollment'
import type { Paginated } from '../types/student'
import { apiClient } from './apiClient'

export async function listEnrollments(
  params: EnrollmentListParams,
): Promise<Paginated<Enrollment>> {
  const response = await apiClient.get<ApiSuccess<Paginated<Enrollment>>>(
    '/enrollments',
    { params },
  )

  return response.data.data
}

export async function getEnrollment(
  id: number | string,
): Promise<Enrollment> {
  const response = await apiClient.get<ApiSuccess<Enrollment>>(
    `/enrollments/${id}`,
  )

  return response.data.data
}

export async function createEnrollment(
  payload: EnrollmentPayload,
): Promise<Enrollment> {
  const response = await apiClient.post<ApiSuccess<Enrollment>>(
    '/enrollments',
    payload,
  )

  return response.data.data
}

export async function updateEnrollment(
  id: number | string,
  payload: Partial<EnrollmentPayload>,
): Promise<Enrollment> {
  const response = await apiClient.put<ApiSuccess<Enrollment>>(
    `/enrollments/${id}`,
    payload,
  )

  return response.data.data
}

export async function deleteEnrollment(id: number | string): Promise<void> {
  await apiClient.delete(`/enrollments/${id}`)
}
