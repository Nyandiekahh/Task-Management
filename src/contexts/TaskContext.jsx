import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';
import { useAuth } from './AuthContext';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    const fetchTasks = useCallback(async () => {
        if (!user) return;
        
        try {
            setLoading(true);
            const data = await taskService.getTasks();
            setTasks(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch tasks');
            console.error('Error fetching tasks:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchTasks();
        const interval = setInterval(fetchTasks, 30000);
        return () => clearInterval(interval);
    }, [fetchTasks]);

    const createTask = async (taskData) => {
        try {
            const newTask = await taskService.createTask(taskData);
            setTasks(prev => [...prev, newTask]);
            return newTask;
        } catch (err) {
            throw new Error('Failed to create task');
        }
    };

    const updateTaskStatus = async (taskId, status) => {
        try {
            const updatedTask = await taskService.updateTaskStatus(taskId, status);
            setTasks(prev => prev.map(task => 
                task.id === taskId ? updatedTask : task
            ));
            return updatedTask;
        } catch (err) {
            throw new Error('Failed to update task');
        }
    };

    const value = {
        tasks,
        loading,
        error,
        createTask,
        updateTaskStatus,
        refreshTasks: fetchTasks
    };

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
};