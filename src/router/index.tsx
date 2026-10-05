import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { GuestRoute } from '../components/GuestRoute'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { AuthProvider } from '../features/auth/AuthContext'
import { AppLayout } from '../layouts/AppLayout'
import { AcademicRecordPage } from '../pages/AcademicRecordPage'
import { AcademicTermCreatePage } from '../pages/AcademicTermCreatePage'
import { AcademicTermDetailsPage } from '../pages/AcademicTermDetailsPage'
import { AcademicTermEditPage } from '../pages/AcademicTermEditPage'
import { AcademicTermsPage } from '../pages/AcademicTermsPage'
import { CourseCreatePage } from '../pages/CourseCreatePage'
import { CourseDetailsPage } from '../pages/CourseDetailsPage'
import { CourseEditPage } from '../pages/CourseEditPage'
import { CourseOfferingCreatePage } from '../pages/CourseOfferingCreatePage'
import { CourseOfferingDetailsPage } from '../pages/CourseOfferingDetailsPage'
import { CourseOfferingEditPage } from '../pages/CourseOfferingEditPage'
import { CourseOfferingsPage } from '../pages/CourseOfferingsPage'
import { CoursesPage } from '../pages/CoursesPage'
import { EnrollmentCreatePage } from '../pages/EnrollmentCreatePage'
import { EnrollmentDetailsPage } from '../pages/EnrollmentDetailsPage'
import { EnrollmentEditPage } from '../pages/EnrollmentEditPage'
import { EnrollmentsPage } from '../pages/EnrollmentsPage'
import { GradeCreatePage } from '../pages/GradeCreatePage'
import { GradeDetailsPage } from '../pages/GradeDetailsPage'
import { GradeEditPage } from '../pages/GradeEditPage'
import { GradesPage } from '../pages/GradesPage'
import { DashboardPage } from '../pages/DashboardPage'
import { LoginPage } from '../pages/LoginPage'
import { ProfilePage } from '../pages/ProfilePage'
import { ProgramCreatePage } from '../pages/ProgramCreatePage'
import { ProgramDetailsPage } from '../pages/ProgramDetailsPage'
import { ProgramEditPage } from '../pages/ProgramEditPage'
import { ProgramsPage } from '../pages/ProgramsPage'
import { StudentCreatePage } from '../pages/StudentCreatePage'
import { StudentDetailsPage } from '../pages/StudentDetailsPage'
import { StudentEditPage } from '../pages/StudentEditPage'
import { StudentsPage } from '../pages/StudentsPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/students/new" element={<StudentCreatePage />} />
              <Route path="/students/:id" element={<StudentDetailsPage />} />
              <Route
                path="/students/:id/edit"
                element={<StudentEditPage />}
              />
              <Route path="/programs" element={<ProgramsPage />} />
              <Route path="/programs/new" element={<ProgramCreatePage />} />
              <Route path="/programs/:id" element={<ProgramDetailsPage />} />
              <Route path="/programs/:id/edit" element={<ProgramEditPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/new" element={<CourseCreatePage />} />
              <Route path="/courses/:id" element={<CourseDetailsPage />} />
              <Route path="/courses/:id/edit" element={<CourseEditPage />} />
              <Route path="/academic-terms" element={<AcademicTermsPage />} />
              <Route
                path="/academic-terms/new"
                element={<AcademicTermCreatePage />}
              />
              <Route
                path="/academic-terms/:id"
                element={<AcademicTermDetailsPage />}
              />
              <Route
                path="/academic-terms/:id/edit"
                element={<AcademicTermEditPage />}
              />
              <Route
                path="/course-offerings"
                element={<CourseOfferingsPage />}
              />
              <Route
                path="/course-offerings/new"
                element={<CourseOfferingCreatePage />}
              />
              <Route
                path="/course-offerings/:id"
                element={<CourseOfferingDetailsPage />}
              />
              <Route
                path="/course-offerings/:id/edit"
                element={<CourseOfferingEditPage />}
              />
              <Route path="/enrollments" element={<EnrollmentsPage />} />
              <Route path="/enrollments/new" element={<EnrollmentCreatePage />} />
              <Route
                path="/enrollments/:id"
                element={<EnrollmentDetailsPage />}
              />
              <Route
                path="/enrollments/:id/edit"
                element={<EnrollmentEditPage />}
              />
              <Route path="/grades" element={<GradesPage />} />
              <Route path="/grades/new" element={<GradeCreatePage />} />
              <Route path="/grades/:id" element={<GradeDetailsPage />} />
              <Route path="/grades/:id/edit" element={<GradeEditPage />} />
              <Route
                path="/academic-record"
                element={<AcademicRecordPage />}
              />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
