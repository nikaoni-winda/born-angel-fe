import api from './api';

/**
 * Booking Management API
 * User: index (own bookings), store, cancel
 * Admin: index (all bookings), cancel (any booking)
 */

const bookingService = {
    // User/Admin - Get bookings (context-aware)
    // User: own bookings only
    // Admin: all bookings (or filtered by user_id)
    getAll: async (filters = {}) => {
        const response = await api.get('/bookings', { params: filters });
        return response.data;
    },

    // User - Create booking
    create: async (bookingData) => {
        const response = await api.post('/bookings', bookingData);
        return response.data;
    },

    // User/Admin - Cancel booking
    cancel: async (id) => {
        const response = await api.post(`/bookings/${id}/cancel`);
        return response.data;
    },
};

export default bookingService;
