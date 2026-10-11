# API Integration Map

## 1. API Base URL

The frontend reads its API base URL from the `VITE_API_BASE_URL` environment variable (in `.env`, falling back to `.env.example`). The current development value is:

```
http://127.0.0.1:8000/api/v1
```

No credentials, tokens, or secrets are stored in this file.

## 2. Architecture Flow

```text
Browser
  ↓
React Frontend
  ↓
API Service Layer / Axios
  ↓
Laravel REST API
  ↓
Database
```

The frontend does not connect directly to the database.

## 3. Authentication API

| Endpoint | Method | Frontend caller | Purpose | Auth required |
| --- | --- | --- | --- | --- |
| `/auth/login` | POST | `src/services/authService.ts` → `login()` | Validate credentials, receive Sanctum token + user | No |
| `/auth/me` | GET | `src/services/authService.ts` → `getCurrentUser()` | Load the current authenticated user | Yes (Bearer token) |
| `/auth/logout` | POST | `src/services/authService.ts` → `logout()` | Revoke the current token | Yes (Bearer token) |

`src/services/apiClient.ts` attaches the stored Bearer token to every request and clears it on 401 responses from non-login endpoints.

## 4. Student API

Service: `src/services/studentService.ts`

| Endpoint | Method | Service function |
| --- | --- | --- |
| `/students` | GET | `listStudents(params)` |
| `/students/{id}` | GET | `getStudent(id)` |
| `/students` | POST | `createStudent(payload)` |
| `/students/{id}` | PUT | `updateStudent(id, payload)` |
| `/students/{id}` | DELETE | `deleteStudent(id)` |

Query parameters actually sent on list:

- `search` — student number, first name, last name, or email (LIKE)
- `program_id` — exact program filter
- `status` — `active`, `inactive`, `graduated`, `dropped`
- `sort` — e.g. `last_name`, `first_name`, `student_number`, `email`, `year_level`, `status`, `created_at`
- `direction` — `asc` or `desc`
- `page`, `per_page` — pagination

Note: the backend does not support a `year_level` filter on the list endpoint, so the UI does not offer one.

## 5. Program API

Service: `src/services/programService.ts`

| Endpoint | Method | Service function |
| --- | --- | --- |
| `/programs` | GET | `listPrograms(params)` / `listAllPrograms()` |
| `/programs/{id}` | GET | `getProgram(id)` |
| `/programs` | POST | `createProgram(payload)` |
| `/programs/{id}` | PUT | `updateProgram(id, payload)` |
| `/programs/{id}` | DELETE | `deleteProgram(id)` |

List parameters: `search` (code/name/description), `status`, `sort` (`code`, `name`, `status`, `created_at`), `direction`, `page`, `per_page`.

## 6. Course API

Service: `src/services/courseService.ts`

| Endpoint | Method | Service function |
| --- | --- | --- |
| `/courses` | GET | `listCourses(params)` |
| `/courses/{id}` | GET | `getCourse(id)` |
| `/courses` | POST | `createCourse(payload)` |
| `/courses/{id}` | PUT | `updateCourse(id, payload)` |
| `/courses/{id}` | DELETE | `deleteCourse(id)` |

List parameters: `search` (course code/title/description), `status`, `sort` (`course_code`, `course_title`, `units`, `status`, `created_at`), `direction`, `page`, `per_page`.

## 7. Academic Term API

Service: `src/services/academicTermService.ts`

| Endpoint | Method | Service function |
| --- | --- | --- |
| `/academic-terms` | GET | `listAcademicTerms(params)` |
| `/academic-terms/{id}` | GET | `getAcademicTerm(id)` |
| `/academic-terms` | POST | `createAcademicTerm(payload)` |
| `/academic-terms/{id}` | PUT | `updateAcademicTerm(id, payload)` |
| `/academic-terms/{id}` | DELETE | `deleteAcademicTerm(id)` |

List parameters: `search` (academic year/semester), `status`, `sort` (`academic_year`, `semester`, `term_start_date`, `term_end_date`, `status`, `created_at`), `direction`, `page`, `per_page`. The UI defaults to `sort=term_start_date&direction=desc`.

## 8. Course Offering API

Service: `src/services/courseOfferingService.ts`

| Endpoint | Method | Service function |
| --- | --- | --- |
| `/course-offerings` | GET | `listCourseOfferings(params)` |
| `/course-offerings/{id}` | GET | `getCourseOffering(id)` |
| `/course-offerings` | POST | `createCourseOffering(payload)` |
| `/course-offerings/{id}` | PUT | `updateCourseOffering(id, payload)` |
| `/course-offerings/{id}` | DELETE | `deleteCourseOffering(id)` |

List parameters actually used:

- `course_id` — filter by course
- `academic_term_id` — filter by academic term
- `instructor_id` — filter by instructor (ignored by the backend for instructor-role users)
- `section` — LIKE filter
- `status` — `open`, `closed`, `cancelled`, `completed`
- `search` — section, schedule, room, and related course code/title
- `sort` — `section`, `capacity`, `status`, `created_at` (default `created_at desc`)
- `direction`, `page`, `per_page`

