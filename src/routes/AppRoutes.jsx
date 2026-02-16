import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import { ROLES } from '../utils/constants';

// Public Pages
import HomePage from '../pages/public/HomePage';
import ServicesPage from '../pages/public/ServicesPage';
import InstructorsPage from '../pages/public/InstructorsPage';
import ServiceDetailPage from '../pages/public/ServiceDetailPage';
import AboutPage from '../pages/public/AboutPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// User Pages
import UserDashboard from '../pages/user/DashboardPage';
import MyBookingsPage from '../pages/user/MyBookingsPage';
import CreateBookingPage from '../pages/user/CreateBookingPage';
import MyReviewsPage from '../pages/user/MyReviewsPage';
import CreateReviewPage from '../pages/user/CreateReviewPage';
import EditReviewPage from '../pages/user/EditReviewPage';
import BrowseClassesPage from '../pages/user/BrowseClassesPage';

// Instructor Pages
import InstructorDashboard from '../pages/instructor/DashboardPage';
import MySchedulesPage from '../pages/instructor/MySchedulesPage';

// Admin Pages
// Admin Pages
import AdminDashboard from '../pages/admin/DashboardPage';
import SuperAdminDashboard from '../pages/admin/SuperAdminDashboard';
import AdminsListPage from '../pages/admin/admins/AdminsListPage';
import CreateAdminPage from '../pages/admin/admins/CreateAdminPage';
import EditAdminPage from '../pages/admin/admins/EditAdminPage';
import UsersListPage from '../pages/admin/users/UsersListPage';
import UserHistoryPage from '../pages/admin/users/UserHistoryPage';
import CreateStaffPage from '../pages/admin/users/CreateStaffPage';
import ServicesListPage from '../pages/admin/services/ServicesListPage';
import CreateServicePage from '../pages/admin/services/CreateServicePage';
import EditServicePage from '../pages/admin/services/EditServicePage';
import CreateInstructorPage from '../pages/admin/instructors/CreateInstructorPage';
import EditInstructorPage from '../pages/admin/instructors/EditInstructorPage';
import InstructorsListPage from '../pages/admin/instructors/InstructorsListPage';
import CreateSchedulePage from '../pages/admin/schedules/CreateSchedulePage';
import EditSchedulePage from '../pages/admin/schedules/EditSchedulePage';
import SchedulesListPage from '../pages/admin/schedules/SchedulesListPage';
import BookingsListPage from '../pages/admin/bookings/BookingsListPage';

/**
 * Dashboard Redirect Component
 * Redirects authenticated users to their role-specific dashboard
 */
