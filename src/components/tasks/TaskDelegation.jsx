import React, { useState } from 'react';
import { useTasks } from '../../contexts/TaskContext';
import { useNotifications } from '../../contexts/NotificationContext';
import './TaskDelegation.css';

function TaskDelegation({ task, onClose, onDelegated }) {
    const [selectedUser, setSelectedUser] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { delegateTask } = useTasks();
    const { addNotification } = useNotifications();

    // In a real app, you would fetch this from the server
    const availableUsers = [
        { id: 1, username: 'user', name: 'Regular User' },
        { id: 2, username: 'admin', name: 'Admin User' },
        { id: 3, username: 'manager', name: 'Manager User' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedUser) {
            setError('Please select a user to delegate to');
            return;
        }

        try {
            setLoading(true);
            await delegateTask(task.id, selectedUser);
            
            addNotification({
                type: 'task_delegated',
                message: `Task "${task.title}" delegated to ${selectedUser}`,
                priority: 'info'
            });

            onDelegated();
            onClose();
        } catch (err) {
            setError('Failed to delegate task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="delegation-form">
            <h3>Delegate Task: {task.title}</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="user">Select User</label>
                    <select
                        id="user"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        disabled={loading}
                        className="delegation-select"
                    >
                        <option value="">Choose a user</option>
                        {availableUsers
                            .filter(user => user.username !== task.assignedTo) // Don't show current assignee
                            .map(user => (
                                <option key={user.id} value={user.username}>
                                    {user.name}
                                </option>
                            ))
                        }
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="reason">Reason for Delegation</label>
                    <textarea
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Explain why you're delegating this task..."
                        disabled={loading}
                        className="delegation-textarea"
                        rows={4}
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="form-actions">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        disabled={loading}
                        className="button-secondary"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading || !selectedUser}
                        className={`button-primary ${loading ? 'loading' : ''}`}
                    >
                        {loading ? 'Delegating...' : 'Delegate Task'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default TaskDelegation;