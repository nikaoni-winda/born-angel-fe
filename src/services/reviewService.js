import api from './api';

/**
 * Review Management API
 * Public/Instructor: index (context-aware)
 * User: store, update, destroy (own reviews)
 * Admin: destroy (any review)
 */

const reviewService = {
    // Public - Get testimonials for homepage (no auth required)
    getTestimonials: async (params = {}) => {
        const response = await api.get('/testimonials', { params });
        return response.data;
    },

    // Authenticated - Get reviews (context-aware by role)
    // User: own reviews, Instructor: own class reviews, Admin: all
    getAll: async (params = {}) => {
        const response = await api.get('/reviews', { params });
        return response.data;
    },

    // Helper - Get reviews by instructor
    getByInstructor: async (instructorId) => {
        const response = await api.get('/reviews', {
            params: { instructor_id: instructorId }
        });
        return response.data;
    },

    // User - Create review
    create: async (reviewData) => {
        const response = await api.post('/reviews', reviewData);
        return response.data;
    },

    // User - Update review
    update: async (id, reviewData) => {
        const response = await api.put(`/reviews/${id}`, reviewData);
        return response.data;
    },

    // User/Admin - Delete review
    delete: async (id) => {
        const response = await api.delete(`/reviews/${id}`);
        return response.data;
    },
};

export default reviewService;
