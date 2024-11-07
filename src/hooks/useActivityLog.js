import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';

export const useActivityLog = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchActivities = useCallback(async () => {
        try {
            setLoading(true);
            const data = await taskService.getActivities();
            setActivities(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch activities');
            console.error('Error fetching activities:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    const refreshActivities = useCallback(async () => {
        try {
            const data = await taskService.getActivities();
            setActivities(data);
            setError(null);
        } catch (err) {
            console.error('Error refreshing activities:', err);
            // Don't set error on refresh to avoid UI disruption
        }
    }, []);

    // Add a new activity
    const addActivity = useCallback(async (activity) => {
        try {
            const newActivity = await taskService.addActivity(activity);
            setActivities(prev => [newActivity, ...prev]);
            return newActivity;
        } catch (err) {
            console.error('Error adding activity:', err);
            throw err;
        }
    }, []);

    return {
        activities,
        loading,
        error,
        refreshActivities,
        addActivity
    };
};