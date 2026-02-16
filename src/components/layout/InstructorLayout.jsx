import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Star, LogOut, Menu, X, MoreVertical } from 'lucide-react';
import { ROLES } from '../../utils/constants';

const InstructorLayout = ({ children }) => {
    const { user, logout, loading } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen bg-frozen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-frost-byte"></div>
            </div>
        );
    }

    if (!user || user.role !== ROLES.INSTRUCTOR) {
        return <Navigate to="/login" replace />;
    }

    const navigation = [
        { name: 'Dashboard', href: '/instructor/dashboard', icon: LayoutDashboard },
        // Add more if needed, but for now Dashboard covers it all or we split it
    ];

    return (
        <div className="min-h-screen bg-frozen/30 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-polar-night/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-polar-night/5 
                transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="h-full flex flex-col">
                    {/* Logo/Header */}
                    <div className="p-8 pb-4">
                        <h1 className="text-2xl font-black text-polar-night tracking-tighter">
                            BORN <span className="text-frost-byte">ANGEL</span>
                        </h1>
                        <p className="text-xs font-bold text-text-primary/40 uppercase tracking-widest mt-1">
                            Instructor Portal
                        </p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                            ? 'bg-polar-night text-white shadow-lg shadow-polar-night/20'
                                            : 'text-text-primary/60 hover:bg-frozen/50 hover:text-polar-night'
                                        }`}
                                >
                                    <item.icon size={20} className={isActive ? 'text-frost-byte' : 'group-hover:text-polar-night'} />
                                    <span className="font-bold text-sm">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile */}
                    <div className="p-4 border-t border-polar-night/5 bg-frozen/10">
                        <div className="relative flex items-center gap-3 p-3 rounded-2xl">
                            <div className="w-10 h-10 rounded-full bg-polar-night text-white flex items-center justify-center font-bold shrink-0">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="overflow-hidden flex-1">
                                <p className="font-bold text-sm text-polar-night truncate">{user.name}</p>
                                <p className="text-xs text-text-primary/60 truncate">{user.email}</p>
                            </div>
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="p-1.5 rounded-lg hover:bg-polar-night/5 transition-all border-none bg-transparent cursor-pointer text-polar-night/40 hover:text-polar-night"
                            >
                                <MoreVertical size={16} />
                            </button>

                            {showDropdown && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
                                    <div className="absolute bottom-full right-0 mb-2 w-44 bg-white rounded-xl shadow-lg border border-polar-night/5 py-1.5 z-50">
                                        <button
                                            onClick={() => { logout(); setShowDropdown(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-text-primary/70 hover:text-red-500 hover:bg-red-50 transition-all border-none bg-transparent cursor-pointer text-sm font-medium"
                                        >
                                            <LogOut size={16} />
                                            <span>Sign Out</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
                {/* Mobile Header */}
                <header className="lg:hidden bg-white border-b border-polar-night/5 p-4 flex justify-between items-center sticky top-0 z-30">
                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-polar-night">
                        <Menu size={24} />
                    </button>
                    <span className="font-bold text-polar-night">Instructor Dashboard</span>
                    <div className="w-8" /> {/* Spacer */}
                </header>

                <div className="flex-grow p-4 md:p-8 max-w-[1600px] mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default InstructorLayout;
