import api from './api';

const reportService = {
    // ── OLD METHODS (Keep for specific raw calls if needed) ──
    getRevenue: async (period = 'monthly') => {
        const response = await api.get(`/reports/revenue?period=${period}`);
        return response.data;
    },

    getServicePerformance: async () => {
        const response = await api.get('/reports/services-performance');
        return response.data;
    },

    getOperationalStats: async () => {
        const response = await api.get('/reports/operational-stats');
        return response.data;
    },

    getInstructorPerformance: async () => {
        const response = await api.get('/reports/instructor-performance');
        return response.data;
    },

    getPeakHours: async () => {
        const response = await api.get('/reports/peak-hours');
        return response.data;
    },

    // ── NEW ABSTRACTION METHODS (Used by Dashboard) ──

    // 1. KPI Metrics (Occupancy, Users, Cancellation)
    getKpiMetrics: async () => {
        const response = await api.get('/reports/operational-stats');
        return response.data;
    },

    // 2. Total Revenue (Extract from revenue endpoint)
    getTotalRevenue: async () => {
        // We can just fetch monthly default to get the total sum
        const response = await api.get('/reports/revenue');
        return { totalRevenue: response.data.totalRevenue };
    },

    // 3. Revenue Trend Chart Data (Extract chartData)
    getRevenueTrend: async (period = 'monthly') => {
        const response = await api.get(`/reports/revenue?period=${period}`);
        return response.data.chartData || [];
    }
};

export default reportService;
