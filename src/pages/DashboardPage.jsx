import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserStats from '../components/dashboard/UserStats';
import OnlineUsers from '../components/dashboard/OnlineUsers';
import TaskList from '../components/dashboard/TaskList';
import ActivityLog from '../components/dashboard/ActivityLog';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/common/Modal';
import { FiPlus, FiSearch, FiFilter, FiGrid, FiList, FiCalendar } from 'react-icons/fi';
import { taskService } from '../services/taskService';

function DashboardPage() {
    const [showAddTask, setShowAddTask] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        in_progress: 0,
        completed: 0,
        high_priority: 0,
        medium_priority: 0,
        low_priority: 0,
        overdue: 0
    });
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // Fetch task statistics
    const fetchStats = async () => {
        try {
            setLoading(true);
            const taskStats = await taskService.getTaskStats();
            setStats(taskStats);
        } catch (error) {
            console.error('Error fetching task stats:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch stats on component mount and after task creation/update
    useEffect(() => {
        fetchStats();
        // Refresh stats every 5 minutes
        const interval = setInterval(fetchStats, 300000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="dashboard">
            {/* Quick Stats Section */}
            <div className="stats-container">
                <div className="stats-grid">
                    <div className="stat-item">
                        <div className="stat-icon pending">
                            {loading ? '...' : stats.pending}
                        </div>
                        <span className="stat-label">Pending Tasks</span>
                        <span className="stat-value warning">
                            {loading ? '...' : stats.pending}
                        </span>
                    </div>
                    <div className="stat-item">
                        <div className="stat-icon progress">
                            {loading ? '...' : stats.in_progress}
                        </div>
                        <span className="stat-label">In Progress</span>
                        <span className="stat-value info">
                            {loading ? '...' : stats.in_progress}
                        </span>
                    </div>
                    <div className="stat-item">
                        <div className="stat-icon completed">
                            {loading ? '...' : stats.completed}
                        </div>
                        <span className="stat-label">Completed</span>
                        <span className="stat-value success">
                            {loading ? '...' : stats.completed}
                        </span>
                    </div>
                    <div className="stat-item">
                        <div className="stat-icon total">
                            {loading ? '...' : stats.total}
                        </div>
                        <span className="stat-label">Total Tasks</span>
                        <span className="stat-value">
                            {loading ? '...' : stats.total}
                        </span>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* Tasks Section */}
                <div className="tasks-container">
                    <div className="section-header">
                        <h2 className="section-title">Task Management</h2>
                        <div className="section-actions">
                            <div className="search-bar">
                                <FiSearch className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                            <div className="view-controls">
                                <button
                                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                    onClick={() => setViewMode('grid')}
                                >
                                    <FiGrid />
                                </button>
                                <button
                                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                    onClick={() => setViewMode('list')}
                                >
                                    <FiList />
                                </button>
                            </div>
                            <button
                                className="add-task-btn"
                                onClick={() => setShowAddTask(true)}
                            >
                                <FiPlus /> Add Task
                            </button>
                        </div>
                    </div>

                    <div className="tasks-filters">
                        <select className="filter-select">
                            <option value="all">All Tasks ({stats.total})</option>
                            <option value="pending">Pending ({stats.pending})</option>
                            <option value="in_progress">In Progress ({stats.in_progress})</option>
                            <option value="completed">Completed ({stats.completed})</option>
                        </select>
                        <select className="filter-select">
                            <option value="all">All Priority ({stats.total})</option>
                            <option value="high">High ({stats.high_priority})</option>
                            <option value="medium">Medium ({stats.medium_priority})</option>
                            <option value="low">Low ({stats.low_priority})</option>
                        </select>
                        <button className="date-filter">
                            <FiCalendar /> Date Range
                        </button>
                    </div>

                    <TaskList 
                        viewMode={viewMode} 
                        searchTerm={searchTerm} 
                        onTaskUpdate={fetchStats} 
                    />
                </div>

                {/* Sidebar */}
                <div className="dashboard-sidebar">
                    <div className="activity-container">
                        <h2 className="section-title">Recent Activity</h2>
                        <ActivityLog />
                    </div>
                    
                    <div className="online-users-container">
                        <h2 className="section-title">Team Members</h2>
                        <OnlineUsers />
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showAddTask && (
                <Modal onClose={() => setShowAddTask(false)}>
                    <TaskForm 
                        onClose={() => setShowAddTask(false)} 
                        onSuccess={() => {
                            setShowAddTask(false);
                            fetchStats(); // Refresh stats after adding a task
                        }}
                    />
                </Modal>
            )}
        </div>
    );
}

export default DashboardPage;