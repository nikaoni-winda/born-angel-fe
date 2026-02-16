import api from './api';

/**
 * User Management API (Admin & Super Admin only)
 * Admin: Can create admin/instructor, cannot touch super_admin
 * Super Admin: Can create any role including super_admin
 */

const userService = {
    // Admin - Get all users
    getAll: async (params = {}) => {
        const response = await api.get('/users', { params });
        return response.data;
    },

    // Admin - Get user by ID
    getById: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    // Admin - Get users by role
    getByRole: async (role) => {
        const response = await api.get('/users', {
            params: { role }
        });
        return response.data;
    },

    // Admin - Create user (admin/instructor)
    // Super Admin - Create user (any role)
    create: async (userData) => {
        const response = await api.post('/users', userData);
        return response.data;
    },

    // Admin - Update user
    // Hierarchy enforced by backend
    update: async (id, userData) => {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    },

    // Admin - Delete user
    // Hierarchy enforced by backend
    delete: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },
};

export default userService;
