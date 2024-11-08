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
        const checkAuth = async () => {
            try {
                const sessionData = sessionManager.getSessionData();
                if (sessionData && sessionData.token) {
                    const isValid = await authService.verifyToken(sessionData.token);
                    if (isValid && sessionData.user) {
                        setUser(sessionData.user);
                        if (window.location.pathname === '/login') {
                            handleRedirect(sessionData.user);
                        }
                    } else {
                        try {
                            await authService.refreshToken();
                            if (sessionData.user) {
                                setUser(sessionData.user);
                            }
                        } catch (error) {
                            console.error('Token refresh failed:', error);
                            await logout();
                        }
                    }
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                await logout();
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [navigate]);

    const handleRedirect = (userData) => {
        if (!userData) {
            console.error('No user data available for redirect');
            return;
        }

        console.log('Redirecting user with role:', userData.role);
        
        switch (userData.role) {
            case 'admin':
                navigate('/admin');
                break;
            case 'manager':
                navigate('/dashboard');
                break;
            case 'user':
                navigate('/tasks');
                break;
            default:
                navigate('/');
                break;
        }
    };

    const login = async (credentials) => {
        try {
            setLoading(true);
            const response = await authService.login(credentials);
            
            if (!response || !response.userData || !response.token) {
                throw new Error('Invalid response data');
            }

            // Initialize session with response data
            sessionManager.initSession(response.userData, response.token, response.refresh);
            
            // Update local state
            setUser(response.userData);
            
            // Handle redirect
            handleRedirect(response.userData);
            
            return response.userData;
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
            // Clear session anyway
            sessionManager.clearSession();
            setUser(null);
            navigate('/login', { replace: true });
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
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