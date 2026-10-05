import type { ApiSuccess } from '../types/api'
import type { Paginated } from '../types/student'
import type { Course, CourseListParams, CoursePayload } from '../types/course'
import { apiClient } from './apiClient'

export async function listCourses(
  params: CourseListParams,
): Promise<Paginated<Course>> {
  const response = await apiClient.get<ApiSuccess<Paginated<Course>>>(
    '/courses',
    { params },
  )

  return response.data.data
}

export async function getCourse(id: number | string): Promise<Course> {
  const response = await apiClient.get<ApiSuccess<Course>>(`/courses/${id}`)

  return response.data.data
}

export async function createCourse(payload: CoursePayload): Promise<Course> {
  const response = await apiClient.post<ApiSuccess<Course>>(
    '/courses',
    payload,
  )

  return response.data.data
}

export async function updateCourse(
  id: number | string,
  payload: Partial<CoursePayload>,
): Promise<Course> {
  const response = await apiClient.put<ApiSuccess<Course>>(
    `/courses/${id}`,
    payload,
  )

  return response.data.data
}

export async function deleteCourse(id: number | string): Promise<void> {
  await apiClient.delete(`/courses/${id}`)
}
