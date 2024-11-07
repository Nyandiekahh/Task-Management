import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    FiPieChart, 
    FiCheckSquare, 
    FiUser, 
    FiSettings, 
    FiUsers,
    FiFolder,
    FiMail 
} from 'react-icons/fi';
import '../../styles/components/Sidebar.css';

// Logo component
const Logo = () => (
    <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="logo"
    >
        <path
            d="M8 3H24C26.7614 3 29 5.23858 29 8V24C29 26.7614 26.7614 29 24 29H8C5.23858 29 3 26.7614 3 24V8C3 5.23858 5.23858 3 8 3Z"
            fill="#6366F1"
            fillOpacity="0.2"
        />
        <path
            d="M16 3L29 16L16 29L3 16L16 3Z"
            fill="#6366F1"
            fillOpacity="0.4"
        />
        <circle
            cx="16"
            cy="16"
            r="8"
            fill="#6366F1"
        />
        <path
            d="M16 12V20M12 16H20"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

function Sidebar({ isOpen }) {
    const menuItems = [
        { 
            category: 'main',
            items: [
                { path: '/', label: 'Dashboard', icon: FiPieChart },
                { path: '/tasks', label: 'Tasks', icon: FiCheckSquare },
                { path: '/projects', label: 'Projects', icon: FiFolder },
                { path: '/messages', label: 'Messages', icon: FiMail, badge: 3 },
                { path: '/team', label: 'Team', icon: FiUsers }
            ]
        },
        {
            category: 'user',
            items: [
                { path: '/profile', label: 'Profile', icon: FiUser },
                { path: '/admin', label: 'Settings', icon: FiSettings }
            ]
        }
    ];

    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <div className="logo-container">
                    <Logo />
                    <span className="logo-text">TaskHub</span>
                </div>
            </div>

            {/* Rest of the sidebar code remains the same */}
            <nav className="sidebar-nav">
                {menuItems.map((section) => (
                    <div key={section.category} className="nav-section">
                        <span className="nav-section-title">
                            {section.category === 'main' ? 'Main Menu' : 'User'}
                        </span>
                        {section.items.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => 
                                    `nav-item ${isActive ? 'active' : ''}`
                                }
                            >
                                <span className="nav-icon">
                                    <item.icon size={20} />
                                </span>
                                <span className="nav-label">{item.label}</span>
                                {item.badge && (
                                    <span className="nav-badge">{item.badge}</span>
                                )}
                                <div className="nav-indicator" />
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="user-avatar">
                        <div className="avatar-placeholder">JD</div>
                        <span className="status-dot" />
                    </div>
                    <div className="user-info">
                        <span className="user-name">John Doe</span>
                        <span className="user-role">Admin</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;