import React, { useState, useEffect } from 'react';
import { useActivityLog } from '../../hooks/useActivityLog';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/common/Loading'; // Fixed import path
import '../../styles/components/dashboard.css';


function ActivityLog() {
    const { activities, loading, error, refreshActivities } = useActivityLog();
    const { user } = useAuth();
    const [filter, setFilter] = useState('all');
    const [displayCount, setDisplayCount] = useState(10);

    useEffect(() => {
        const interval = setInterval(refreshActivities, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, [refreshActivities]);

    const getActivityIcon = (type) => {
        switch (type) {
            case 'task_created':
                return '📝';
            case 'task_assigned':
                return '👤';
            case 'task_updated':
                return '✏️';
            case 'task_completed':
                return '✅';
            case 'task_delegated':
                return '🔄';
            case 'comment_added':
                return '💬';
            default:
                return '📌';
        }
    };

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const activityTime = new Date(timestamp);
        const diffInSeconds = Math.floor((now - activityTime) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return activityTime.toLocaleDateString();
    };

    const filteredActivities = activities.filter(activity => {
        if (filter === 'all') return true;
        if (filter === 'mine') {
            return activity.user === user.username || activity.target === user.username;
        }
        return activity.type === filter;
    });

    if (loading) {
        return <Loading message="Loading activities..." />;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="activity-container">
            <div className="activity-header">
                <h3 className="section-title">Activity Log</h3>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="activity-filter"
                >
                    <option value="all">All Activities</option>
                    <option value="mine">My Activities</option>
                    <option value="task_created">Task Created</option>
                    <option value="task_assigned">Task Assigned</option>
                    <option value="task_updated">Task Updated</option>
                    <option value="task_completed">Task Completed</option>
                    <option value="task_delegated">Task Delegated</option>
                    <option value="comment_added">Comments</option>
                </select>
            </div>

            <div className="activity-list">
                {filteredActivities.length === 0 ? (
                    <div className="no-activities">
                        <p>No activities found</p>
                    </div>
                ) : (
                    <>
                        {filteredActivities.slice(0, displayCount).map((activity) => (
                            <div key={activity.id} className="activity-item">
                                <div className="activity-icon">
                                    {getActivityIcon(activity.type)}
                                </div>
                                <div className="activity-content">
                                    <div className="activity-message">
                                        <strong>{activity.user}</strong>
                                        {' '}{activity.action}{' '}
                                        {activity.target && <strong>{activity.target}</strong>}
                                        {activity.taskTitle && (
                                            <span className="activity-task">
                                                : "{activity.taskTitle}"
                                            </span>
                                        )}
                                    </div>
                                    <div className="activity-meta">
                                        <span className="activity-time">
                                            {formatTimeAgo(activity.timestamp)}
                                        </span>
                                        {activity.details && (
                                            <span className="activity-details">
                                                {activity.details}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredActivities.length > displayCount && (
                            <button
                                className="load-more-button"
                                onClick={() => setDisplayCount(prev => prev + 10)}
                            >
                                Load More
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default ActivityLog;