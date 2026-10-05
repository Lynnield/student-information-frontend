import { useEffect, useState } from 'react'
import { listCourseOfferings } from '../../services/courseOfferingService'
import { listStudents } from '../../services/studentService'
import type { CourseOffering } from '../../types/courseOffering'
import type { Student } from '../../types/student'

export function useEnrollmentFormOptions() {
  const [students, setStudents] = useState<Student[]>([])
  const [courseOfferings, setCourseOfferings] = useState<CourseOffering[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    Promise.all([
      listStudents({ per_page: 100 }),
      listCourseOfferings({ per_page: 100 }),
    ])
      .then(([studentPage, offeringPage]) => {
        if (!cancelled) {
          setStudents(studentPage.data)
          setCourseOfferings(offeringPage.data)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Could not load form options from the API.')
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { students, courseOfferings, isLoading, error }
}
