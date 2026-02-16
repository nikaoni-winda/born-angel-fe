// Helper utility functions

/**
 * Format currency to Indonesian Rupiah
 * @param {number} amount
 * @returns {string}
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
};

/**
 * Format date to Indonesian locale
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    });
};

/**
 * Format time to HH:MM
 * @param {string|Date} datetime
 * @returns {string}
 */
export const formatTime = (datetime) => {
    return new Date(datetime).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
    });
};

/**
 * Format datetime to readable string
 * @param {string|Date} datetime
 * @returns {string}
 */
export const formatDateTime = (datetime) => {
    return new Date(datetime).toLocaleString('id-ID', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC',
    });
};

/**
 * Calculate duration in hours and minutes
 * @param {number} minutes
 * @returns {string}
 */
export const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins} menit`;
    if (mins === 0) return `${hours} jam`;
    return `${hours} jam ${mins} menit`;
};

/**
 * Check if user has specific role
 * @param {string} userRole
 * @param {string|string[]} allowedRoles
 * @returns {boolean}
 */
export const hasRole = (userRole, allowedRoles) => {
    if (Array.isArray(allowedRoles)) {
        return allowedRoles.includes(userRole);
    }
    return userRole === allowedRoles;
};

/**
 * Check if user is admin or super admin
 * @param {string} role
 * @returns {boolean}
 */
export const isAdmin = (role) => {
    return role === 'admin' || role === 'super_admin';
};

/**
 * Get status badge color
 * @param {string} status
 * @returns {string}
 */
export const getStatusColor = (status) => {
    const colors = {
        // Booking statuses
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
        // Payment statuses (simplified)
        paid: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
};

/**
 * Map Midtrans transaction status to simplified payment status
 * @param {string} transactionStatus - Midtrans transaction_status
 * @returns {string} - Simplified status (pending, paid, failed)
 */
export const getPaymentStatus = (transactionStatus) => {
    const statusMap = {
        pending: 'pending',
        capture: 'paid',
        settlement: 'paid',
        deny: 'failed',
        expire: 'failed',
        cancel: 'failed',
    };
    return statusMap[transactionStatus] || 'pending';
};

/**
 * Truncate text to specified length
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate phone number (Indonesian format)
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
    return phoneRegex.test(phone);
};

/**
 * Get initials from name
 * @param {string} name
 * @returns {string}
 */
export const getInitials = (name) => {
    if (!name) return '';
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

/**
 * Debounce function
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
export const debounce = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Get bilingual field value based on current language
 * @param {Object} data - Object with _id and _en fields
 * @param {string} fieldName - Field name without suffix (e.g., 'description', 'bio')
 * @param {string} currentLang - Current language ('id' or 'en')
 * @returns {string}
 */
export const getBilingualField = (data, fieldName, currentLang) => {
    const idField = `${fieldName}_id`;
    const enField = `${fieldName}_en`;

    return currentLang === 'id' ? data[idField] : data[enField];
};
