import type { ApiSuccess } from '../types/api'
import type {
  Paginated,
  Student,
  StudentListParams,
  StudentPayload,
} from '../types/student'
import { apiClient } from './apiClient'

export async function listStudents(
  params: StudentListParams,
): Promise<Paginated<Student>> {
  const response = await apiClient.get<ApiSuccess<Paginated<Student>>>(
    '/students',
    { params },
  )

  return response.data.data
}

export async function getStudent(id: number | string): Promise<Student> {
  const response = await apiClient.get<ApiSuccess<Student>>(`/students/${id}`)

  return response.data.data
}

export async function createStudent(payload: StudentPayload): Promise<Student> {
  const response = await apiClient.post<ApiSuccess<Student>>(
    '/students',
    payload,
  )

  return response.data.data
}

export async function updateStudent(
  id: number | string,
  payload: Partial<StudentPayload>,
): Promise<Student> {
  const response = await apiClient.put<ApiSuccess<Student>>(
    `/students/${id}`,
    payload,
  )

  return response.data.data
}

export async function deleteStudent(id: number | string): Promise<void> {
  await apiClient.delete(`/students/${id}`)
}
