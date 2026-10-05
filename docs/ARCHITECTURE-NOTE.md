# Architecture Note

## 1. System Overview

This project is a separate React frontend that consumes the existing Laravel REST API. The frontend handles display, navigation, forms, and client-side state. The Laravel backend owns the database, validation, and authorization. The two applications run independently and communicate only over HTTP using JSON and a Sanctum Bearer token.

## 2. Architecture

```text
User
↓
React Frontend
├── Routes
├── Pages
├── Reusable Components
├── Feature Forms
├── State/Auth Context
└── API Service Layer
↓
Laravel REST API
↓
Database
```

Responsibilities:

- **Routes** (`src/router`) — map URLs to pages and guard guests/authenticated users.
- **Pages** (`src/pages`) — one route-level screen per module.
- **Reusable Components** (`src/components`, `src/features/shared`) — shared list/details pages, alerts, spinners, route guards.
- **Feature Forms** (`src/features/*`) — create/edit forms per module with field-error mapping.
- **State/Auth Context** (`src/features/auth`, `src/hooks`) — holds the logged-in user and session state.
- **API Service Layer** (`src/services`) — one Axios client plus per-resource service modules.
- **Laravel REST API** — validation, business rules, and persistence.
- **Database** — accessed only by Laravel.

## 3. Frontend Structure

- `src/components` — shared UI (`Alert`, `Spinner`, `ProtectedRoute`, `GuestRoute`)
- `src/features` — feature forms/hooks per module, plus shared resource pages
- `src/layouts` — `AppLayout` with role-aware sidebar and header
- `src/pages` — route-level pages for each module
- `src/router` — route configuration
- `src/services` — `apiClient` and per-resource API functions
- `src/types` — TypeScript types matching the API contract
- `src/utils` — `tokenStorage`, `roles`, `apiError` helpers

## 4. API Integration

All communication goes through the shared Axios client in `src/services/apiClient.ts`:

- base URL comes from `VITE_API_BASE_URL`
- the stored Bearer token is attached to every request
- responses/errors are normalized in one place
- service modules (`studentService`, `programService`, ...) expose small reusable functions instead of pages calling Axios directly

## 5. Authentication Flow

```text
Login
→ token storage (localStorage)
→ authenticated user retrieval (GET /auth/me)
→ protected routes render
→ logout (POST /auth/logout) → token cleared
```

If any API call returns 401 (and it is not the login request), the client clears the token and sends the user back to `/login`.

## 6. Role-Based Access

The backend defines four roles: **Administrator**, **Registrar/Staff**, **Instructor**, and **Student**. Frontend role helpers only control the user experience — which navigation items and buttons are visible. Laravel remains the actual security boundary and returns 403 for disallowed requests.

## 7. Data Flow

```text
User action
→ Page/component
→ Service
→ Axios
→ REST API
→ JSON response
→ frontend state
→ UI
```

Mutations re-fetch or update from the real API response; there is no mock or static data layer.

## 8. Maintainability

Reusable components and service modules reduce duplication. For example, `ResourceIndexPage` provides the standard search/filter/sort/pagination/delete-confirmation list UI used by Programs, Courses, Academic Terms, Course Offerings, Enrollments, and Grades, and `ResourceDetailsPage` provides the shared details layout. Adding a new module means writing its types, a service, and small page wrappers rather than rebuilding the whole screen.

## 9. Security Boundary

- The frontend does not connect directly to the database.
- The frontend does not replace backend authorization.
- The backend validates requests and permissions.
- Tokens are handled by the authentication layer (`AuthContext`, `tokenStorage`, `apiClient`).

## 10. Design Decisions

- **API calls live in services**, not in components, so requests stay consistent and testable.
- **Shared resource pages/components** keep the CRUD screens uniform and easier to maintain.
- **Environment variables** hold the API base URL so the same build can point at different backends.
- **Frontend and backend remain separate applications**, matching the laboratory requirement that this project does not replace or duplicate the Laravel API.
