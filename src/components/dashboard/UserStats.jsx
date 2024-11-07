import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { taskService } from '../../services/taskService';
import Loading from '../common/Loading';
import './Dashboard.css';

function UserStats() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        highPriority: 0,
        mediumPriority: 0,
        lowPriority: 0,
        overdue: 0,
        completionRate: 0,
        averageCompletionTime: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeframe, setTimeframe] = useState('week');
    const [showTrends, setShowTrends] = useState(false);

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            const taskStats = await taskService.getTaskStats(user.id, timeframe);
            setStats(taskStats);
            setError(null);
        } catch (err) {
            setError('Failed to fetch statistics');
            console.error('Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    }, [timeframe, user.id]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const calculatePercentage = (value) => {
        return stats.total ? ((value / stats.total) * 100).toFixed(1) : 0;
    };

    if (loading) return <Loading />;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="stats-container">
            <div className="stats-header">
                <h3>Task Performance</h3>
                <div className="stats-controls">
                    <select 
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="timeframe-select"
                    >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="quarter">This Quarter</option>
                        <option value="year">This Year</option>
                    </select>
                    <button 
                        className={`trend-toggle ${showTrends ? 'active' : ''}`}
                        onClick={() => setShowTrends(!showTrends)}
                    >
                        {showTrends ? 'Hide Trends' : 'Show Trends'}
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-item">
                    <span className="stat-label">Total Tasks</span>
                    <span className="stat-value">{stats.total}</span>
                    {showTrends && (
                        <span className="stat-trend increase">
                            +12% ↑
                        </span>
                    )}
                </div>

                <div className="stat-item">
                    <span className="stat-label">Completed</span>
                    <span className="stat-value success">
                        {stats.completed}
                        <small className="stat-percentage">
                            ({calculatePercentage(stats.completed)}%)
                        </small>
                    </span>
                    {showTrends && (
                        <span className="stat-trend increase">
                            +8% ↑
                        </span>
                    )}
                </div>

                <div className="stat-item">
                    <span className="stat-label">In Progress</span>
                    <span className="stat-value warning">
                        {stats.inProgress}
                        <small className="stat-percentage">
                            ({calculatePercentage(stats.inProgress)}%)
                        </small>
                    </span>
                </div>

                <div className="stat-item">
                    <span className="stat-label">Pending</span>
                    <span className="stat-value info">
                        {stats.pending}
                        <small className="stat-percentage">
                            ({calculatePercentage(stats.pending)}%)
                        </small>
                    </span>
                </div>
            </div>

            <div className="priority-stats">
                <h4>Priority Distribution</h4>
                <div className="priority-bars">
                    <div className="priority-bar">
                        <div className="bar-label">
                            High
                            <span className="bar-count">{stats.highPriority}</span>
                        </div>
                        <div className="bar-container">
                            <div 
                                className="bar high"
                                style={{ width: `${calculatePercentage(stats.highPriority)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="priority-bar">
                        <div className="bar-label">
                            Medium
                            <span className="bar-count">{stats.mediumPriority}</span>
                        </div>
                        <div className="bar-container">
                            <div 
                                className="bar medium"
                                style={{ width: `${calculatePercentage(stats.mediumPriority)}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="priority-bar">
                        <div className="bar-label">
                            Low
                            <span className="bar-count">{stats.lowPriority}</span>
                        </div>
                        <div className="bar-container">
                            <div 
                                className="bar low"
                                style={{ width: `${calculatePercentage(stats.lowPriority)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="performance-metrics">
                <div className="metric">
                    <span className="metric-label">Completion Rate</span>
                    <span className="metric-value">
                        {stats.completionRate}%
                        {showTrends && (
                            <span className="metric-trend increase">+5%</span>
                        )}
                    </span>
                </div>
                <div className="metric">
                    <span className="metric-label">Average Completion Time</span>
                    <span className="metric-value">
                        {stats.averageCompletionTime} days
                        {showTrends && (
                            <span className="metric-trend decrease">-1.2</span>
                        )}
                    </span>
                </div>
                <div className="metric">
                    <span className="metric-label">Overdue Tasks</span>
                    <span className="metric-value">
                        {stats.overdue}
                        {showTrends && (
                            <span className="metric-trend increase">+2</span>
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default UserStats;