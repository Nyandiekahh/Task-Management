const API_URL = 'http://localhost:8000/api';

class AuthService {
    async login(credentials) {
        try {
            console.log('Sending login request with:', credentials);
            
            const response = await fetch(`${API_URL}/auth/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });
    
            console.log('Login response status:', response.status);
            const data = await response.json();
            console.log('Login response data:', data);
    
            if (!response.ok) {
                throw new Error(data.error || 'Invalid credentials');
            }
    
            this.setTokens(data.token, data.refresh);
            // Return the complete response data
            return {
                userData: data.userData,
                token: data.token,
                refresh: data.refresh
            };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async verifyOTP(email, otp, password) {
        try {
            const response = await fetch(`${API_URL}/auth/users/verify-otp/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'OTP verification failed');
            }

            return await response.json();
        } catch (error) {
            console.error('OTP verification error:', error);
            throw error;
        }
    }

    async logout() {
        this.clearTokens();
    }

    async refreshToken() {
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
            this.setTokens(data.access, refreshToken);
            return data.access;
        } catch (error) {
            console.error('Token refresh error:', error);
            this.clearTokens();
            throw error;
        }
    }

    async verifyToken(token) {
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    }

    setTokens(accessToken, refreshToken) {
        if (accessToken) localStorage.setItem('token', accessToken);
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
    }

    clearTokens() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    }

    getToken() {
        return localStorage.getItem('token');
    }

    getRefreshToken() {
        return localStorage.getItem('refreshToken');
    }

    isAuthenticated() {
        const token = this.getToken();
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    }

    getAuthHeader() {
        const token = this.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
}

export const authService = new AuthService();