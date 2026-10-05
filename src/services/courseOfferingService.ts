import type { ApiSuccess } from '../types/api'
import type { Paginated } from '../types/student'
import type {
  CourseOffering,
  CourseOfferingListParams,
  CourseOfferingPayload,
} from '../types/courseOffering'
import { apiClient } from './apiClient'

export async function listCourseOfferings(
  params: CourseOfferingListParams,
): Promise<Paginated<CourseOffering>> {
  const response = await apiClient.get<ApiSuccess<Paginated<CourseOffering>>>(
    '/course-offerings',
    { params },
  )

  return response.data.data
}

export async function getCourseOffering(
  id: number | string,
): Promise<CourseOffering> {
  const response = await apiClient.get<ApiSuccess<CourseOffering>>(
    `/course-offerings/${id}`,
  )

  return response.data.data
}

export async function createCourseOffering(
  payload: CourseOfferingPayload,
): Promise<CourseOffering> {
  const response = await apiClient.post<ApiSuccess<CourseOffering>>(
    '/course-offerings',
    payload,
  )

  return response.data.data
}

export async function updateCourseOffering(
  id: number | string,
  payload: Partial<CourseOfferingPayload>,
): Promise<CourseOffering> {
  const response = await apiClient.put<ApiSuccess<CourseOffering>>(
    `/course-offerings/${id}`,
    payload,
  )

  return response.data.data
}

export async function deleteCourseOffering(
  id: number | string,
): Promise<void> {
  await apiClient.delete(`/course-offerings/${id}`)
}

// There is no users/instructors endpoint; collect instructors already
// returned on offerings so the form can offer real choices.
export async function listKnownInstructors() {
  const page = await listCourseOfferings({ per_page: 100 })
  const byId = new Map()

  for (const offering of page.data) {
    if (offering.instructor) {
      byId.set(offering.instructor.id, offering.instructor)
    }
  }

  return [...byId.values()]
}