Instructor options in the create/edit form: the backend has **no** `/users` endpoint, so `listKnownInstructors()` collects instructors from real `/course-offerings` responses and suggests them in a dropdown while still allowing a manual instructor ID.

## 9. Enrollment API

Service: `src/services/enrollmentService.ts`

| Endpoint | Method | Service function |
| --- | --- | --- |
| `/enrollments` | GET | `listEnrollments(params)` |
| `/enrollments/{id}` | GET | `getEnrollment(id)` |
| `/enrollments` | POST | `createEnrollment(payload)` |
| `/enrollments/{id}` | PUT | `updateEnrollment(id, payload)` |
| `/enrollments/{id}` | DELETE | `deleteEnrollment(id)` |

List parameters actually used: `student_id`, `course_offering_id`, `status` (`enrolled`, `dropped`, `completed`, `withdrawn`), `sort` (`enrollment_date`, `status`, `created_at`), `direction`, `page`, `per_page`. There is no free-text `search` parameter, so the UI hides the search box on this page.

## 10. Grade API

Service: `src/services/gradeService.ts`

| Endpoint | Method | Service function |
| --- | --- | --- |
| `/grades` | GET | `listGrades(params)` |
| `/grades/{id}` | GET | `getGrade(id)` |
| `/grades` | POST | `createGrade(payload)` |
| `/grades/{id}` | PUT | `updateGrade(id, payload)` |
| `/grades/{id}` | DELETE | `deleteGrade(id)` |

List parameters actually used: `student_id`, `course_offering_id`, `remarks` (LIKE), `sort` (`midterm_grade`, `final_grade`, `final_rating`, `created_at`), `direction`, `page`, `per_page`. There is no free-text `search` parameter.

## 11. Academic Record API

Service: `src/services/academicRecordService.ts`

| Endpoint | Method | Service function |
| --- | --- | --- |
| `/students/{student}/academic-record` | GET | `getAcademicRecord(studentId)` |

How the student is determined:

- **Student role** — the frontend calls `GET /students?search={own email}` and picks the row whose `email` matches the logged-in user, then requests that student's academic record.
- **Administrator / Registrar / Instructor** — the user picks a student from the `GET /students` list.

The backend response contains `student` (summary with `full_name` and `program`), `terms` (each with its courses, grades, unit totals, and `term_weighted_average`), and `summary` (totals and `general_weighted_average`). The UI renders one table per term plus summary cards. Types live in `src/types/academicRecord.ts`.

## 12. Profile / Account

The Profile page displays the authenticated user from `GET /auth/me` (via `AuthContext`): `id`, `name`, `email`, `role`, `status`. It also links student-role users to Academic Record and offers logout via `POST /auth/logout`.

There are **no** backend endpoints for editing the profile, changing a password, uploading an avatar, deleting an account, or managing sessions. The UI is read-only and says so explicitly; nothing is faked.

## 13. Error Handling

`src/utils/apiError.ts` converts every Axios failure into an `ApiRequestError` with `status`, `fieldErrors`, and `isNetworkError`. The UI maps responses as follows:

- **401** — token cleared, redirect to `/login`
- **403** — permission message shown inline
- **404** — "not found" message with retry/back options
- **409** — business conflict message shown (duplicates, grade-linked enrollment delete, etc.)
- **422** — field errors mapped onto the matching form inputs; also used for invalid login credentials
- **500 / network unavailable** — friendly "cannot reach the server" message with a retry action

## 14. Role and Authorization

Frontend helpers in `src/utils/roles.ts`:

- **Administrator** — create/update/delete on all modules; full navigation
- **Registrar/Staff** — create/update/delete on students, programs, courses, terms, offerings, enrollments; create/update/delete grades
- **Instructor** — list/create/update grades and view offerings for their assigned sections; delete is hidden
- **Student** — read-only views of their own record; no management actions

Frontend hiding/disabling is for user experience only. The Laravel API remains the real security boundary and returns 401/403 where a request is not allowed.

## 15. API Service Layer

- `src/services/apiClient.ts` — shared Axios instance: base URL from env, JSON headers, Bearer-token request interceptor, 401 response interceptor
- `src/services/authService.ts` — login, logout, getCurrentUser
- `src/services/studentService.ts` — student CRUD + paginated list
- `src/services/programService.ts` — program CRUD + list helpers
- `src/services/courseService.ts` — course CRUD + paginated list
- `src/services/academicTermService.ts` — academic term CRUD + paginated list
- `src/services/courseOfferingService.ts` — offering CRUD + known-instructor helper
- `src/services/enrollmentService.ts` — enrollment CRUD + paginated list
- `src/services/gradeService.ts` — grade CRUD + paginated list
- `src/services/academicRecordService.ts` — read-only academic record fetch

## 16. Data Flow

Normal flow:

```text
User action
→ React page/component
→ service function
→ Axios API client
→ Laravel endpoint
→ JSON response
→ frontend state
→ UI update
```

Mutations (create/update/delete) re-fetch or update from the real API response. No mock or static records are used anywhere; when the API is unreachable, the UI shows the error state instead of placeholder data.
