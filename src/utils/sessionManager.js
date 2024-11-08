const SESSION_DURATION = 3600000; // 1 hour in milliseconds
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';
const SESSION_EXPIRY_KEY = 'session_expiry';

export const sessionManager = {
    initSession: (userData, token, refreshToken) => {
        if (!userData || !token || !refreshToken) {
            console.error('Missing required session data');
            return;
        }

        try {
            const expiryTime = new Date().getTime() + SESSION_DURATION;
            
            // Store user data
            localStorage.setItem(USER_KEY, JSON.stringify(userData));
            
            // Store tokens
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
            
            // Store expiry
            localStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toString());
            
            // Set up expiry timeout
            sessionManager.setupExpiryTimeout();
        } catch (error) {
            console.error('Error initializing session:', error);
            sessionManager.clearSession();
        }
    },

    isSessionValid: () => {
        const token = localStorage.getItem(TOKEN_KEY);
        const user = localStorage.getItem(USER_KEY);
        const expiryTime = localStorage.getItem(SESSION_EXPIRY_KEY);

        if (!token || !user || !expiryTime) {
            return false;
        }

        const currentTime = new Date().getTime();
        return currentTime < parseInt(expiryTime);
    },

    getSessionData: () => {
        try {
            if (!sessionManager.isSessionValid()) {
                sessionManager.clearSession();
                return null;
            }

            const userStr = localStorage.getItem(USER_KEY);
            const token = localStorage.getItem(TOKEN_KEY);
            const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

            if (!userStr || !token || !refreshToken) {
                return null;
            }

            return {
                user: JSON.parse(userStr),
                token,
                refreshToken,
                expiryTime: localStorage.getItem(SESSION_EXPIRY_KEY)
            };
        } catch (error) {
            console.error('Error getting session data:', error);
            sessionManager.clearSession();
            return null;
        }
    },

    clearSession: () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(SESSION_EXPIRY_KEY);
    },

    setupExpiryTimeout: () => {
        const expiryTime = localStorage.getItem(SESSION_EXPIRY_KEY);
        if (!expiryTime) return;

        const currentTime = new Date().getTime();
        const timeUntilExpiry = parseInt(expiryTime) - currentTime;

        if (timeUntilExpiry > 0) {
            setTimeout(() => {
                if (!sessionManager.isSessionValid()) {
                    sessionManager.clearSession();
                    window.location.reload();
                }
            }, timeUntilExpiry);
        }
    },

    getAuthHeader: () => {
        const token = localStorage.getItem(TOKEN_KEY);
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
};