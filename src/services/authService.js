import api from './api';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Authentication Service
 * Handles login, register, logout, and token management
 */

const authService = {
    /**
     * Register new user
     * @param {Object} userData - { name, email, password, phone_number }
     * @returns {Promise}
     */
    register: async (userData) => {
        const response = await api.post('/register', userData);
        return response.data;
    },

    /**
     * Login user
     * @param {Object} credentials - { email, password }
     * @returns {Promise}
     */
    login: async (credentials) => {
        const response = await api.post('/login', credentials);
        const { access_token, user } = response.data;

        // Store token and user data
        localStorage.setItem(STORAGE_KEYS.TOKEN, access_token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

        return response.data;
    },

    /**
     * Logout user
     * @returns {Promise}
     */
    logout: async () => {
        try {
            await api.post('/logout');
        } finally {
            // Clear local storage even if API call fails
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
        }
    },

    /**
     * Get current user from localStorage
     * @returns {Object|null}
     */
    getCurrentUser: () => {
        try {
            const userStr = localStorage.getItem(STORAGE_KEYS.USER);
            return userStr ? JSON.parse(userStr) : null;
        } catch (error) {
            console.error("Error parsing user data", error);
            localStorage.removeItem(STORAGE_KEYS.USER);
            return null;
        }
    },

    /**
     * Get current token
     * @returns {string|null}
     */
    getToken: () => {
        return localStorage.getItem(STORAGE_KEYS.TOKEN);
    },

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated: () => {
        return !!localStorage.getItem(STORAGE_KEYS.TOKEN);
    },

    /**
     * Get user profile
     * @returns {Promise}
     */
    getProfile: async () => {
        const response = await api.get('/profile');
        // Update stored user data
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data));
        return response.data;
    },

    /**
     * Update user profile
     * @param {Object} profileData - { name, phone_number }
     * @returns {Promise}
     */
    updateProfile: async (profileData) => {
        const response = await api.put('/profile', profileData);
        // Update stored user data
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data));
        return response.data;
    },

    /**
     * Delete own account
     * @returns {Promise}
     */
    deleteAccount: async () => {
        const response = await api.delete('/profile');
        // Clear local storage
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        return response.data;
    },
};

export default authService;
