// src/services/api.js

import { authService } from './authService';

const API_URL = 'http://localhost:8000/api';

class ApiService {
    constructor() {
        this.baseURL = API_URL;
    }

    async request(endpoint, options = {}) {
        try {
            const headers = {
                'Content-Type': 'application/json',
                ...authService.getAuthHeader(),
                ...options.headers,
            };

            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...options,
                headers,
            });

            // Handle 401 Unauthorized
            if (response.status === 401) {
                try {
                    // Try to refresh the token
                    const newToken = await authService.refreshToken();
                    
                    // Retry the request with new token
                    headers.Authorization = `Bearer ${newToken}`;
                    const retryResponse = await fetch(`${this.baseURL}${endpoint}`, {
                        ...options,
                        headers,
                    });
                    
                    return await this.handleResponse(retryResponse);
                } catch (error) {
                    // If refresh fails, logout and redirect to login
                    await authService.logout();
                    window.location.href = '/login';
                    throw new Error('Session expired');
                }
            }

            return await this.handleResponse(response);
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    async handleResponse(response) {
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'API request failed');
        }
        
        return data;
    }

    // Users
    async getUsers() {
        return this.request('/users/');
    }

    async updateUser(userId, userData) {
        return this.request(`/users/${userId}/`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    }

    // Tasks
    async getTasks() {
        return this.request('/tasks/');
    }

    async getTask(taskId) {
        return this.request(`/tasks/${taskId}/`);
    }

    async createTask(taskData) {
        return this.request('/tasks/', {
            method: 'POST',
            body: JSON.stringify(taskData),
        });
    }

    async updateTask(taskId, taskData) {
        return this.request(`/tasks/${taskId}/`, {
            method: 'PUT',
            body: JSON.stringify(taskData),
        });
    }

    async deleteTask(taskId) {
        return this.request(`/tasks/${taskId}/`, {
            method: 'DELETE',
        });
    }

    // Task Assignments
    async assignTask(taskId, userData) {
        return this.request(`/tasks/${taskId}/assign/`, {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    // Reports
    async getTaskStats() {
        return this.request('/tasks/stats/');
    }

    async getUserStats() {
        return this.request('/users/stats/');
    }

    // Activity Log
    async getActivityLog() {
        return this.request('/activity-log/');
    }

    // Notifications
    async getNotifications() {
        return this.request('/notifications/');
    }

    async markNotificationRead(notificationId) {
        return this.request(`/notifications/${notificationId}/read/`, {
            method: 'POST',
        });
    }
}

export const apiService = new ApiService();