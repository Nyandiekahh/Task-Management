// src/contexts/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { sessionManager } from '../utils/sessionManager';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check for existing session on mount
        const checkAuth = async () => {
            try {
                const sessionData = sessionManager.getSessionData();
                if (sessionData && sessionData.token) {
                    // Verify token validity
                    const isValid = await authService.verifyToken(sessionData.token);
                    if (isValid) {
                        setUser(sessionData.user);
                    } else {
                        // Try to refresh the token
                        try {
                            await authService.refreshToken();
                            setUser(sessionData.user);
                        } catch (error) {
                            console.error('Token refresh failed:', error);
                            sessionManager.clearSession();
                        }
                    }
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                sessionManager.clearSession();
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            setLoading(true);
            const { userData, token, refresh } = await authService.login(credentials);
            
            // Initialize session with both tokens
            sessionManager.initSession(userData, token, refresh);
            setUser(userData);
            
            return userData;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            sessionManager.clearSession();
            setUser(null);
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const updateUserData = (newUserData) => {
        setUser(newUserData);
        const sessionData = sessionManager.getSessionData();
        if (sessionData) {
            sessionManager.initSession(newUserData, sessionData.token, sessionData.refreshToken);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            updateUserData,
            isAuthenticated: !!user
        }}>
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

export default AuthContext;