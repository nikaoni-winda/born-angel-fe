import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import userService from '../../../services/userService';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import { withMinDelay } from '../../../utils/loadingUtils';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, User, Mail, Phone, Lock } from 'lucide-react';
import AdminFilterDropdown from '../../../components/admin/AdminFilterDropdown';

const EditAdminPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: '',
        password: '', // Optional for edit
        role: 'admin'
    });

    const roleOptions = [
        { label: 'Admin', value: 'admin' },
        { label: 'Super Admin', value: 'super_admin' }
    ];

    useEffect(() => {
        fetchAdmin();
    }, [id]);

    const fetchAdmin = async () => {
        try {
            setLoading(true);
            const admin = await withMinDelay(userService.getById(id));
            setFormData({
                name: admin.name,
                email: admin.email,
                phone_number: admin.phone_number || '',
                password: '',
                role: admin.role
            });
        } catch (error) {
            console.error("Error fetching admin:", error);
            toast.error("Failed to load admin data");
            navigate(ROUTES.ADMIN_ADMINS);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (value) => {
        setFormData(prev => ({ ...prev, role: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Only send password if it's been changed
            const updateData = { ...formData };
            if (!updateData.password) {
                delete updateData.password;
            }

            await userService.update(id, updateData);
            toast.success('Admin updated successfully!');
            navigate(ROUTES.ADMIN_ADMINS);
        } catch (error) {
            console.error("Error updating admin:", error);
            const message = error.response?.data?.message || 'Failed to update admin';
            toast.error(message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-frost-byte mb-4"></div>
                    <p className="text-text-primary/30 text-[0.85rem] italic font-medium">Loading...</p>
                </div>
            </AdminLayout>
        );
    }

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
                        <h1 className="text-2xl font-bold text-polar-night">Edit Admin</h1>
                        <p className="text-text-primary/60 text-sm">Update admin account details</p>
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

                        {/* Password (Optional) */}
                        <div>
                            <label className="block text-xs font-bold text-polar-night uppercase tracking-wider mb-2">
                                New Password (Optional)
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-polar-night/40 pointer-events-none z-10" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    minLength="8"
                                    placeholder="Leave blank to keep current password"
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-polar-night/10 focus:outline-none focus:ring-2 focus:ring-frost-byte/50 bg-white"
                                />
                            </div>
                            <p className="text-xs text-text-primary/40 mt-2 italic">
                                Only fill this if you want to change the password
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
                                disabled={saving}
                                className="bg-polar-night text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-polar-night/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        <span>Update Admin</span>
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

export default EditAdminPage;
