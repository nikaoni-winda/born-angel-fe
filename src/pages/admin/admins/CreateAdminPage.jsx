import React, { useState } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import userService from '../../../services/userService';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, User, Mail, Phone, Lock, Shield } from 'lucide-react';
import AdminFilterDropdown from '../../../components/admin/AdminFilterDropdown';

const CreateAdminPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: '',
        password: '',
        role: 'admin' // Default to admin
    });

    const roleOptions = [
        { label: 'Admin', value: 'admin' },
        { label: 'Super Admin', value: 'super_admin' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (value) => {
        setFormData(prev => ({ ...prev, role: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await userService.create(formData);
            toast.success(`${formData.role === 'super_admin' ? 'Super Admin' : 'Admin'} created successfully!`);
            navigate(ROUTES.ADMIN_ADMINS);
        } catch (error) {
            console.error("Error creating admin:", error);
            const message = error.response?.data?.message || 'Failed to create admin';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-2xl mx-auto">
                <div className="mb-8 flex items-center gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(ROUTES.ADMIN_ADMINS)}
                        className="p-2 hover:bg-frozen/20 rounded-xl transition-colors text-polar-night/60 hover:text-polar-night"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-polar-night">Create Admin</h1>
                        <p className="text-text-primary/60 text-sm">Add a new admin or super admin to the system</p>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] border border-polar-night/5 shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-bold text-polar-night uppercase tracking-wider mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-polar-night/40 pointer-events-none z-10" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter full name"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-polar-night/10 focus:outline-none focus:ring-2 focus:ring-frost-byte/50 bg-white"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold text-polar-night uppercase tracking-wider mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-polar-night/40 pointer-events-none z-10" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="admin@bornangel.com"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-polar-night/10 focus:outline-none focus:ring-2 focus:ring-frost-byte/50 bg-white"
                                />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-xs font-bold text-polar-night uppercase tracking-wider mb-2">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-polar-night/40 pointer-events-none z-10" />
                                <input
                                    type="tel"
                                    name="phone_number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    required
                                    placeholder="+62 812 3456 7890"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-polar-night/10 focus:outline-none focus:ring-2 focus:ring-frost-byte/50 bg-white"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-bold text-polar-night uppercase tracking-wider mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-polar-night/40 pointer-events-none z-10" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength="8"
                                    placeholder="Minimum 8 characters"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-polar-night/10 focus:outline-none focus:ring-2 focus:ring-frost-byte/50 bg-white"
                                />
                            </div>
                            <p className="text-xs text-text-primary/40 mt-2 italic">
                                Password must be at least 8 characters long
                            </p>
                        </div>

                        {/* Role Selector */}
                        <div>
                            <label className="block text-xs font-bold text-polar-night uppercase tracking-wider mb-2">
                                Role
                            </label>
                            <AdminFilterDropdown
                                options={roleOptions}
                                value={formData.role}
                                onChange={handleRoleChange}
                                placeholder="Select Role..."
                            />
                            <p className="text-xs text-text-primary/40 mt-2 italic">
                                {formData.role === 'super_admin'
                                    ? '⚠️ Super Admin has full system access including revenue reports and admin management'
                                    : 'Admin can manage services, schedules, instructors, and bookings'}
                            </p>
                        </div>

                        {/* Info Box */}
                        <div className={`border rounded-xl p-4 ${formData.role === 'super_admin'
                                ? 'bg-amber-50 border-amber-200'
                                : 'bg-frost-byte/10 border-frost-byte/20'
                            }`}>
                            <p className="text-xs text-polar-night/70">
                                <span className="font-bold">Note:</span> {formData.role === 'super_admin'
                                    ? 'This account will have unrestricted access to all system features including financial reports and admin management.'
                                    : 'This account will have access to manage services, schedules, instructors, and bookings.'}
                            </p>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => navigate(ROUTES.ADMIN_ADMINS)}
                                className="px-6 py-3 rounded-xl font-medium text-polar-night/60 hover:bg-frozen/20 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-polar-night text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-polar-night/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        <span>Create Admin</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CreateAdminPage;
