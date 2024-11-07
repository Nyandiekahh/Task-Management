import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NotificationCenter from './NotificationCenter';
import './Header.css';

function Header({ onMenuClick }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const getPageTitle = () => {
        const path = location.pathname;
        switch (path) {
            case '/':
                return 'Dashboard';
            case '/tasks':
                return 'Task Management';
            case '/profile':
                return 'User Profile';
            case '/admin':
                return 'Admin Panel';
            default:
                return 'Task Management System';
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <header className="header">
            <div className="header-left">
                <button className="menu-button" onClick={onMenuClick}>
                    <span className="menu-icon"></span>
                </button>
                <h1>{getPageTitle()}</h1>
            </div>

            <div className="header-right">
                <div className="header-actions">
                    <NotificationCenter />
                    
                    {user?.role === 'admin' && (
                        <button 
                            className="admin-button"
                            onClick={() => navigate('/admin')}
                        >
                            Admin Panel
                        </button>
                    )}
                </div>

                <div className="user-menu-container">
                    <button 
                        className="user-button"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                        <div className="user-avatar">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="user-name">{user?.name}</span>
                    </button>

                    {showUserMenu && (
                        <div className="user-menu">
                            <div className="user-menu-header">
                                <div className="user-info">
                                    <strong>{user?.name}</strong>
                                    <span className="user-role">{user?.role}</span>
                                </div>
                            </div>
                            <div className="user-menu-items">
                                <button onClick={() => navigate('/profile')}>
                                    Profile Settings
                                </button>
                                <button onClick={() => navigate('/tasks')}>
                                    My Tasks
                                </button>
                                <button onClick={handleLogout} className="logout-button">
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;