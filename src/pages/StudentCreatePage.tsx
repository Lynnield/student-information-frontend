import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert } from '../components/Alert'
import { Spinner } from '../components/Spinner'
import { StudentForm } from '../features/students/StudentForm'
import { listAllPrograms } from '../services/programService'
import { createStudent } from '../services/studentService'
import type { ProgramRef, StudentPayload } from '../types/student'
import { useToast } from '../components/Toast'

export function StudentCreatePage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [programs, setPrograms] = useState<ProgramRef[]>([])
  const [isLoadingPrograms, setIsLoadingPrograms] = useState(true)
  const [programsError, setProgramsError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    listAllPrograms()
      .then(setPrograms)
      .catch(() =>
        setProgramsError('Could not load the list of programs.'),
      )
      .finally(() => setIsLoadingPrograms(false))
  }, [])

  async function handleSubmit(payload: StudentPayload) {
    setIsSubmitting(true)

    try {
      const created = await createStudent(payload)
      toast.success('Student created.')
      navigate(`/students/${created.id}`, { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingPrograms) {
    return (
      <div className="flex justify-center p-8">
        <Spinner label="Loading form..." />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">New student</h1>
        <Link
          to="/students"
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Cancel
        </Link>
      </div>

      {programsError ? (
        <Alert>{programsError}</Alert>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <StudentForm
            programs={programs}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            submitLabel="Create student"
          />
        </div>
      )}
    </div>
  )
}
