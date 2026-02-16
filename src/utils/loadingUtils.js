/**
 * Delays the resolution of a promise to ensure a minimum execution time.
 * Useful for preventing UI flicker during fast API calls.
 * 
 * @param {Promise} promise - The promise to execute
 * @param {number} ms - Minimum time to wait in milliseconds (default 600ms)
 * @returns {Promise} - The result of the original promise
 */
export const withMinDelay = async (promise, ms = 600) => {
    const [data] = await Promise.all([
        promise,
        new Promise(resolve => setTimeout(resolve, ms))
    ]);
    return data;
};

/**
 * Simple delay function
 * @param {number} ms 
 * @returns {Promise}
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
