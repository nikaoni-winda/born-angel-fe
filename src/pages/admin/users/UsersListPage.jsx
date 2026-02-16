import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import adminService from '../../../services/adminService';
import Pagination from '../../../components/Pagination';
import { withMinDelay } from '../../../utils/loadingUtils';
import { Users, Search, Trash2, Mail, Phone, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const UsersListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0, from: 0, to: 0 });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const data = await withMinDelay(adminService.getUsers('user', { page, per_page: 15 }));
      setUsers(data.data);
      setPagination({
        current_page: data.current_page,
        last_page: data.last_page,
        total: data.total,
        from: data.from,
        to: data.to,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users list");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      await adminService.deleteUser(userToDelete.id);
      toast.success('User deleted successfully');
      fetchUsers(pagination.current_page);
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error('Failed to delete user');
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* ... Header & Search ... */}
        <div>
          <h1 className="text-3xl font-bold text-polar-night mb-2">User Management</h1>
          <p className="text-text-primary/60 text-sm">View and manage all registered customers</p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-primary/40" size={20} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-xl border border-polar-night/10 focus:outline-none focus:ring-2 focus:ring-frost-byte/50 w-full md:w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 min-h-[40vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-frost-byte mb-4"></div>
          <p className="text-text-primary/40 text-[0.85rem] italic font-medium">Loading...</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-polar-night/5 shadow-sm overflow-hidden">
          {/* ... Table ... */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              {/* ... */}
              <thead className="bg-frozen/10">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-polar-night/60 uppercase tracking-wider">User Info</th>
                  <th className="px-6 py-4 text-xs font-black text-polar-night/60 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-xs font-black text-polar-night/60 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-4 text-xs font-black text-polar-night/60 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-polar-night/5">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-frozen/5 transition-colors">
                      <td className="px-6 py-4">
                        <Link to={`/admin/users/${user.id}/history`} className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
                          <div className="w-10 h-10 rounded-full bg-polar-night/5 flex items-center justify-center text-polar-night font-bold group-hover:bg-polar-night/10 transition-colors">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-polar-night text-sm group-hover:text-frost-byte transition-colors">{user.name}</p>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-frost-byte/10 text-frost-byte">
                              Customer
                            </span>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm text-text-primary/70">
                            <Mail size={14} />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-text-primary/70">
                            <Phone size={14} />
                            <span>{user.phone_number || '-'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-text-primary/70">
                          <Calendar size={14} />
                          <span>{new Date(user.created_at).toLocaleDateString(undefined, { timeZone: 'UTC' })}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => confirmDelete(user)}
                          className="p-2 hover:bg-red-50 text-text-primary/40 hover:text-red-500 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-text-primary/40">
                      <div className="flex flex-col items-center gap-2">
                        <Users size={32} className="opacity-20" />
                        <p>No users found matching your search.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            currentPage={pagination.current_page}
            lastPage={pagination.last_page}
            total={pagination.total}
            from={pagination.from}
            to={pagination.to}
            onPageChange={(page) => fetchUsers(page)}
          />
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-polar-night/20 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-xl border border-polar-night/5 animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                <Trash2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-polar-night mb-2">Delete User?</h3>
              <p className="text-text-primary/60 text-sm mb-6">
                Are you sure you want to delete <span className="font-bold text-polar-night">{userToDelete?.name}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 rounded-xl border border-polar-night/10 font-bold text-polar-night hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default UsersListPage;
