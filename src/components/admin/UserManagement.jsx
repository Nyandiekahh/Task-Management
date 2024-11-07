import React, { useState } from 'react';
import Modal from '../common/Modal';
import AddUserForm from './AddUserForm';

function UserManagement() {
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

    const handleAddUser = async (userData) => {
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

export default UserManagement;