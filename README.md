# Student Information Frontend

React client for the existing Student Information Management REST API.

This frontend does not replace the Laravel backend. It authenticates with Sanctum and calls `http://127.0.0.1:8000/api/v1`.

## 1. Project Overview

The Student Information Frontend is a single-page application that lets administrator, registrar, instructor, and student accounts work with the school's academic data. It covers authentication, account profile, and the main academic modules: Students, Programs, Courses, Academic Terms, Course Offerings, Enrollments, Grades, and Academic Record. Every screen reads and writes data through the existing Laravel REST API.

## 2. Frontend and Backend Architecture

Request flow:

- **Browser** — renders the React app and stores the Sanctum Bearer token in `localStorage`.
- **React frontend** (`student-information-frontend`) — pages, components, routing, and role-aware UI.
- **API service layer** (`src/services`) — centralized Axios client that attaches the token and normalizes errors.
- **Existing Laravel REST API** (`student-information-api`) — the only system that talks to the database and enforces permissions.
- **Database** — owned entirely by the Laravel backend.

The frontend does **not** connect directly to the database.

## 3. Technology Stack

- React 19
- TypeScript (strict mode)
- Vite
- React Router
- Axios
- Tailwind CSS 4
- oxlint

## 4. Prerequisites

- Node.js 20+
- The Laravel API running at `http://127.0.0.1:8000`

## 5. Environment Configuration

Copy `.env.example` to `.env` and set:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

`.env` is environment-specific and should not be committed; only `.env.example` belongs in version control.

## 6. Installation

```bash
cd student-information-frontend
npm install
copy .env.example .env
```

## 7. Running the Backend

From `student-information-api`:

```bash
php artisan serve
```

## 8. Running the Frontend

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## 9. Authentication and Protected Routes

- Login posts credentials to `/auth/login`; on success the Bearer token is stored in `localStorage`.
- On application load, the stored token is validated by calling `GET /auth/me`.
- Protected routes (`/`, `/students`, `/programs`, `/courses`, `/academic-terms`, `/course-offerings`, `/enrollments`, `/grades`, `/academic-record`, `/profile`) redirect unauthenticated users to `/login`.
- Logout calls `/auth/logout`, clears the token, and returns to the login page.
- Any API response with HTTP 401 clears the token and sends the user back to `/login`.

## 10. Role-Aware Access

- **Administrator** — full access to all modules.
- **Registrar/Staff** — full management of students, programs, courses, terms, offerings, enrollments, and grades.
- **Instructor** — views course offerings and manages grades only for their assigned sections.
- **Student** — views only their own profile data, enrollments, grades, and academic record.

Frontend role checks only hide or show controls for usability. The Laravel API remains the real security boundary and returns 403 for disallowed actions.

## 11. API Integration

The frontend consumes these existing backend resources:

- **Authentication** — `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`
- **Students** — `GET/POST /students`, `GET/PUT/DELETE /students/{id}`
- **Programs** — `GET/POST /programs`, `GET/PUT/DELETE /programs/{id}`
- **Courses** — `GET/POST /courses`, `GET/PUT/DELETE /courses/{id}`
- **Academic Terms** — `GET/POST /academic-terms`, `GET/PUT/DELETE /academic-terms/{id}`
- **Course Offerings** — `GET/POST /course-offerings`, `GET/PUT/DELETE /course-offerings/{id}`
- **Enrollments** — `GET/POST /enrollments`, `GET/PUT/DELETE /enrollments/{id}`
- **Grades** — `GET/POST /grades`, `GET/PUT/DELETE /grades/{id}`
- **Academic Record** — `GET /students/{id}/academic-record`
- **Profile/Account** — read-only view of the authenticated user via `GET /auth/me` and logout via `POST /auth/logout`

List endpoints are consumed with their real query parameters: `search`, `status`, `program_id`, `student_id`, `course_id`, `academic_term_id`, `course_offering_id`, `remarks`, `sort`, `direction`, `page`, and `per_page`, depending on the resource.

## 12. Frontend Features

- Full CRUD screens for Students, Programs, Courses, Academic Terms, Course Offerings, Enrollments, and Grades
- Server-side search, status and relational filters, sorting, and pagination (driven by Laravel's paginator metadata)
- Create/edit forms with Laravel validation rules and a delete confirmation step
- Field-level validation errors mapped back to the matching form inputs
- Loading, empty, and API/network error states with a retry action
- Responsive tables and forms built with Tailwind CSS

## 13. Error Handling

All responses pass through a centralized Axios client and are normalized into an `ApiRequestError`:

- **401** — token cleared, user redirected to `/login`
- **403** — "Access denied (403)" state with the server's message (e.g. wrong role or viewing another student's record)
- **404** — "Not found (404)" state with back options; unknown URLs show a dedicated 404 page
- **409** — business conflicts shown directly (duplicate student email/number, duplicate enrollment, enrollment with a grade, program/course/term with related records)
- **422** — validation messages mapped to form fields where possible; also used for invalid login credentials
- **500 / network failure** — friendly "cannot reach the server" message with retry; if the API is down when the app loads, a "Server unreachable" screen with Retry is shown instead of logging the user out
- **Success** — create, update, and delete actions show a non-blocking toast notification

## 14. Testing

The completed frontend was manually tested against the real Laravel backend for:

- Authentication (login, session restore, logout)
- Protected routes and guest redirects
- Students, Programs, Courses, Academic Terms, Course Offerings, Enrollments, Grades, Academic Record, and Profile
- Role/permission behavior for administrator, registrar, instructor, and student accounts
- Network/API-unavailable behavior (error state and retry)
- Responsive/mobile layout
- Production build

No mock data was used at any point.

## 15. Build

```bash
npm.cmd run build
```

This runs TypeScript project checks (`tsc -b`) and a Vite production build. Both passed for the completed project.

## 16. Project Structure

- `src/components` — shared UI components and route guards (`ProtectedRoute`, `GuestRoute`, `Alert`, `Spinner`)
- `src/features` — feature-specific forms, hooks, and shared list/details page components
- `src/layouts` — `AppLayout` with role-aware navigation
- `src/pages` — route-level pages for each module
- `src/router` — React Router configuration
- `src/services` — Axios client and per-resource API services
- `src/types` — TypeScript types matching the backend API contract
- `src/utils` — token storage, role helpers, and API error normalization

## 17. Responsible AI-Assisted Development

AI assistance was used during development. Generated code was reviewed against the actual Laravel API contract (controllers, routes, validation rules, and response shapes), tested with the real backend, corrected where necessary, and manually verified before being kept.

## 18. Known Backend Limitations

- No endpoint exists to list users/instructors; the course-offering form suggests instructors already present in offering data.
- `GET /students` has no `year_level` filter even though the column exists.
- `GET /grades` and `GET /enrollments` expose relational filters but no free-text `search` parameter.
- The seeded database does not create a `student`-role login account; student-role UI testing requires a matching `users.email` equal to a `students.email`.
- No profile-update, password-change, avatar, or session-management endpoints exist, so the Profile page is read-only.

## 19. Git and Repository

This frontend is maintained in its own Git repository. Day-to-day work and releases are done on the `main` branch.
