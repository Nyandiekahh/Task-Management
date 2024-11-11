// hooks/useTasks.js
import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';

export const useTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(null);
    const [isEmpty, setIsEmpty] = useState(false);

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const tasksData = await taskService.getTasks();
            setTasks(Array.isArray(tasksData) ? tasksData : []);
            setIsEmpty(!tasksData || tasksData.length === 0);
            setError(null);
        } catch (err) {
            setError(err.message);
            setIsEmpty(false);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchStats = useCallback(async () => {
        try {
            const statsData = await taskService.getTaskStats();
            setStats(statsData);
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    }, []);

    const createTask = async (taskData) => {
        try {
            const newTask = await taskService.createTask(taskData);
            setTasks(prev => Array.isArray(prev) ? [newTask, ...prev] : [newTask]);
            setIsEmpty(false);
            await fetchStats();
            return newTask;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const updateTaskStatus = async (taskId, status) => {
        try {
            const updatedTask = await taskService.updateTaskStatus(taskId, status);
            setTasks(prev => 
                Array.isArray(prev) 
                    ? prev.map(task => task.id === taskId ? updatedTask : task)
                    : []
            );
            await fetchStats();
            return updatedTask;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await taskService.deleteTask(taskId);
            setTasks(prev => {
                const updatedTasks = Array.isArray(prev) 
                    ? prev.filter(task => task.id !== taskId)
                    : [];
                setIsEmpty(updatedTasks.length === 0);
                return updatedTasks;
            });
            await fetchStats();
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchStats();
    }, [fetchTasks, fetchStats]);

    return {
        tasks,
        stats,
        loading,
        error,
        isEmpty,
        createTask,
        updateTaskStatus,
        deleteTask,
        refreshTasks: fetchTasks,
        refreshStats: fetchStats,
        hasActiveTasks: Array.isArray(tasks) && tasks.length > 0
    };
};

export default useTasks;