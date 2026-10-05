import type { ApiSuccess } from '../types/api'
import type { AcademicRecord } from '../types/academicRecord'
import { apiClient } from './apiClient'

export async function getAcademicRecord(
  studentId: number | string,
): Promise<AcademicRecord> {
  const response = await apiClient.get<ApiSuccess<AcademicRecord>>(
    `/students/${studentId}/academic-record`,
  )

  return response.data.data
}
