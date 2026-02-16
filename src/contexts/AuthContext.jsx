import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import { ROLES, STORAGE_KEYS } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = () => {
            try {
                const currentUser = authService.getCurrentUser();
                console.log("Auth Init: Current User", currentUser);
                if (currentUser) {
                    setUser(currentUser);
                }
            } catch (error) {
                console.error("Auth Init Error", error);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // Listen for force-logout event from API interceptor
    useEffect(() => {
        const handleForceLogout = () => {
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            setUser(null);
            window.location.href = '/login';
        };

        window.addEventListener('auth:force-logout', handleForceLogout);
        return () => window.removeEventListener('auth:force-logout', handleForceLogout);
    }, []);

    // Login function
    const login = async (credentials) => {
        const data = await authService.login(credentials);
        setUser(data.user);
        return data;
    };

    // Register function
    const register = async (userData) => {
        const data = await authService.register(userData);
        return data;
    };

    // Logout function
    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    // Delete account function (user only)
    const deleteAccount = async () => {
        await authService.deleteAccount();
        setUser(null);
    };

    // Update profile function
    const updateProfile = async (profileData) => {
        const updatedUser = await authService.updateProfile(profileData);
        setUser(updatedUser);
        return updatedUser;
    };

    // Check if user is authenticated
    const isAuthenticated = () => {
        return !!user && authService.isAuthenticated();
    };

    // Check if user has specific role
    const hasRole = (allowedRoles) => {
        if (!user) return false;
        if (Array.isArray(allowedRoles)) {
            return allowedRoles.includes(user.role);
        }
        return user.role === allowedRoles;
    };

    // Check if user is admin or super admin
    const isAdmin = () => {
        return user && (user.role === ROLES.ADMIN || user.role === ROLES.SUPER_ADMIN);
    };

    // Check if user is super admin
    const isSuperAdmin = () => {
        return user && user.role === ROLES.SUPER_ADMIN;
    };

    // Check if user is instructor
    const isInstructor = () => {
        return user && user.role === ROLES.INSTRUCTOR;
    };

    // Check if user is regular user/customer
    const isUser = () => {
        return user && user.role === ROLES.USER;
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        deleteAccount,
        updateProfile,
        isAuthenticated,
        hasRole,
        isAdmin,
        isSuperAdmin,
        isInstructor,
        isUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
