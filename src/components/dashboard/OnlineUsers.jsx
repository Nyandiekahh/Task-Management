import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import Loading from '../../components/common/Loading';
import '../../styles/components/dashboard.css';

function OnlineUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await userService.getOnlineUsers();
            setUsers(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch team members');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        // Set up polling
        const interval = setInterval(fetchUsers, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <Loading message="Loading team members..." />;
    if (error) return <div className="error-message">{error}</div>;

    const filteredUsers = users.filter(user => {
        if (filter === 'all') return true;
        return user.status === filter;
    });

    const formatLastActive = (timestamp) => {
        const now = new Date();
        const lastActive = new Date(timestamp);
        const diffInHours = Math.floor((now - lastActive) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
    };

    return (
        <div className="online-users-container">
            <div className="users-header">
                <h3>Team Members</h3>
                <div className="users-filter">
                    <button 
                        className={`filter-button ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All Users
                    </button>
                    <button 
                        className={`filter-button ${filter === 'online' ? 'active' : ''}`}
                        onClick={() => setFilter('online')}
                    >
                        Online
                    </button>
                    <button 
                        className={`filter-button ${filter === 'offline' ? 'active' : ''}`}
                        onClick={() => setFilter('offline')}
                    >
                        Offline
                    </button>
                </div>
            </div>

            <div className="users-list">
                {filteredUsers.map(user => (
                    <div key={user.id} className="user-item">
                        <div className="user-avatar-container">
                            <div className="user-avatar">{user.avatar}</div>
                            <span className={`status-indicator ${user.status}`}></span>
                        </div>
                        <div className="user-info">
                            <span className="user-name">{user.name}</span>
                            <span className="user-username">@{user.username}</span>
                            <span className="user-role">{user.role}</span>
                        </div>
                        <div className="user-status">
                            {user.status === 'online' ? 
                                'Online' : 
                                `Last active ${formatLastActive(user.lastActive)}`
                            }
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OnlineUsers;