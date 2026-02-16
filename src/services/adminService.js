import api from './api';

const adminService = {
    getStats: async () => {
        const response = await api.get('/admin/dashboard/stats');
        return response.data;
    },

    // Get all users with optional role filter (paginated)
    getUsers: async (role = null, paginationParams = {}) => {
        const params = role ? { role, ...paginationParams } : { ...paginationParams };
        const response = await api.get('/users', { params });
        return response.data;
    },

    // Get single user details
    getUser: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    // Delete a user
    deleteUser: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    }
};

export default adminService;
