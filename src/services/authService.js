// src/services/authService.js

const API_URL = 'http://localhost:8000/api';

export const authService = {
    login: async (credentials) => {
        try {
            const response = await fetch(`${API_URL}/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Invalid credentials');
            }

            const data = await response.json();
            return {
                userData: data.userData,
                token: data.token,
                refresh: data.refresh
            };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    logout: async () => {
        // No need to call backend for logout with JWT
        // Just clear local storage in sessionManager
    },

    getUserDetails: async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/auth/users/${userId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user details');
            }

            return await response.json();
        } catch (error) {
            console.error('Get user details error:', error);
            throw error;
        }
    },

    verifyToken: async (token) => {
        if (!token) return false;
        
        try {
            // Simple JWT expiration check
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    },

    refreshToken: async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await fetch(`${API_URL}/auth/token/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: refreshToken })
            });

            if (!response.ok) {
                throw new Error('Unable to refresh token');
            }

            const data = await response.json();
            localStorage.setItem('token', data.access);
            return data.access;
        } catch (error) {
            console.error('Token refresh error:', error);
            throw error;
        }
    },

    getAuthHeader: () => {
        const token = localStorage.getItem('token');
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
};