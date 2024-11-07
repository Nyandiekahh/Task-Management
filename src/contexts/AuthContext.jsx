import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { sessionManager } from '../utils/sessionManager';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Move logUserActivity into useCallback to prevent infinite loops
    const logUserActivity = useCallback(async (action) => {
        if (!user?.id) return; // Don't log if no user
        try {
            await authService.logUserActivity({
                userId: user.id,
                action,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Failed to log user activity:', error);
        }
    }, [user?.id]); // Depend only on user ID

    const handleSessionExpiry = useCallback(() => {
        sessionManager.clearSession();
        setUser(null);
        logUserActivity('session_expired');
        navigate('/login?expired=true');
    }, [navigate, logUserActivity]);

    const checkAuth = useCallback(async () => {
        try {
            const sessionData = sessionManager.getSessionData();
            if (sessionData && sessionData.user) {
                const userDetails = await authService.getUserDetails(sessionData.user.id);
                setUser({ ...sessionData.user, ...userDetails });
                logUserActivity('session_resumed');
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [logUserActivity]);

    useEffect(() => {
        checkAuth();
        sessionManager.setupInactivityCheck();

        // Set up online/offline detection
        const handleOnline = () => {
            if (user) {
                logUserActivity('user_online');
            }
        };

        const handleOffline = () => {
            if (user) {
                logUserActivity('user_offline');
            }
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [user, checkAuth, logUserActivity]);

    const login = async (credentials) => {
        try {
            setLoading(true);
            const { userData, token } = await authService.login(credentials);
            const userDetails = await authService.getUserDetails(userData.id);
            const userWithDetails = { ...userData, ...userDetails };
            
            // Initialize session
            sessionManager.initSession(userWithDetails, token);
            setUser(userWithDetails);
            
            // Log login activity
            await logUserActivity('user_login');
            
            return userWithDetails;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            if (user) {
                await logUserActivity('user_logout');
            }
            await authService.logout();
            sessionManager.clearSession();
            setUser(null);
            navigate('/login');
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const hasPermission = useCallback((permission) => {
        if (!user) return false;
        if (user.role === 'admin') return true;
        return user.permissions?.includes(permission) ?? false;
    }, [user]);

    // Check session validity periodically
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!sessionManager.isSessionValid()) {
                handleSessionExpiry();
            }
        }, 60000); // Check every minute

        return () => clearInterval(intervalId);
    }, [handleSessionExpiry]);

    // Track user activity
    useEffect(() => {
        if (!user) return;

        const updateLastActive = () => {
            sessionManager.extendSession();
            logUserActivity('user_active');
        };

        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        events.forEach(event => {
            window.addEventListener(event, updateLastActive);
        });

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, updateLastActive);
            });
        };
    }, [user, logUserActivity]);

    const contextValue = {
        user,
        loading,
        error,
        login,
        logout,
        hasPermission,
        checkAuth
    };

    if (loading) {
        return <div>Loading...</div>; // Or a proper loading component
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};