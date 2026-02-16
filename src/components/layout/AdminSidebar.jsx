import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    UserCircle,
    Calendar,
    ClipboardList,
    LogOut,
    Shield,
    MoreVertical
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES, ROLES } from '../../utils/constants';

const AdminSidebar = () => {
    const { logout, user } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const isSuperAdmin = user?.role === ROLES.SUPER_ADMIN;

    const menuItems = [
        {
            icon: <LayoutDashboard size={19} />,
            label: 'Dashboard',
            path: isSuperAdmin ? '/super-admin/dashboard' : ROUTES.ADMIN_DASHBOARD
        },
        // Super Admin Only: Manage Admins
        ...(isSuperAdmin ? [{
            icon: <Shield size={19} />,
            label: 'Manage Admins',
            path: ROUTES.ADMIN_ADMINS
        }] : []),
        { icon: <Users size={19} />, label: 'Manage Users', path: ROUTES.ADMIN_USERS },
        { icon: <ShoppingBag size={19} />, label: 'Services', path: ROUTES.ADMIN_SERVICES },
        { icon: <UserCircle size={19} />, label: 'Instructors', path: ROUTES.ADMIN_INSTRUCTORS },
        { icon: <Calendar size={19} />, label: 'Schedules', path: ROUTES.ADMIN_SCHEDULES },
        { icon: <ClipboardList size={19} />, label: 'Bookings', path: ROUTES.ADMIN_BOOKINGS },
    ];

    return (
        <aside className="w-64 bg-white border-r border-polar-night/5 flex flex-col h-screen fixed left-0 top-0 z-30 shadow-sm">
            {/* Logo Section */}
            <div className="p-7">
                <Link to="/" className="flex items-center gap-2 group no-underline">
                    {isSuperAdmin ? (
                        <>
                            <span className="font-heading text-[1.5rem] text-polar-night font-bold tracking-tight leading-none text-nowrap">
                                Born <span className="italic font-light text-amber-500">Angel</span>
                            </span>
                            <div className="ml-1 px-1.5 py-0.5 bg-amber-500 text-white text-[0.55rem] font-black uppercase rounded tracking-widest">
                                SUPER
                            </div>
                        </>
                    ) : (
                        <>
                            <span className="font-heading text-[1.5rem] text-polar-night font-bold tracking-tight leading-none text-nowrap">
                                Born <span className="italic font-light text-frost-byte">Angel</span>
                            </span>
                            <div className="ml-1 px-1.5 py-0.5 bg-polar-night text-white text-[0.55rem] font-black uppercase rounded tracking-widest">
                                Admin
                            </div>
                        </>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-grow px-4 space-y-1 mt-4">
                <p className="px-4 text-[0.6rem] font-black uppercase tracking-[0.2em] text-text-primary/20 mb-3">Main Menu</p>
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 no-underline
                            ${isActive
                                ? isSuperAdmin
                                    ? 'bg-polar-night text-amber-500 shadow-md border-l-4 border-amber-500' // Super Admin Active State
                                    : 'bg-polar-night text-white shadow-md' // Regular Admin Active State
                                : 'text-text-primary/50 hover:bg-frozen/50 hover:text-polar-night font-medium'
                            }
                        `}
                    >
                        {item.icon}
                        <span className="text-[0.85rem]">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Profile Section */}
            <div className="p-4 mt-auto border-t border-polar-night/5 bg-frozen/10">
                <div className="relative flex items-center gap-3 p-3 rounded-2xl">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm border border-white shadow-sm shrink-0 ${isSuperAdmin ? 'bg-amber-500' : 'bg-polar-night'}`}>
                        {(user?.name || 'A').charAt(0)}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-bold text-polar-night text-sm truncate">
                            {isSuperAdmin ? 'Super Admin' : (user?.name || 'Admin')}
                        </span>
                        <div className="flex items-center gap-1">
                            <Shield size={10} className={isSuperAdmin ? "text-amber-500" : "text-frost-byte"} />
                            <span className={`text-[0.6rem] font-black uppercase tracking-widest leading-none ${isSuperAdmin ? "text-amber-500" : "text-frost-byte"}`}>
                                {isSuperAdmin ? "Headquarters" : "System Admin"}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="p-1.5 rounded-lg hover:bg-polar-night/5 transition-all border-none bg-transparent cursor-pointer text-polar-night/40 hover:text-polar-night"
                    >
                        <MoreVertical size={16} />
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
                            <div className="absolute bottom-full right-0 mb-2 w-44 bg-white rounded-xl shadow-lg border border-polar-night/5 py-1.5 z-50">
                                <button
                                    onClick={() => { logout(); setShowDropdown(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-text-primary/70 hover:text-red-500 hover:bg-red-50 transition-all border-none bg-transparent cursor-pointer text-sm font-medium"
                                >
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default AdminSidebar;
