import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import userService from '../../../services/userService';
import { withMinDelay } from '../../../utils/loadingUtils';
import { Search, Trash2, Edit, Plus, Shield, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../utils/constants';
import toast from 'react-hot-toast';
import ConfirmModal from '../../../components/common/ConfirmModal';

const AdminsListPage = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            setLoading(true);
            // Fetch users with role admin or super_admin
            const allUsers = await withMinDelay(userService.getAll({ per_page: 100 }));
            const adminUsers = (allUsers.data || allUsers).filter(u => u.role === 'admin' || u.role === 'super_admin');
            setAdmins(adminUsers);
        } catch (error) {
            console.error("Error fetching admins:", error);
            toast.error("Failed to load admins");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await userService.delete(deleteId);
            toast.success('Admin deleted successfully');
            setAdmins(prev => prev.filter(a => a.id !== deleteId));
        } catch (error) {
            console.error("Error deleting admin:", error);
            const message = error.response?.data?.message || 'Failed to delete admin';
            toast.error(message);
        } finally {
            setDeleteId(null);
        }
    };

    const filteredAdmins = admins.filter(admin =>
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-polar-night mb-2">Manage Admins</h1>
                        <p className="text-text-primary/60 text-sm">Manage admin and super admin accounts</p>
                    </div>

                    <Link
                        to={ROUTES.ADMIN_ADMINS_CREATE}
                        className="bg-polar-night text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:bg-polar-night/90 transition-colors font-medium text-sm no-underline"
                    >
                        <Plus size={18} />
                        <span>Add Admin</span>
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-4 rounded-2xl border border-polar-night/5 shadow-sm">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-primary/40" size={20} />
                        <input
                            type="text"
                            placeholder="Search admins by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 rounded-xl border border-polar-night/10 focus:outline-none focus:ring-2 focus:ring-frost-byte/50 w-full"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 min-h-[40vh]">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-frost-byte mb-4"></div>
                    <p className="text-text-primary/30 text-[0.85rem] italic font-medium">Loading...</p>
                </div>
            ) : filteredAdmins.length === 0 ? (
                <div className="bg-white rounded-[2rem] border border-polar-night/5 shadow-sm p-12 text-center">
                    <Shield size={48} className="mx-auto text-polar-night/20 mb-4" />
                    <h3 className="text-lg font-bold text-polar-night mb-2">
                        {searchTerm ? 'No admins found' : 'No admins yet'}
                    </h3>
                    <p className="text-text-primary/60 text-sm mb-6">
                        {searchTerm ? 'Try adjusting your search criteria' : 'Create your first admin account to get started'}
                    </p>
                    {!searchTerm && (
                        <Link
                            to={ROUTES.ADMIN_ADMINS_CREATE}
                            className="inline-flex items-center gap-2 bg-polar-night text-white px-6 py-3 rounded-xl hover:bg-polar-night/90 transition-colors font-medium no-underline"
                        >
                            <Plus size={18} />
                            Add Admin
                        </Link>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] border border-polar-night/5 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-frozen/20 border-b border-polar-night/5">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-text-primary/30">Admin</th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-text-primary/30">Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-text-primary/30">Phone</th>
                                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-text-primary/30">Role</th>
                                    <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-widest text-text-primary/30">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-polar-night/5">
                                {filteredAdmins.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-frozen/10 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${admin.role === 'super_admin' ? 'bg-amber-500' : 'bg-polar-night'}`}>
                                                    {admin.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-polar-night">{admin.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-text-primary/70">{admin.email}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-text-primary/70">{admin.phone_number || '-'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${admin.role === 'super_admin'
                                                    ? 'bg-amber-100 text-amber-600'
                                                    : 'bg-polar-night/10 text-polar-night'
                                                }`}>
                                                {admin.role === 'super_admin' ? <Crown size={12} /> : <Shield size={12} />}
                                                {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={ROUTES.ADMIN_ADMINS_EDIT.replace(':id', admin.id)}
                                                    className="p-2 hover:bg-frozen/20 text-text-primary/60 hover:text-polar-night rounded-lg transition-colors"
                                                    title="Edit Admin"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteId(admin.id)}
                                                    className="p-2 hover:bg-red-50 text-text-primary/60 hover:text-red-500 rounded-lg transition-colors"
                                                    title="Delete Admin"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            <ConfirmModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Admin"
                message="Are you sure you want to delete this admin? This action cannot be undone."
            />
        </AdminLayout>
    );
};

export default AdminsListPage;
