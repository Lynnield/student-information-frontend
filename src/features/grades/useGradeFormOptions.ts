import { useEffect, useState } from 'react'
import { listEnrollments } from '../../services/enrollmentService'
import type { Enrollment } from '../../types/enrollment'

export function useGradeFormOptions() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    listEnrollments({ per_page: 100 })
      .then((page) => {
        if (!cancelled) {
          setEnrollments(page.data)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Could not load enrollments from the API.')
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

  return { enrollments, isLoading, error }
}
