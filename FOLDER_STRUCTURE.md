# Born Angel React - Folder Structure

## 📁 Project Structure

```
src/
├── pages/                      # Page components organized by role
│   ├── public/                 # Public pages (no auth required)
│   │   ├── HomePage.jsx
│   │   ├── ServicesPage.jsx
│   │   ├── InstructorsPage.jsx
│   │   └── ServiceDetailPage.jsx
│   │
│   ├── auth/                   # Authentication pages
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   └── ForgotPasswordPage.jsx
│   │
│   ├── user/                   # User/Customer pages
│   │   ├── DashboardPage.jsx
│   │   ├── MyBookingsPage.jsx
│   │   ├── BookingDetailPage.jsx
│   │   ├── CreateBookingPage.jsx
│   │   └── MyReviewsPage.jsx
│   │
│   ├── instructor/             # Instructor pages
│   │   ├── DashboardPage.jsx
│   │   ├── MySchedulesPage.jsx
│   │   └── MyReviewsPage.jsx
│   │
│   └── admin/                  # Admin & Super Admin pages
│       ├── DashboardPage.jsx
│       ├── users/
│       │   ├── UsersListPage.jsx
│       │   ├── CreateUserPage.jsx
│       │   └── EditUserPage.jsx
│       ├── services/
│       │   ├── ServicesListPage.jsx
│       │   ├── CreateServicePage.jsx
│       │   └── EditServicePage.jsx
│       ├── instructors/
│       │   ├── InstructorsListPage.jsx
│       │   ├── CreateInstructorPage.jsx
│       │   └── EditInstructorPage.jsx
│       ├── schedules/
│       │   ├── SchedulesListPage.jsx
│       │   ├── CreateSchedulePage.jsx
│       │   └── EditSchedulePage.jsx
│       └── bookings/
│           └── BookingsListPage.jsx
│
├── components/                 # Reusable components
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Sidebar.jsx
│   │   └── AdminLayout.jsx
│   │
│   └── common/
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── Modal.jsx
│       ├── Table.jsx
│       ├── Form/
│       │   ├── Input.jsx
│       │   ├── Select.jsx
│       │   └── TextArea.jsx
│       └── Loading.jsx
│
├── services/                   # API service layer
│   ├── api.js                  # Axios instance with interceptors
│   ├── authService.js          # Auth API calls
│   ├── userService.js          # User management API
│   ├── serviceService.js       # Services API
│   ├── instructorService.js    # Instructors API
│   ├── scheduleService.js      # Schedules API
│   ├── bookingService.js       # Bookings API
│   └── reviewService.js        # Reviews API
│
├── contexts/                   # React Context for state management
│   └── AuthContext.jsx         # Authentication state & user role
│
├── routes/                     # Route configuration
│   ├── AppRoutes.jsx           # Main route component
│   ├── ProtectedRoute.jsx      # Auth guard
│   └── RoleRoute.jsx           # Role-based route guard
│
├── utils/                      # Utility functions
│   ├── constants.js            # App constants (roles, status, etc)
│   └── helpers.js              # Helper functions
│
├── App.jsx                     # Main app component
├── main.jsx                    # Entry point
└── index.css                   # Global styles
```

## 🎯 Role-Based Access Control (RBAC)

### Public Routes (No Auth)
- Home Page
- Services List & Detail
- Instructors List & Detail
- Login & Register

### User/Customer Routes
- Dashboard
- My Bookings (CRUD)
- Create Review
- My Reviews

### Instructor Routes
- Dashboard
- My Schedules (Read Only)
- Reviews for My Classes (Read Only)

### Admin & Super Admin Routes
- Dashboard
- User Management (CRUD)
  - Admin: Can create Admin/Instructor
  - Super Admin: Can create Super Admin
- Service Management (CRUD)
- Instructor Management (CRUD)
- Schedule Management (CRUD)
- Bookings Management (View All)

## 🔐 Protection Hierarchy

1. **Super Admin (God Mode)**
   - Full access to everything
   - Can manage other Super Admins
   - Master Account (ID 1) is immutable

2. **Admin (Manager)**
   - Manage Services, Instructors, Schedules, Users
   - Cannot touch Super Admin accounts
   - Cannot create Super Admin

3. **Instructor (Employee)**
   - View own schedules
   - View reviews for own classes
   - No management access

4. **User (Customer)**
   - Book services
   - Write reviews
   - Manage own bookings
