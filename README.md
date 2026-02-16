# Born Angel

Premium makeup class booking platform built with React 19, Vite 7, and Tailwind CSS 4. Features Role-Based Access Control (RBAC), Midtrans payment integration, and bilingual content support (Indonesian/English).

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 4 |
| Routing | React Router 7 |
| HTTP Client | Axios |
| Charts | Recharts |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Payment | Midtrans Snap |
| Backend | Laravel (separate repo) |

## Getting Started

### Prerequisites

- Node.js 18+
- Born Angel Laravel API running locally

### Installation

```bash
git clone <repository-url>
cd born-angel-react
npm install
cp .env.example .env
```

Edit `.env`:

```
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

### Development

```bash
npm run dev       # Start dev server (http://localhost:5173)
npm run build     # Production build
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

### Testing Accounts

After seeding the API database:

| Role | Email | Password |
|---|---|---|
| Super Admin | `superadmin@example.com` | `password` |
| Admin | `admin@example.com` | `password` |
| Instructor | `instructor@example.com` | `password` |
| User | `user@example.com` | `password` |

## Role-Based Access Control

Four roles with strict hierarchy: **Super Admin > Admin > Instructor > User**

| Role | Access |
|---|---|
| **Super Admin** | Full platform access, manage admins. Master account (ID 1) is immutable. |
| **Admin** | Manage users, services, instructors, schedules, bookings |
| **Instructor** | View own schedules and class reviews |
| **User** | Browse services, create bookings, write reviews, delete own account |

Routes are protected by two layers: `ProtectedRoute` (auth check) then `RoleRoute` (role validation).

```jsx
<Route
  path="/admin/users"
  element={
    <ProtectedRoute>
      <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
        <UsersListPage />
      </RoleRoute>
    </ProtectedRoute>
  }
/>
```

## Project Structure

```
src/
├── assets/              # Static assets
├── components/
│   ├── admin/           # AdminFilterDropdown
│   ├── common/          # ConfirmModal, Hero, ReviewSection, Pagination, etc.
│   └── layout/          # Navbar, Footer, AdminLayout, UserLayout, InstructorLayout
├── contexts/
│   └── AuthContext.jsx  # Single auth context (no Redux)
├── pages/
│   ├── public/          # HomePage, ServicesPage, InstructorsPage, AboutPage
│   ├── auth/            # LoginPage, RegisterPage
│   ├── user/            # Dashboard, MyBookings, CreateBooking, Reviews, BrowseClasses
│   ├── instructor/      # Dashboard, MySchedules
│   └── admin/           # CRUD pages for users, services, instructors, schedules, bookings
├── routes/
│   ├── AppRoutes.jsx    # 40+ route definitions
│   ├── ProtectedRoute.jsx
│   └── RoleRoute.jsx
├── services/            # API service modules
│   ├── api.js           # Axios instance with interceptors
│   ├── authService.js
│   ├── bookingService.js
│   ├── reviewService.js
│   ├── serviceService.js
│   ├── instructorService.js
│   ├── scheduleService.js
│   ├── paymentService.js
│   ├── userService.js
│   ├── adminService.js
│   └── reportService.js
├── utils/
│   ├── constants.js     # Roles, statuses, route paths, storage keys
│   ├── helpers.js       # formatCurrency, formatDate, validators, debounce
│   ├── modelFields.js   # API model field constants
│   └── loadingUtils.js  # Loading delay utilities
├── App.jsx
├── main.jsx
└── index.css            # Tailwind @theme + custom styles
```

## Routes

### Public

| Path | Page |
|---|---|
| `/` | Homepage |
| `/services` | Browse classes |
| `/services/:id` | Class detail |
| `/instructors` | Instructor listing |
| `/about` | About page |
| `/login` | Login |
| `/register` | Register |

### User

| Path | Page |
|---|---|
| `/user/dashboard` | Overview & upcoming sessions |
| `/user/bookings` | Booking management |
| `/user/bookings/create` | Create booking |
| `/user/classes` | Browse available classes |
| `/user/reviews` | Manage reviews |
| `/user/reviews/create` | Write review |
| `/user/reviews/edit/:id` | Edit review |

### Instructor

| Path | Page |
|---|---|
| `/instructor/dashboard` | Dashboard with stats & schedules |

### Admin

| Path | Page |
|---|---|
| `/admin/dashboard` | Admin dashboard |
| `/admin/users` | User management |
| `/admin/users/:id/history` | User booking & review history |
| `/admin/services` | Service CRUD |
| `/admin/instructors` | Instructor CRUD |
| `/admin/schedules` | Schedule CRUD |
| `/admin/bookings` | Booking overview |

### Super Admin

| Path | Page |
|---|---|
| `/super-admin/dashboard` | Super admin dashboard |
| `/admin/admins` | Admin account management |

## API Integration

All API calls go through `src/services/api.js` — an Axios instance with interceptors that auto-inject Bearer tokens and handle 401 (auto-logout) / 403 errors.

| Service | Key Endpoints |
|---|---|
| `authService` | Login, register, logout, profile, delete account |
| `bookingService` | CRUD bookings, cancel |
| `reviewService` | CRUD reviews, public testimonials (`/api/testimonials`) |
| `serviceService` | CRUD services |
| `instructorService` | CRUD instructor profiles |
| `scheduleService` | CRUD schedules |
| `paymentService` | Midtrans Snap token generation |
| `userService` | User management (admin) |
| `adminService` | Dashboard stats |
| `reportService` | Analytics & reports |

## State Management

Single React Context (`AuthContext`) manages all auth state. No Redux or external state libraries.

```javascript
import { useAuth } from './contexts/AuthContext';

const { user, login, logout, deleteAccount, isAuthenticated, hasRole, isAdmin } = useAuth();
```

Auth persists to `localStorage` via `auth_token` and `user_data` keys. Auto-logout triggers on 401 responses via a global `auth:force-logout` event.

## Features

- **Authentication** — JWT-based with auto token injection and expiration handling
- **RBAC** — Four-tier role system with two-layer route protection
- **Booking System** — Service browsing, schedule selection, booking management with status tracking
- **Payment** — Midtrans Snap integration (sandbox mode)
- **Reviews** — Users rate completed classes; public testimonials displayed on homepage
- **Admin Panel** — Full CRUD for services, instructors, schedules, users, bookings
- **User Account Deletion** — Users can delete their own account via sidebar dropdown
- **Bilingual Content** — Indonesian/English with `getBilingualField()` helper
- **Confirmation Modals** — Portal-based modals (`createPortal`) for all destructive actions
- **Responsive Design** — Mobile-first with adaptive sidebars and hamburger navigation
- **Toast Notifications** — react-hot-toast for all user feedback

## Design System

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `frozen` | `#f8dfed` | Backgrounds |
| `icy-veil` | `#e4b6d0` | Light accents |
| `glacier-glow` | `#de8fab` | Medium pink |
| `frost-byte` | `#cf6a86` | Primary buttons & links |
| `midnight-chill` | `#8f0f24` | Dark headings |
| `polar-night` | `#5b1824` | Text & footer |

### Typography

| Font | Usage |
|---|---|
| Playfair Display | Headings |
| Cormorant Garamond | Body text |
| Lobster | Decorative accents |

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | `http://127.0.0.1:8000/api` |

## License

Private project for educational purposes.
