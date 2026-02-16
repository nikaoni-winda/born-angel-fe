import api from './api';

/**
 * Payment Management API
 * Handling Midtrans Snap Token retrieval
 */

const paymentService = {
    // Get Snap Token for a booking
    getSnapToken: async (bookingId) => {
        try {
            console.log('[PaymentService] Requesting snap token for booking:', bookingId);
            const response = await api.get(`/payments/snap-token/${bookingId}`);
            console.log('[PaymentService] Snap token received:', response.data);
            return response.data;
        } catch (error) {
            console.error('[PaymentService] Error getting snap token:', error);
            console.error('[PaymentService] Error response:', error.response?.data);
            console.error('[PaymentService] Error status:', error.response?.status);
            throw error;
        }
    },
};

export default paymentService;
