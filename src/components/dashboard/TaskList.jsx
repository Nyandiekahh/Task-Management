// components/dashboard/TaskList.jsx
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTasks } from '../../contexts/TaskContext';
import Loading from '../common/Loading';
import '../../styles/components/dashboard.css';

function TaskList() {
    const { tasks = [], loading, error, updateTaskStatus } = useTasks();
    const { user } = useAuth();
    const [filter, setFilter] = useState('all');

    const getFilteredTasks = () => {
        if (!Array.isArray(tasks)) {
            console.error('Tasks is not an array:', tasks);
            return [];
        }

        // First filter by user role/ownership
        const userTasks = user?.role === 'admin' 
            ? tasks 
            : tasks.filter(task => 
                task.assigned_to === user?.username || 
                task.assigned_by === user?.username
            );

        // Then filter by status
        return Array.isArray(userTasks) ? userTasks.filter(task => {
            if (filter === 'all') return true;
            return task.status === filter;
        }) : [];
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await updateTaskStatus(taskId, newStatus);
        } catch (err) {
            console.error('Error updating task status:', err);
        }
    };

    if (loading && (!tasks || tasks.length === 0)) {
        return <Loading message="Loading tasks..." />;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    const filteredTasks = getFilteredTasks();

    return (
        <div className="tasks-container">
            <div className="tasks-header">
                <h3>Tasks</h3>
                <div className="tasks-filter">
                    <button 
                        className={`filter-button ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button 
                        className={`filter-button ${filter === 'pending' ? 'active' : ''}`}
                        onClick={() => setFilter('pending')}
                    >
                        Pending
                    </button>
                    <button 
                        className={`filter-button ${filter === 'in_progress' ? 'active' : ''}`}
                        onClick={() => setFilter('in_progress')}
                    >
                        In Progress
                    </button>
                    <button 
                        className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
                        onClick={() => setFilter('completed')}
                    >
                        Completed
                    </button>
                </div>
            </div>

            {filteredTasks.length === 0 ? (
                <div className="no-tasks">
                    <p>No tasks found</p>
                </div>
            ) : (
                <div className="task-grid">
                    {filteredTasks.map(task => (
                        <div key={task.id} className={`task-card ${task.priority}`}>
                            <div className="task-header">
                                <h4 className="task-title">{task.title}</h4>
                                <span className={`priority-badge ${task.priority}`}>
                                    {task.priority}
                                </span>
                            </div>
                            
                            <p className="task-description">{task.description}</p>
                            
                            <div className="task-meta">
                                <div className="task-dates">
                                    <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                                    <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="task-assignments">
                                    <span>By: {task.assigned_by}</span>
                                    <span>To: {task.assigned_to}</span>
                                </div>
                            </div>

                            <div className="task-actions">
                                <select
                                    value={task.status}
                                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                    className={`status-select ${task.status}`}
                                    disabled={user?.role === 'viewer'}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TaskList;