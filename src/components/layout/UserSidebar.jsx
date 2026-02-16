import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Star,
    User,
    LogOut,
    Home,
    ShoppingBag,
    Trash2,
    MoreVertical
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../utils/constants';
import ConfirmModal from '../common/ConfirmModal';

const UserSidebar = () => {
    const { logout, deleteAccount, user } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        try {
            setDeleting(true);
            await deleteAccount();
        } catch (error) {
            console.error('Failed to delete account:', error);
            setDeleting(false);
            setShowDeleteConfirm(false);
        }
    };

    const menuItems = [
        { icon: <LayoutDashboard size={19} />, label: 'Dashboard', path: ROUTES.USER_DASHBOARD },
        { icon: <Calendar size={19} />, label: 'My Bookings', path: ROUTES.MY_BOOKINGS },
        { icon: <ShoppingBag size={19} />, label: 'Browse Classes', path: ROUTES.BROWSE_CLASSES },
        { icon: <Star size={19} />, label: 'My Reviews', path: ROUTES.MY_REVIEWS },
    ];

    return (
        <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-polar-night/5 flex flex-col h-screen fixed left-0 top-0 z-30">
            {/* Logo Section */}
            <div className="p-7">
                <Link to="/" className="flex items-center gap-2 group no-underline">
                    <span className="font-heading text-[1.5rem] text-polar-night font-bold tracking-tight leading-none text-nowrap">
                        Born <span className="italic font-light text-frost-byte">Angel</span>
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-grow px-4 space-y-1 mt-4">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 no-underline
                            ${isActive
                                ? 'bg-polar-night text-white shadow-md'
                                : 'text-text-primary/50 hover:bg-frozen/50 hover:text-polar-night font-medium'
                            }
                        `}
                    >
                        {item.icon}
                        <span className="text-[0.9rem]">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Profile Section */}
            <div className="p-4 mt-auto border-t border-polar-night/5 bg-frozen/10">
                <div className="relative flex items-center gap-3 p-3 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-frost-byte/10 flex items-center justify-center text-frost-byte font-bold text-sm border border-frost-byte/20 shrink-0">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-bold text-polar-night text-sm truncate">{user?.name}</span>
                        <span className="text-[0.65rem] text-frost-byte font-bold uppercase tracking-widest leading-none mt-1">{user?.role}</span>
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
                            <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-lg border border-polar-night/5 py-1.5 z-50">
                                <button
                                    onClick={() => { logout(); setShowDropdown(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-text-primary/70 hover:text-red-500 hover:bg-red-50 transition-all border-none bg-transparent cursor-pointer text-sm font-medium"
                                >
                                    <LogOut size={16} />
                                    <span>Sign Out</span>
                                </button>
                                <button
                                    onClick={() => { setShowDeleteConfirm(true); setShowDropdown(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-text-primary/70 hover:text-red-500 hover:bg-red-50 transition-all border-none bg-transparent cursor-pointer text-sm font-medium"
                                >
                                    <Trash2 size={16} />
                                    <span>Delete Account</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDeleteAccount}
                title="Delete Account?"
                message="This action is permanent and cannot be undone. All your data, bookings, and reviews will be removed."
                confirmText={deleting ? 'Deleting...' : 'Yes, Delete'}
                loading={deleting}
            />
        </aside>
    );
};

export default UserSidebar;