const DashboardRedirect = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    switch (user.role) {
        case ROLES.SUPER_ADMIN:
            return <Navigate to="/super-admin/dashboard" replace />;
        case ROLES.ADMIN:
            return <Navigate to="/admin/dashboard" replace />;
        case ROLES.INSTRUCTOR:
            return <Navigate to="/instructor/dashboard" replace />;
        case ROLES.USER:
            return <Navigate to="/user/dashboard" replace />;
        default:
            return <Navigate to="/" replace />;
    }
};

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* ============================================ */}
                {/* PUBLIC ROUTES */}
                {/* ============================================ */}
                <Route path="/" element={<HomePage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/services/:id" element={<ServiceDetailPage />} />
                <Route path="/instructors" element={<InstructorsPage />} />
                <Route path="/about" element={<AboutPage />} />

                {/* ============================================ */}
                {/* AUTH ROUTES */}
                {/* ============================================ */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Dashboard redirect based on role */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardRedirect />
                        </ProtectedRoute>
                    }
                />

                {/* ============================================ */}
                {/* USER/CUSTOMER ROUTES */}
                {/* ============================================ */}
                <Route
                    path="/user/dashboard"
                    element={
                        <ProtectedRoute>
                            <RoleRoute allowedRoles={[ROLES.USER]}>
                                <UserDashboard />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/bookings"
                    element={
                        <ProtectedRoute>
                            <RoleRoute allowedRoles={[ROLES.USER]}>
                                <MyBookingsPage />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/bookings/create"
                    element={
                        <ProtectedRoute>
                            <RoleRoute allowedRoles={[ROLES.USER]}>
                                <CreateBookingPage />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/reviews"
                    element={
                        <ProtectedRoute>
                            <RoleRoute allowedRoles={[ROLES.USER]}>
                                <MyReviewsPage />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/reviews/create"
                    element={
                        <ProtectedRoute>
                            <RoleRoute allowedRoles={[ROLES.USER]}>
                                <CreateReviewPage />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/reviews/edit/:id"
                    element={
                        <ProtectedRoute>
                            <RoleRoute allowedRoles={[ROLES.USER]}>
                                <EditReviewPage />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/classes"
                    element={
                        <ProtectedRoute>
                            <RoleRoute allowedRoles={[ROLES.USER]}>
                                <BrowseClassesPage />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />

                {/* ============================================ */}
                {/* INSTRUCTOR ROUTES */}
                {/* ============================================ */}
                <Route
                    path="/instructor/dashboard"
                    element={
                        <ProtectedRoute>
                            <RoleRoute allowedRoles={[ROLES.INSTRUCTOR]}>
                                <InstructorDashboard />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/instructor/schedules"
                    element={
                        <ProtectedRoute>
                            <RoleRoute allowedRoles={[ROLES.INSTRUCTOR]}>
                                <MySchedulesPage />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />

                {/* ============================================ */}
                {/* ADMIN & SUPER ADMIN ROUTES */}
                {/* ============================================ */}

                {/* Super Admin Dashboard */}
                <Route
                    path="/super-admin/dashboard"
                    element={
                        <ProtectedRoute>
                            <RoleRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                                <SuperAdminDashboard />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />

                {/* Admin Dashboard */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute>
                            {/* Allow Super Admin access to regular dashboard too if they want, or restrict it. 
                                For now, let's keep it strictly for Admin operational view. */}
                            <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                                <AdminDashboard />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />

                {/* Admin Management (Super Admin Only) */}
                <Route
                    path="/admin/admins"
                    element={
                        <ProtectedRoute>
                            <RoleRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                                <AdminsListPage />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/admins/create"
                    element={
                        <ProtectedRoute>
                            <RoleRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                                <CreateAdminPage />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/admins/:id/edit"
                    element={
                        <ProtectedRoute>
                            <RoleRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                                <EditAdminPage />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />

                {/* User Management */}
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
                <Route
                    path="/admin/users/create"
                    element={
                        <ProtectedRoute>
                            <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                                <CreateStaffPage />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/users/:id/history"
                    element={
                        <ProtectedRoute>
                            <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                                <UserHistoryPage />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />

                {/* Service Management */}
                <Route
                    path="/admin/services"
                    element={
                        <ProtectedRoute>
                            <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                                <ServicesListPage />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/services/create"
                    element={
                        <ProtectedRoute>
                            <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                                <CreateServicePage />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/services/:id/edit"
                    element={
                        <ProtectedRoute>
                            <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                                <EditServicePage />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />

                {/* Instructor Management */}
                <Route
                    path="/admin/instructors"
                    element={
                        <ProtectedRoute>
                            <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                                <InstructorsListPage />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/instructors/create"
                    element={
                        <ProtectedRoute>
                            <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                                <CreateInstructorPage />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/instructors/:id/edit"
                    element={
                        <ProtectedRoute>
                            <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                                <EditInstructorPage />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />

                {/* Schedule Management */}
                <Route
                    path="/admin/schedules"
                    element={
                        <ProtectedRoute>
                            <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                                <SchedulesListPage />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/schedules/create"
                    element={
                        <ProtectedRoute>
                            <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                                <CreateSchedulePage />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/schedules/:id/edit"
                    element={
                        <ProtectedRoute>
                            <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                                <EditSchedulePage />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />

                {/* Booking Management */}
                <Route
                    path="/admin/bookings"
                    element={
                        <ProtectedRoute>
                            <RoleRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
                                <BookingsListPage />
                            </RoleRoute>
                        </ProtectedRoute>
                    }
                />

                {/* ============================================ */}
                {/* 404 NOT FOUND */}
                {/* ============================================ */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter >
    );
};

export default AppRoutes;
