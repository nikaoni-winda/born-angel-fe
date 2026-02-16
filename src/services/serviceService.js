import api from './api';

/**
 * Service Management API
 * Public: index, show
 * Admin: store, update, destroy
 */

const serviceService = {
  // Public - Get all services (paginated)
  getAll: async (params = {}) => {
    const response = await api.get('/services', { params });
    return response.data;
  },

  // Public - Get service by ID
  getById: async (id) => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  // Admin - Create service
  create: async (serviceData) => {
    const response = await api.post('/services', serviceData);
    return response.data;
  },

  // Admin - Update service
  update: async (id, serviceData) => {
    if (serviceData instanceof FormData) {
      serviceData.append('_method', 'PUT');
      const response = await api.post(`/services/${id}`, serviceData);
      return response.data;
    }

    const response = await api.put(`/services/${id}`, serviceData);
    return response.data;
  },

  // Admin - Delete service
  delete: async (id) => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },
};

export default serviceService;
