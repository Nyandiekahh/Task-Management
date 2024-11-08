import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/common/Modal';
// Update the import path for AddUserForm
import AddUserForm from '../components/admin/AddUserForm';
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
    const [roles] = useState([
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
        setLoading(true);
        try {
            const newUser = {
                id: users.length + 1,
                ...userData,
                status: 'active',
                // Combine first_name and last_name for display
                name: `${userData.first_name} ${userData.last_name}`
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

export default AdminPage;