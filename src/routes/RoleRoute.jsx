import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Role-Based Route Component
 * Redirects to appropriate dashboard if user doesn't have required role
 */
const RoleRoute = ({ children, allowedRoles }) => {
    const { user, hasRole, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has required role
    if (!hasRole(allowedRoles)) {
        // Redirect to appropriate dashboard based on user role
        switch (user.role) {
            case 'super_admin':
            case 'admin':
                return <Navigate to="/admin/dashboard" replace />;
            case 'instructor':
                return <Navigate to="/instructor/dashboard" replace />;
            case 'user':
                return <Navigate to="/user/dashboard" replace />;
            default:
                return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default RoleRoute;
