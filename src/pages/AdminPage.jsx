import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';
import '../styles/components/admin.css';


function AdminPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('users');
    const [showAddUser, setShowAddUser] = useState(false);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([
        { id: 1, username: 'admin', name: 'Admin User', role: 'admin', status: 'active' },
        { id: 2, username: 'user', name: 'Regular User', role: 'user', status: 'active' },
        { id: 3, username: 'manager', name: 'Manager', role: 'manager', status: 'active' },
    ]);
    const [roles, setRoles] = useState([
        { id: 1, name: 'admin', description: 'Full system access', permissions: ['all'] },
        { id: 2, name: 'manager', description: 'Task management and delegation', permissions: ['create_task', 'assign_task', 'view_reports'] },
        { id: 3, name: 'user', description: 'Basic task operations', permissions: ['view_task', 'update_task'] },
    ]);

    // Check if user has admin access
    if (user?.role !== 'admin') {
        return (
            <div className="admin-unauthorized">
                <h2>Unauthorized Access</h2>
                <p>You don't have permission to access this page.</p>
            </div>
        );
    }

    const handleAddUser = async (userData) => {
        // In a real app, this would be an API call
        setLoading(true);
        try {
            const newUser = {
                id: users.length + 1,
                ...userData,
                status: 'active'
            };
            setUsers([...users, newUser]);
            setShowAddUser(false);
        } catch (error) {
            console.error('Error adding user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUserRole = async (userId, newRole) => {
        setUsers(users.map(user => 
            user.id === userId ? { ...user, role: newRole } : user
        ));
    };

    const handleUpdateUserStatus = async (userId, newStatus) => {
        setUsers(users.map(user => 
            user.id === userId ? { ...user, status: newStatus } : user
        ));
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h2>Admin Dashboard</h2>
                <div className="admin-tabs">
                    <button 
                        className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Users
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'roles' ? 'active' : ''}`}
                        onClick={() => setActiveTab('roles')}
                    >
                        Roles
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('settings')}
                    >
                        Settings
                    </button>
                </div>
            </div>

            <div className="admin-content">
                {activeTab === 'users' && (
                    <div className="users-section">
                        <div className="section-header">
                            <h3>User Management</h3>
                            <button 
                                className="add-button"
                                onClick={() => setShowAddUser(true)}
                            >
                                Add User
                            </button>
                        </div>

                        <div className="users-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Name</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.username}</td>
                                            <td>{user.name}</td>
                                            <td>
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                                                    className="role-select"
                                                >
                                                    {roles.map(role => (
                                                        <option key={role.id} value={role.name}>
                                                            {role.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${user.status}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button 
                                                        onClick={() => handleUpdateUserStatus(
                                                            user.id, 
                                                            user.status === 'active' ? 'inactive' : 'active'
                                                        )}
                                                        className={user.status === 'active' ? 'button-warning' : 'button-success'}
                                                    >
                                                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                    <button className="button-danger">
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'roles' && (
                    <div className="roles-section">
                        <div className="section-header">
                            <h3>Role Management</h3>
                            <button className="add-button">Add Role</button>
                        </div>

                        <div className="roles-grid">
                            {roles.map(role => (
                                <div key={role.id} className="role-card">
                                    <div className="role-header">
                                        <h4>{role.name}</h4>
                                        <button className="edit-button">Edit</button>
                                    </div>
                                    <p>{role.description}</p>
                                    <div className="permissions-list">
                                        <h5>Permissions:</h5>
                                        <ul>
                                            {role.permissions.map((permission, index) => (
                                                <li key={index}>{permission}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="settings-section">
                        <h3>System Settings</h3>
                        <div className="settings-form">
                            {/* Add your settings form here */}
                        </div>
                    </div>
                )}
            </div>

            {showAddUser && (
                <Modal onClose={() => setShowAddUser(false)}>
                    <AddUserForm 
                        onSubmit={handleAddUser}
                        onCancel={() => setShowAddUser(false)}
                        roles={roles}
                        loading={loading}
                    />
                </Modal>
            )}
        </div>
    );
}

// AddUserForm Component
function AddUserForm({ onSubmit, onCancel, roles, loading }) {
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        role: 'user',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        onSubmit(formData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="add-user-form">
            <h3>Add New User</h3>
            
            <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                >
                    {roles.map(role => (
                        <option key={role.id} value={role.name}>
                            {role.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-actions">
                <button 
                    type="button" 
                    onClick={onCancel}
                    className="button-secondary"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button 
                    type="submit"
                    className="button-primary"
                    disabled={loading}
                >
                    {loading ? 'Adding User...' : 'Add User'}
                </button>
            </div>
        </form>
    );
}

export default AdminPage;