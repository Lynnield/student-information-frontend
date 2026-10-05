# Student Information Frontend

React client for the existing Student Information Management REST API.

This frontend does not replace the Laravel backend. It authenticates with Sanctum and calls `http://127.0.0.1:8000/api/v1`.

## Technology stack

- React
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS

## Prerequisites

- Node.js 20+
- The Laravel API running at `http://127.0.0.1:8000`

## Installation

```bash
cd student-information-frontend
npm install
copy .env.example .env
```

Set:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

## Start the Laravel API

From `student-information-api`:

```bash
php artisan serve
```

## Start the frontend

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Authentication

The app posts to `/auth/login`, stores the Sanctum Bearer token in `localStorage`, then loads the current user from `/auth/me`. Protected routes redirect unauthenticated users to `/login`. Logout calls `/auth/logout` and clears the token.

Navigation is role-aware. Client-side hiding is only a UI convenience. The Laravel API remains the security boundary.
