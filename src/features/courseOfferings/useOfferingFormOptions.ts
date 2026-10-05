import { useEffect, useState } from 'react'
import { listAcademicTerms } from '../../services/academicTermService'
import { listKnownInstructors } from '../../services/courseOfferingService'
import { listCourses } from '../../services/courseService'
import type { AcademicTerm } from '../../types/academicTerm'
import type { Course } from '../../types/course'
import type { OfferingInstructor } from '../../types/courseOffering'

export function useOfferingFormOptions() {
  const [courses, setCourses] = useState<Course[]>([])
  const [academicTerms, setAcademicTerms] = useState<AcademicTerm[]>([])
  const [instructors, setInstructors] = useState<OfferingInstructor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    Promise.all([
      listCourses({ per_page: 100 }),
      listAcademicTerms({ per_page: 100 }),
      listKnownInstructors(),
    ])
      .then(([coursePage, termPage, instructorList]) => {
        if (!cancelled) {
          setCourses(coursePage.data)
          setAcademicTerms(termPage.data)
          setInstructors(instructorList)
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

  return { courses, academicTerms, instructors, isLoading, error }
}
