import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Loading from '../common/Loading';
import { apiService } from '../../services/api';
import { useNotifications } from '../../contexts/NotificationContext';
import AddUserForm from './AddUserForm';

const UserManagement = () => {
    const [showAddUser, setShowAddUser] = useState(false);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState(null);
    const { addNotification } = useNotifications();

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await apiService.request('/auth/users/');
            setUsers(response);
        } catch (err) {
            setError('Failed to fetch users');
            addNotification({
                type: 'error',
                message: 'Failed to load users'
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await apiService.request('/auth/roles/');
            setRoles(response);
        } catch (err) {
            setError('Failed to fetch roles');
            addNotification({
                type: 'error',
                message: 'Failed to load roles'
            });
        }
    };

    const handleAddUser = async (userData) => {
        setLoading(true);
        try {
            const response = await apiService.request('/auth/users/', {
                method: 'POST',
                body: JSON.stringify(userData)
            });
            setUsers([...users, response]);
            setShowAddUser(false);
            addNotification({
                type: 'success',
                message: 'User added successfully'
            });
        } catch (error) {
            setError('Failed to add user');
            addNotification({
                type: 'error',
                message: 'Failed to add user'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUserRole = async (userId, newRole) => {
        try {
            await apiService.request(`/auth/users/${userId}/`, {
                method: 'PATCH',
                body: JSON.stringify({ role: newRole })
            });
            setUsers(users.map(user => 
                user.id === userId ? { ...user, role: newRole } : user
            ));
            addNotification({
                type: 'success',
                message: 'User role updated successfully'
            });
        } catch (error) {
            setError('Failed to update user role');
            addNotification({
                type: 'error',
                message: 'Failed to update user role'
            });
        }
    };

    const handleUpdateUserStatus = async (userId, newStatus) => {
        try {
            const endpoint = newStatus === 'active' ? 'activate' : 'deactivate';
            await apiService.request(`/auth/users/${userId}/${endpoint}/`, {
                method: 'POST'
            });
            setUsers(users.map(user => 
                user.id === userId ? { ...user, status: newStatus } : user
            ));
            addNotification({
                type: 'success',
                message: `User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`
            });
        } catch (error) {
            setError(`Failed to ${newStatus} user`);
            addNotification({
                type: 'error',
                message: `Failed to ${newStatus} user`
            });
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await apiService.request(`/auth/users/${userId}/`, {
                method: 'DELETE'
            });
            setUsers(users.filter(user => user.id !== userId));
            addNotification({
                type: 'success',
                message: 'User deleted successfully'
            });
        } catch (error) {
            setError('Failed to delete user');
            addNotification({
                type: 'error',
                message: 'Failed to delete user'
            });
        }
    };

    if (loading) return <Loading message="Loading users..." />;

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

            {error && <div className="error-message">{error}</div>}

            <div className="users-table">
                <table>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{`${user.first_name} ${user.last_name}`}</td>
                                <td>{user.email}</td>
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
                                    <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button 
                                            onClick={() => handleUpdateUserStatus(
                                                user.id, 
                                                user.is_active ? 'inactive' : 'active'
                                            )}
                                            className={user.is_active ? 'button-warning' : 'button-success'}
                                        >
                                            {user.is_active ? 'Deactivate' : 'Activate'}
                                        </button>
                                        <button 
                                            className="button-danger"
                                            onClick={() => handleDeleteUser(user.id)}
                                        >
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
};

export default UserManagement;