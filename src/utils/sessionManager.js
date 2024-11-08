// src/utils/sessionManager.js

const SESSION_DURATION = 3600000; // 1 hour in milliseconds
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';
const SESSION_EXPIRY_KEY = 'session_expiry';

export const sessionManager = {
    // Initialize session
    initSession: (userData, token, refreshToken) => {
        const expiryTime = new Date().getTime() + SESSION_DURATION;
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
        localStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toString());
        
        // Set up expiry timeout
        sessionManager.setupExpiryTimeout();
    },

    // Check if session is valid
    isSessionValid: () => {
        const expiryTime = localStorage.getItem(SESSION_EXPIRY_KEY);
        if (!expiryTime) return false;

        const currentTime = new Date().getTime();
        return currentTime < parseInt(expiryTime);
    },

    // Get current session data
    getSessionData: () => {
        if (!sessionManager.isSessionValid()) {
            sessionManager.clearSession();
            return null;
        }

        try {
            return {
                user: JSON.parse(localStorage.getItem(USER_KEY)),
                token: localStorage.getItem(TOKEN_KEY),
                refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
                expiryTime: localStorage.getItem(SESSION_EXPIRY_KEY)
            };
        } catch (error) {
            console.error('Error parsing session data:', error);
            sessionManager.clearSession();
            return null;
        }
    },

    // Extend session
    extendSession: (newToken) => {
        const userData = localStorage.getItem(USER_KEY);
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        
        if (userData && refreshToken) {
            const expiryTime = new Date().getTime() + SESSION_DURATION;
            localStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toString());
            if (newToken) {
                localStorage.setItem(TOKEN_KEY, newToken);
            }
            return true;
        }
        return false;
    },

    // Update token
    updateToken: (newToken) => {
        localStorage.setItem(TOKEN_KEY, newToken);
        sessionManager.extendSession();
    },

    // Clear session
    clearSession: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(SESSION_EXPIRY_KEY);
    },

    // Get tokens
    getAccessToken: () => localStorage.getItem(TOKEN_KEY),
    getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),

    // Setup session expiry timeout
    setupExpiryTimeout: () => {
        const expiryTime = localStorage.getItem(SESSION_EXPIRY_KEY);
        if (!expiryTime) return;

        const currentTime = new Date().getTime();
        const timeUntilExpiry = parseInt(expiryTime) - currentTime;

        if (timeUntilExpiry > 0) {
            setTimeout(async () => {
                try {
                    // Try to refresh the token before session expires
                    const response = await fetch('http://localhost:8000/api/auth/token/refresh/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ 
                            refresh: sessionManager.getRefreshToken() 
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        sessionManager.updateToken(data.access);
                    } else {
                        sessionManager.clearSession();
                        window.location.reload();
                    }
                } catch (error) {
                    console.error('Token refresh failed:', error);
                    sessionManager.clearSession();
                    window.location.reload();
                }
            }, timeUntilExpiry - 60000); // Refresh 1 minute before expiry
        }
    },

    // Check if user is inactive
    setupInactivityCheck: () => {
        let inactivityTimeout;
        const INACTIVITY_LIMIT = 1800000; // 30 minutes

        const resetInactivityTimer = () => {
            clearTimeout(inactivityTimeout);
            inactivityTimeout = setTimeout(() => {
                sessionManager.clearSession();
                window.location.reload();
            }, INACTIVITY_LIMIT);
        };

        // Reset timer on user activity
        ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(event => {
            document.addEventListener(event, resetInactivityTimer);
        });

        resetInactivityTimer();
    },

    // Get authorization header
    getAuthHeader: () => {
        const token = localStorage.getItem(TOKEN_KEY);
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
};