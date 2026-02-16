import api from './api';

/**
 * Schedule Management API
 * Public: index (context-aware), show
 * Admin: store, update, destroy
 */

const scheduleService = {
    // Public/Auth - Get schedules (context-aware)
    // Public/User: upcoming only
    // Instructor: own schedules
    // Admin: all schedules
    getAll: async (params = {}) => {
        const response = await api.get('/schedules', { params });
        return response.data;
    },

    // Public - Get schedule by ID
    getById: async (id) => {
        const response = await api.get(`/schedules/${id}`);
        return response.data;
    },

    // Admin - Create schedule
    create: async (scheduleData) => {
        const response = await api.post('/schedules', scheduleData);
        return response.data;
    },

    // Admin - Update schedule
    update: async (id, scheduleData) => {
        const response = await api.put(`/schedules/${id}`, scheduleData);
        return response.data;
    },

    // Admin - Delete schedule
    delete: async (id) => {
        const response = await api.delete(`/schedules/${id}`);
        return response.data;
    },

    // Helper - Get schedules by instructor
    getByInstructor: async (instructorId) => {
        const response = await api.get('/schedules', {
            params: { instructor_id: instructorId }
        });
        return response.data;
    },
};

export default scheduleService;
