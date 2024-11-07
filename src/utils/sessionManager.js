const SESSION_DURATION = 3600000; // 1 hour in milliseconds
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';
const SESSION_EXPIRY_KEY = 'session_expiry';

export const sessionManager = {
    // Initialize session
    initSession: (userData, token) => {
        const expiryTime = new Date().getTime() + SESSION_DURATION;
        localStorage.setItem(TOKEN_KEY, token);
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
                expiryTime: localStorage.getItem(SESSION_EXPIRY_KEY)
            };
        } catch (error) {
            console.error('Error parsing session data:', error);
            sessionManager.clearSession();
            return null;
        }
    },

    // Extend session
    extendSession: () => {
        const userData = localStorage.getItem(USER_KEY);
        const token = localStorage.getItem(TOKEN_KEY);
        
        if (userData && token) {
            const expiryTime = new Date().getTime() + SESSION_DURATION;
            localStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toString());
            return true;
        }
        return false;
    },

    // Clear session
    clearSession: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(SESSION_EXPIRY_KEY);
    },

    // Setup session expiry timeout
    setupExpiryTimeout: () => {
        const expiryTime = localStorage.getItem(SESSION_EXPIRY_KEY);
        if (!expiryTime) return;

        const currentTime = new Date().getTime();
        const timeUntilExpiry = parseInt(expiryTime) - currentTime;

        if (timeUntilExpiry > 0) {
            setTimeout(() => {
                if (!sessionManager.extendSession()) {
                    sessionManager.clearSession();
                    window.location.reload(); // Force reload to clear application state
                }
            }, timeUntilExpiry);
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
    }
};