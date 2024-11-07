import React, { useState } from 'react';
import { useTasks } from '../contexts/TaskContext';
import { useAuth } from '../contexts/AuthContext';
import TaskForm from '../components/tasks/TaskForm';
import TaskDelegation from '../components/tasks/TaskDelegation';
import Modal from '../components/common/Modal';
import Loading from '../components/common/Loading';
import '../styles/components/tasks.css';

function TasksPage() {
    const { tasks, loading, error, updateTask } = useTasks();
    const { user } = useAuth();
    const [showAddTask, setShowAddTask] = useState(false);
    const [showDelegateTask, setShowDelegateTask] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('dueDate');
    const [sortOrder, setSortOrder] = useState('asc');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    const handleTaskAction = (taskId, action, data) => {
        switch (action) {
            case 'delegate':
                setSelectedTask(tasks.find(t => t.id === taskId));
                setShowDelegateTask(true);
                break;
            case 'edit':
                setSelectedTask(tasks.find(t => t.id === taskId));
                setShowAddTask(true);
                break;
            case 'status':
                updateTask(taskId, { status: data });
                break;
            default:
                console.log('Unknown action:', action);
        }
    };

    const handleSort = (key) => {
        if (sortBy === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortOrder('asc');
        }
    };

    const filteredAndSortedTasks = tasks
        .filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                task.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
            const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
            return matchesSearch && matchesStatus && matchesPriority;
        })
        .sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'dueDate':
                    comparison = new Date(a.dueDate) - new Date(b.dueDate);
                    break;
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
                    break;
                case 'status':
                    comparison = a.status.localeCompare(b.status);
                    break;
                default:
                    comparison = a.title.localeCompare(b.title);
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

    if (loading) return <Loading message="Loading tasks..." />;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="tasks-page">
            <div className="tasks-header">
                <h2>Task Management</h2>
                {user?.role !== 'viewer' && (
                    <button 
                        className="add-task-button"
                        onClick={() => {
                            setSelectedTask(null);
                            setShowAddTask(true);
                        }}
                    >
                        Create New Task
                    </button>
                )}
            </div>

            <div className="tasks-controls">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filters">
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>

                    <select 
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                    >
                        <option value="all">All Priorities</option>
                        <option value="high">High Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="low">Low Priority</option>
                    </select>

                    <select 
                        value={sortBy}
                        onChange={(e) => handleSort(e.target.value)}
                    >
                        <option value="dueDate">Sort by Due Date</option>
                        <option value="priority">Sort by Priority</option>
                        <option value="status">Sort by Status</option>
                        <option value="title">Sort by Title</option>
                    </select>

                    <div className="view-toggle">
                        <button 
                            className={viewMode === 'grid' ? 'active' : ''}
                            onClick={() => setViewMode('grid')}
                        >
                            Grid
                        </button>
                        <button 
                            className={viewMode === 'list' ? 'active' : ''}
                            onClick={() => setViewMode('list')}
                        >
                            List
                        </button>
                    </div>
                </div>
            </div>

            <div className={`tasks-container ${viewMode}`}>
                {filteredAndSortedTasks.length === 0 ? (
                    <div className="no-tasks">
                        <p>No tasks found matching your criteria</p>
                    </div>
                ) : (
                    filteredAndSortedTasks.map(task => (
                        <div key={task.id} className="task-item">
                            <div className="task-header">
                                <h3>{task.title}</h3>
                                <span className={`priority-badge ${task.priority}`}>
                                    {task.priority}
                                </span>
                            </div>
                            
                            <p className="task-description">{task.description}</p>
                            
                            <div className="task-meta">
                                <div className="task-dates">
                                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                    <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                                </div>
                                
                                <div className="task-assignees">
                                    <span>By: {task.assignedBy}</span>
                                    <span>To: {task.assignedTo}</span>
                                </div>
                            </div>

                            <div className="task-actions">
                                <select
                                    value={task.status}
                                    onChange={(e) => handleTaskAction(task.id, 'status', e.target.value)}
                                    disabled={user?.role === 'viewer'}
                                    className={`status-select ${task.status}`}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>

                                {user?.role !== 'viewer' && (
                                    <>
                                        <button 
                                            onClick={() => handleTaskAction(task.id, 'edit')}
                                            className="edit-button"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleTaskAction(task.id, 'delegate')}
                                            className="delegate-button"
                                        >
                                            Delegate
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showAddTask && (
                <Modal onClose={() => setShowAddTask(false)}>
                    <TaskForm 
                        task={selectedTask}
                        onTaskCreated={() => setShowAddTask(false)}
                        onClose={() => setShowAddTask(false)}
                    />
                </Modal>
            )}

            {showDelegateTask && (
                <Modal onClose={() => setShowDelegateTask(false)}>
                    <TaskDelegation 
                        task={selectedTask}
                        onDelegated={() => setShowDelegateTask(false)}
                        onClose={() => setShowDelegateTask(false)}
                    />
                </Modal>
            )}
        </div>
    );
}

export default TasksPage;