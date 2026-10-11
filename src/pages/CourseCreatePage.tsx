import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CourseForm } from '../features/courses/CourseForm'
import { createCourse } from '../services/courseService'
import type { CoursePayload } from '../types/course'
import { useToast } from '../components/Toast'

export function CourseCreatePage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(payload: CoursePayload) {
    setIsSubmitting(true)

    try {
      const created = await createCourse(payload)
      toast.success('Course created.')
      navigate(`/courses/${created.id}`, { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">New course</h1>
        <Link
          to="/courses"
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Cancel
        </Link>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <CourseForm
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          submitLabel="Create course"
        />
      </div>
    </div>
  )
}
