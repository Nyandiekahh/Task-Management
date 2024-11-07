import React, { useState } from 'react';
import { useTasks } from '../../contexts/TaskContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import Loading from '../common/Loading';
import './TaskDetails.css';

function TaskDetails({ taskId, onClose }) {
    const { tasks, updateTask } = useTasks();
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [comments, setComments] = useState([
        // Mock comments - in real app, these would come from an API
        { id: 1, text: 'Initial review completed', user: 'admin', timestamp: '2024-11-01T10:00:00' },
        { id: 2, text: 'Updates required', user: 'user', timestamp: '2024-11-02T14:30:00' }
    ]);
    const [newComment, setNewComment] = useState('');

    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return <div className="error-message">Task not found</div>;
    }

    const handleStatusChange = async (newStatus) => {
        setLoading(true);
        setError('');
        
        try {
            await updateTask(taskId, { status: newStatus });
            addNotification({
                type: 'task_updated',
                message: `Task "${task.title}" status updated to ${newStatus}`,
                priority: 'info'
            });
        } catch (err) {
            setError('Failed to update task status');
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const comment = {
            id: comments.length + 1,
            text: newComment,
            user: user.username,
            timestamp: new Date().toISOString()
        };

        setComments([...comments, comment]);
        setNewComment('');

        addNotification({
            type: 'task_comment',
            message: `New comment added to task "${task.title}"`,
            priority: 'low'
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    if (loading) {
        return <Loading message="Loading task details..." />;
    }

    return (
        <div className="task-details">
            <header className="task-details-header">
                <h2>{task.title}</h2>
                <span className={`priority-badge ${task.priority}`}>
                    {task.priority}
                </span>
            </header>

            <div className="task-info">
                <div className="info-row">
                    <span className="label">Status:</span>
                    <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={user.role === 'viewer' || loading}
                        className={`status-select ${task.status}`}
                    >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <div className="info-row">
                    <span className="label">Assigned By:</span>
                    <span>{task.assignedBy}</span>
                </div>

                <div className="info-row">
                    <span className="label">Assigned To:</span>
                    <span>{task.assignedTo}</span>
                </div>

                <div className="info-row">
                    <span className="label">Due Date:</span>
                    <span>{formatDate(task.dueDate)}</span>
                </div>

                <div className="info-row">
                    <span className="label">Created:</span>
                    <span>{formatDate(task.createdAt)}</span>
                </div>
            </div>

            <div className="task-description-section">
                <h3>Description</h3>
                <p>{task.description}</p>
            </div>

            <div className="task-comments">
                <h3>Comments</h3>
                <div className="comments-list">
                    {comments.map(comment => (
                        <div key={comment.id} className="comment">
                            <div className="comment-header">
                                <span className="comment-user">{comment.user}</span>
                                <span className="comment-time">
                                    {formatDate(comment.timestamp)}
                                </span>
                            </div>
                            <p className="comment-text">{comment.text}</p>
                        </div>
                    ))}
                </div>

                {user.role !== 'viewer' && (
                    <form onSubmit={handleAddComment} className="comment-form">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            rows={3}
                        />
                        <button type="submit" disabled={!newComment.trim()}>
                            Add Comment
                        </button>
                    </form>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}
        </div>
    );
}

export default TaskDetails;