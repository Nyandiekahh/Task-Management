import React, { useState } from 'react';
import UserStats from '../components/dashboard/UserStats';
import OnlineUsers from '../components/dashboard/OnlineUsers';
import TaskList from '../components/dashboard/TaskList';
import ActivityLog from '../components/dashboard/ActivityLog';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/common/Modal';
import { useAuth } from '../contexts/AuthContext';
import '../styles/components/dashboard.css';

function DashboardPage() {
    const [showAddTask, setShowAddTask] = useState(false);
    const { user } = useAuth();

    const handleTaskCreated = (newTask) => {
        // We'll implement this when we add task context
        setShowAddTask(false);
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h2 className="section-title">Welcome back, {user?.name}</h2>
            </div>

            <div className="stats-grid">
                <div className="stats-item">
                    <UserStats />
                </div>
                <div className="stats-item">
                    <OnlineUsers />
                </div>
            </div>

            <div className="dashboard-content">
                <TaskList />
                <ActivityLog />
            </div>

            {/* Add Task Button - only show for users who can create tasks */}
            {user?.role !== 'viewer' && (
                <button 
                    className="add-task-button"
                    onClick={() => setShowAddTask(true)}
                    aria-label="Add new task"
                >
                    +
                </button>
            )}

            {/* Add Task Modal */}
            {showAddTask && (
                <Modal onClose={() => setShowAddTask(false)}>
                    <TaskForm 
                        onTaskCreated={handleTaskCreated}
                        onClose={() => setShowAddTask(false)}
                    />
                </Modal>
            )}
        </div>
    );
}

export default DashboardPage;