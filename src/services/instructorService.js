import api from './api';

/**
 * Instructor Management API
 * Public: index, show
 * Admin: store, update, destroy
 */

const instructorService = {
    // Public - Get all instructors (paginated)
    getAll: async (params = {}) => {
        const response = await api.get('/instructors', { params });
        return response.data;
    },

    // Public - Get instructor by ID
    getById: async (id) => {
        const response = await api.get(`/instructors/${id}`);
        return response.data;
    },

    // Admin - Create instructor profile
    create: async (instructorData) => {
        const response = await api.post('/instructors', instructorData);
        return response.data;
    },

    // Admin - Update instructor profile
    update: async (id, instructorData) => {
        if (instructorData instanceof FormData) {
            instructorData.append('_method', 'PUT');
            const response = await api.post(`/instructors/${id}`, instructorData);
            return response.data;
        }
        const response = await api.put(`/instructors/${id}`, instructorData);
        return response.data;
    },

    // Admin - Delete instructor profile
    delete: async (id) => {
        const response = await api.delete(`/instructors/${id}`);
        return response.data;
    },
};

export default instructorService;
