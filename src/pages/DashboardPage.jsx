import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserStats from '../components/dashboard/UserStats';
import OnlineUsers from '../components/dashboard/OnlineUsers';
import TaskList from '../components/dashboard/TaskList';
import ActivityLog from '../components/dashboard/ActivityLog';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/common/Modal';
import { FiPlus, FiSearch, FiFilter, FiGrid, FiList, FiCalendar } from 'react-icons/fi';

function DashboardPage() {
    const [showAddTask, setShowAddTask] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();

    return (
        <div className="dashboard">
            {/* Quick Stats Section */}
            <div className="stats-container">
                <div className="stats-grid">
                    <div className="stat-item">
                        <div className="stat-icon pending">12</div>
                        <span className="stat-label">Pending Tasks</span>
                        <span className="stat-value warning">12</span>
                    </div>
                    <div className="stat-item">
                        <div className="stat-icon progress">8</div>
                        <span className="stat-label">In Progress</span>
                        <span className="stat-value info">8</span>
                    </div>
                    <div className="stat-item">
                        <div className="stat-icon completed">45</div>
                        <span className="stat-label">Completed</span>
                        <span className="stat-value success">45</span>
                    </div>
                    <div className="stat-item">
                        <div className="stat-icon total">65</div>
                        <span className="stat-label">Total Tasks</span>
                        <span className="stat-value">65</span>
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
                            <option value="all">All Tasks</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                        <select className="filter-select">
                            <option value="all">All Priority</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                        <button className="date-filter">
                            <FiCalendar /> Date Range
                        </button>
                    </div>

                    <TaskList viewMode={viewMode} />
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
                    <TaskForm onClose={() => setShowAddTask(false)} />
                </Modal>
            )}
        </div>
    );
}

export default DashboardPage;