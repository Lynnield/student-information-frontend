# AI Development Log

## 1. Purpose

AI assistance was used as a development aid while building the React frontend for the existing Laravel REST API. AI-generated code was not automatically accepted. Each suggested file, type, and endpoint was reviewed against the actual backend, then tested with the running Laravel API before being kept.

## 2. Development Workflow

The laboratory workflow was followed throughout:

```text
UNDERSTAND → INSPECT API → PLAN → PROMPT → GENERATE → REVIEW → INTEGRATE → TEST → DEBUG → IMPROVE → DOCUMENT
```

In practice this meant: understand the module being built, read the real Laravel controllers and routes first, plan the frontend shape, let AI generate a draft, review it line by line, integrate it into the existing structure, test it against the real API, fix discrepancies, polish the UI, and document the result.

## 3. AI-Assisted Areas

AI was useful for drafting code and documentation in these areas, all present in the final project:

- authentication foundation (`AuthContext`, token storage, `/auth/me` session restore)
- API client/service layer (`apiClient`, per-resource services)
- protected routes (`ProtectedRoute`, `GuestRoute`)
- role-aware navigation (`AppLayout`, role helpers)
- Students module
- Programs module
- Courses module
- Academic Terms module
- Course Offerings module
- Enrollments module
- Grades module
- Academic Record
- Profile/Account page
- shared reusable resource components (`ResourceIndexPage`, `ResourceDetailsPage`, forms)
- error handling (`ApiRequestError`, 401/403/404/409/422/500/network paths)
- responsive UI styling with Tailwind CSS
- documentation (README, API integration map, this log)

AI did not independently complete the project. Everything AI produced had to be checked and corrected by hand.

## 4. API Contract Verification

Generated code was compared against the actual Laravel backend before being accepted. Verified details included:

- endpoint paths and HTTP methods
- request fields and validation rules
- response structures and success envelopes
- pagination via Laravel's paginator (`data.current_page`, `data.last_page`, `total`, ...)
- query parameters (`search`, `status`, `program_id`, `student_id`, `course_offering_id`, `remarks`, `sort`, `direction`, `page`, `per_page`)
- authorization behavior per role
- error responses for 401, 403, 404, 409, and 422

Concrete project examples:

- Student lists come back paginated; the UI reads records from `response.data.data`.
- Creating a duplicate enrollment returns 409 "Student is already enrolled in this course offering."
- Grade fields `midterm_grade`, `final_grade`, and `final_rating` validate numeric 0–100 values.
- Deleting a course offering that has enrollments returns 409 instead of deleting.
- Student-role users are restricted to their own records, and instructors are restricted to grades on their assigned offerings.
- The academic record endpoint enforces that a student can only view their own record.

## 5. Corrections and Review

The generated implementation needed review and several real corrections:

- Fixed incorrect relative import paths in `AuthContext.tsx` (`../services/...` → `../../services/...`).
- Enabled `"strict": true` in `tsconfig.app.json` and resolved the resulting type errors.
- Corrected TypeScript relation keys to match the real JSON, using snake_case fields such as `academic_term` and `course_offering` instead of assumed camelCase.
- Removed unused Vite template leftovers (`src/index.css`, `src/App.css`, template assets).
- Adjusted frontend behavior to match actual backend limitations, e.g. no `search` parameter on enrollments/grades, no `year_level` filter on students.
- Removed unnecessary developer readouts (API base URL on Login/Dashboard) from the visible UI.
- Kept Course Offering instructor selection based on real backend data (a datalist of instructors from offering records) because the backend has no general users endpoint.

## 6. Testing and Validation

The completed frontend was manually tested against the real Laravel API, with real backend data rather than mock/static records. Covered areas:

- authentication (login, session restore, logout)
- protected routes
- Students
- Programs
- Courses
- Academic Terms
- Course Offerings
- Enrollments
- Grades
- Academic Record
- Profile/Account
- role/permission behavior
- network/API unavailable behavior
- responsive/mobile layout
- production build

## 7. Network Error Test

A network failure scenario was actually exercised:

- The Laravel API was temporarily stopped.
- The frontend could no longer verify the authenticated session.
- The user was redirected to login.
- Attempting to log in while the API was offline produced the message: "Unable to connect to the server. Please make sure the API is running."
- Laravel was restarted and normal functionality was restored.

## 8. Build Verification

The production build was run with:

```bash
npm.cmd run build
```

Result: TypeScript project check passed, Vite transformed 150 modules, and the production build completed successfully.

## 9. Human Review and Responsibility

The student reviewed the generated code, compared it with the actual backend, manually tested the application, checked errors in the browser and console, and decided what changes to keep. AI assistance does not replace understanding, testing, or responsibility for the final implementation.

## 10. Lessons Learned

- Always check the real API contract before generating frontend code.
- Testing against real backend responses catches mismatches that types alone miss (for example snake_case relation keys).
- Understanding the generated code matters more than copying it.
- Authorization must be verified, not assumed from frontend UI hiding.
- Error states deserve testing too, not just the happy path.
- Documentation should stay synchronized with the actual implementation.
