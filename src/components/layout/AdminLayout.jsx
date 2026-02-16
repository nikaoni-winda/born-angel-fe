import React from 'react';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { ROLES } from '../../utils/constants';

const AdminLayout = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-frozen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-frost-byte"></div>
            </div>
        );
    }

    // Allow both ADMIN and SUPER_ADMIN
    if (!user || (user.role !== ROLES.ADMIN && user.role !== ROLES.SUPER_ADMIN)) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-frozen/30">
            <AdminSidebar />
            <main className="pl-64 min-h-screen flex flex-col">
                <div className="flex-grow p-8 max-w-[1600px] mx-auto w-full">
                    {children}
                </div>
                <footer className="p-8 border-t border-polar-night/5 text-center text-text-primary/30 text-[0.75rem] font-medium tracking-wide uppercase">
                    Born Angel Control Center &copy; 2026 Admin Portal
                </footer>
            </main>
        </div>
    );
};

export default AdminLayout;
