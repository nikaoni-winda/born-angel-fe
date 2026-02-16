# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev       # Start dev server (http://localhost:5173)
npm run build     # Production build
npm run lint      # Run ESLint
npm run preview   # Preview production build locally
```

No test framework is configured yet.

## Environment

Requires `.env` with `VITE_API_BASE_URL` (defaults to `http://127.0.0.1:8000/api`). The backend is a separate Born Angel API (Laravel).

## Architecture Overview

React 19 + Vite 7 + Tailwind CSS 4 single-page application for a premium makeup class booking platform with Role-Based Access Control (RBAC).

### State Management

Single React Context (`src/contexts/AuthContext.jsx`) manages all auth state. No Redux or external state library. Component-level state uses `useState`. Auth persists to localStorage (`auth_token`, `user_data`).

### RBAC Role Hierarchy

Four roles with strict hierarchy: **super_admin** > **admin** > **instructor** > **user**. Role constants live in `src/utils/constants.js` (`ROLES` object). Routes are protected by two layers: `ProtectedRoute` (auth check) then `RoleRoute` (role check), both in `src/routes/`.

### API Layer

All API calls go through `src/services/api.js` — an Axios instance with interceptors that auto-inject Bearer tokens and handle 401 (auto-logout) / 403 errors. Each domain has its own service file in `src/services/` (authService, bookingService, reviewService, etc.).

### Routing

`src/routes/AppRoutes.jsx` defines 40+ routes organized by access level:
- **Public**: `/`, `/services`, `/instructors`, `/about`, `/login`, `/register`
- **User**: `/user/dashboard`, `/user/bookings/*`, `/user/reviews/*`
- **Instructor**: `/instructor/dashboard`, `/instructor/schedules`
- **Admin**: `/admin/dashboard`, `/admin/users/*`, `/admin/services/*`, `/admin/schedules/*`, `/admin/bookings`
- **Super Admin**: `/super-admin/dashboard`, `/admin/admins/*`

A `DashboardRedirect` component at `/dashboard` routes users to their role-specific dashboard.

### Page Organization

Pages in `src/pages/` are organized by role: `public/`, `auth/`, `user/`, `instructor/`, `admin/`. Each admin sub-domain (users, services, instructors, schedules, bookings) has its own subfolder with list/create/edit pages.

### Layout System

Three layout wrappers in `src/components/layout/`: `AdminLayout` (with `AdminSidebar`), `UserLayout` (with `UserSidebar`), and `InstructorLayout`. Each wraps role-specific pages with navigation chrome.

### Bilingual Content

The app supports Indonesian and English. API models return `*_id` and `*_en` fields. Use `getBilingualField(data, fieldName, lang)` from `src/utils/helpers.js` to access the correct language version.

## Styling

Tailwind CSS v4 with `@theme` directive in `src/index.css`. Custom color palette defined in `tailwind.config.js`:
- `frozen` / `icy-veil` / `glacier-glow` / `frost-byte` — pink spectrum
- `midnight-chill` / `polar-night` — dark burgundy/red

Custom fonts: **Playfair Display** (headings), **Cormorant Garamond** (body), **Lobster** (decorative). Loaded via Google Fonts in `index.html`.

## Key Utilities

- `src/utils/constants.js` — Role enums, status enums, route paths, storage keys
- `src/utils/helpers.js` — `formatCurrency` (IDR), `formatDate` (Indonesian locale), `formatDuration`, validation helpers, `debounce`, status color mapping
- `src/utils/modelFields.js` — Field name constants for each API model

## Payment Integration

Midtrans Snap is loaded via script tag in `index.html`. Payment flow uses `src/services/paymentService.js` to get snap tokens.
