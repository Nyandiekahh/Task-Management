// services/taskService.js
import { apiService } from './api';

export const taskService = {
    getTasks: async () => {
        try {
            const response = await apiService.getTasks();
            console.log('API Response:', response);
            
            // Ensure we return an array
            const tasks = response?.results || response;
            return Array.isArray(tasks) ? tasks : [];
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw new Error('Failed to fetch tasks');
        }
    },

    getTaskById: async (taskId) => {
        try {
            const data = await apiService.getTask(taskId);
            return data;
        } catch (error) {
            console.error('Error fetching task:', error);
            throw new Error('Failed to fetch task');
        }
    },

    createTask: async (taskData) => {
        try {
            const data = await apiService.createTask(taskData);
            return data;
        } catch (error) {
            console.error('Error creating task:', error);
            throw new Error('Failed to create task');
        }
    },

    updateTaskStatus: async (taskId, status) => {
        try {
            const data = await apiService.updateTask(taskId, { status });
            return data;
        } catch (error) {
            console.error('Error updating task status:', error);
            throw new Error('Failed to update task status');
        }
    },

    getTaskStats: async () => {
        try {
            const data = await apiService.getTaskStats();
            return data;
        } catch (error) {
            console.error('Error fetching task stats:', error);
            throw new Error('Failed to fetch task statistics');
        }
    },

    deleteTask: async (taskId) => {
        try {
            await apiService.deleteTask(taskId);
            return true;
        } catch (error) {
            console.error('Error deleting task:', error);
            throw new Error('Failed to delete task');
        }
    },

    assignTask: async (taskId, userData) => {
        try {
            const data = await apiService.assignTask(taskId, userData);
            return data;
        } catch (error) {
            console.error('Error assigning task:', error);
            throw new Error('Failed to assign task');
        }
    }
};

export default taskService;