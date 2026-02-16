import React from 'react';
import UserSidebar from './UserSidebar';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { ROLES } from '../../utils/constants';

const UserLayout = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-frozen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-frost-byte"></div>
            </div>
        );
    }

    if (!user || user.role !== ROLES.USER) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-frozen/30">
            <UserSidebar />
            <main className="pl-64 min-h-screen flex flex-col">
                <div className="flex-grow p-8">
                    {children}
                </div>

                {/* Optional Internal Footer */}
                <footer className="p-8 border-t border-polar-night/5 text-center text-text-primary/40 text-[0.8rem] font-light tracking-wide">
                    &copy; 2026 Born Angel Beauty Academy. All rights reserved.
                </footer>
            </main>
        </div>
    );
};

export default UserLayout;
