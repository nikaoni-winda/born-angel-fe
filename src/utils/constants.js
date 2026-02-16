// App Constants

// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

// User Roles
export const ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    INSTRUCTOR: 'instructor',
    USER: 'user',
};

// Booking Status (from database enum)
export const BOOKING_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
};

// Payment Status (Simplified for UI)
// Note: Backend uses Midtrans transaction_status:
// - pending, capture, settlement, deny, expire, cancel
// Frontend can map these to simplified status for display
export const PAYMENT_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',        // Maps to: settlement, capture
    FAILED: 'failed',    // Maps to: deny, expire, cancel
};

// Local Storage Keys
export const STORAGE_KEYS = {
    TOKEN: 'auth_token',
    USER: 'user_data',
};

// Route Paths
export const ROUTES = {
    // Public
    HOME: '/',
    SERVICES: '/services',
    SERVICE_DETAIL: '/services/:id',
    INSTRUCTORS: '/instructors',
    INSTRUCTOR_DETAIL: '/instructors/:id',

    // Auth
    LOGIN: '/login',
    REGISTER: '/register',

    // User/Customer
    USER_DASHBOARD: '/user/dashboard',
    MY_BOOKINGS: '/user/bookings',
    CREATE_BOOKING: '/user/bookings/create',
    BOOKING_DETAIL: '/user/bookings/:id',
    BROWSE_CLASSES: '/user/classes',
    MY_REVIEWS: '/user/reviews',
    MY_REVIEWS_CREATE: '/user/reviews/create',
    MY_REVIEWS_EDIT: '/user/reviews/edit/:id',

    // Instructor
    INSTRUCTOR_DASHBOARD: '/instructor/dashboard',
    INSTRUCTOR_SCHEDULES: '/instructor/schedules',
    INSTRUCTOR_REVIEWS: '/instructor/reviews',

    // Admin & Super Admin
    ADMIN_DASHBOARD: '/admin/dashboard',

    // Admin Management (Super Admin Only)
    ADMIN_ADMINS: '/admin/admins',
    ADMIN_ADMINS_CREATE: '/admin/admins/create',
    ADMIN_ADMINS_EDIT: '/admin/admins/:id/edit',

    // User Management
    ADMIN_USERS: '/admin/users',
    ADMIN_USERS_CREATE: '/admin/users/create',
    ADMIN_USERS_EDIT: '/admin/users/:id/edit',

    // Service Management
    ADMIN_SERVICES: '/admin/services',
    ADMIN_SERVICES_CREATE: '/admin/services/create',
    ADMIN_SERVICES_EDIT: '/admin/services/:id/edit',

    // Instructor Management
    ADMIN_INSTRUCTORS: '/admin/instructors',
    ADMIN_INSTRUCTORS_CREATE: '/admin/instructors/create',
    ADMIN_INSTRUCTORS_EDIT: '/admin/instructors/:id/edit',

    // Schedule Management
    ADMIN_SCHEDULES: '/admin/schedules',
    ADMIN_SCHEDULES_CREATE: '/admin/schedules/create',
    ADMIN_SCHEDULES_EDIT: '/admin/schedules/:id/edit',

    // Booking Management
    ADMIN_BOOKINGS: '/admin/bookings',
};
