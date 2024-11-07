import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import Loading from '../common/Loading';
import Modal from '../common/Modal';
import './RoleManagement.css';

// Pre-defined permissions for different aspects of the system
const AVAILABLE_PERMISSIONS = {
    tasks: {
        create_task: 'Create new tasks',
        edit_task: 'Edit tasks',
        delete_task: 'Delete tasks',
        assign_task: 'Assign tasks to others',
        view_all_tasks: 'View all tasks'
    },
    users: {
        manage_users: 'Manage users',
        view_users: 'View user list',
        edit_users: 'Edit user details'
    },
    roles: {
        manage_roles: 'Manage roles',
        assign_roles: 'Assign roles to users'
    },
    reports: {
        view_reports: 'View reports',
        export_reports: 'Export reports'
    }
};

function RoleManagement() {
    const { user } = useAuth();
    const { addNotification } = useNotifications();
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddRole, setShowAddRole] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            setLoading(true);
            // In a real app, this would be an API call
            const mockRoles = [
                {
                    id: 1,
                    name: 'Admin',
                    description: 'Full system access',
                    permissions: ['all'],
                    userCount: 2
                },
                {
                    id: 2,
                    name: 'Manager',
                    description: 'Team management and task oversight',
                    permissions: ['create_task', 'edit_task', 'assign_task', 'view_all_tasks', 'view_reports'],
                    userCount: 5
                },
                {
                    id: 3,
                    name: 'User',
                    description: 'Regular user access',
                    permissions: ['create_task', 'edit_task'],
                    userCount: 15
                }
            ];
            setRoles(mockRoles);
            setError(null);
        } catch (err) {
            setError('Failed to fetch roles');
            console.error('Error fetching roles:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddRole = async (roleData) => {
        try {
            // In a real app, this would be an API call
            const newRole = {
                id: roles.length + 1,
                ...roleData,
                userCount: 0
            };
            setRoles([...roles, newRole]);
            addNotification({
                type: 'success',
                message: `Role "${roleData.name}" created successfully`
            });
            setShowAddRole(false);
        } catch (err) {
            setError('Failed to create role');
        }
    };

    const handleUpdateRole = async (roleId, updates) => {
        try {
            setRoles(roles.map(role => 
                role.id === roleId ? { ...role, ...updates } : role
            ));
            addNotification({
                type: 'success',
                message: `Role "${updates.name}" updated successfully`
            });
            setEditingRole(null);
        } catch (err) {
            setError('Failed to update role');
        }
    };

    const handleDeleteRole = async (roleId) => {
        try {
            const role = roles.find(r => r.id === roleId);
            if (role.userCount > 0) {
                setError(`Cannot delete role "${role.name}" as it has assigned users`);
                return;
            }
            setRoles(roles.filter(role => role.id !== roleId));
            addNotification({
                type: 'success',
                message: `Role "${role.name}" deleted successfully`
            });
        } catch (err) {
            setError('Failed to delete role');
        }
    };

    const filteredRoles = roles.filter(role =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Loading message="Loading roles..." />;

    return (
        <div className="role-management">
            <div className="role-header">
                <div className="role-title">
                    <h2>Role Management</h2>
                    <p className="role-subtitle">
                        Manage user roles and permissions
                    </p>
                </div>
                <button 
                    className="add-role-button"
                    onClick={() => setShowAddRole(true)}
                >
                    Add New Role
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="role-tools">
                <input
                    type="text"
                    placeholder="Search roles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="role-search"
                />
            </div>

            <div className="roles-grid">
                {filteredRoles.map(role => (
                    <div key={role.id} className="role-card">
                        <div className="role-card-header">
                            <h3>{role.name}</h3>
                            <div className="role-actions">
                                <button
                                    onClick={() => setEditingRole(role)}
                                    className="edit-button"
                                    disabled={role.name === 'Admin'}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteRole(role.id)}
                                    className="delete-button"
                                    disabled={role.name === 'Admin' || role.userCount > 0}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        
                        <p className="role-description">{role.description}</p>
                        
                        <div className="role-meta">
                            <span className="user-count">
                                {role.userCount} {role.userCount === 1 ? 'user' : 'users'}
                            </span>
                        </div>

                        <div className="permissions-list">
                            <h4>Permissions</h4>
                            {role.permissions.includes('all') ? (
                                <p className="all-permissions">All permissions</p>
                            ) : (
                                <ul>
                                    {role.permissions.map(permission => (
                                        <li key={permission}>
                                            {AVAILABLE_PERMISSIONS[permission.split('_')[0]]?.[permission] || permission}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showAddRole && (
                <Modal onClose={() => setShowAddRole(false)}>
                    <RoleForm
                        onSubmit={handleAddRole}
                        onCancel={() => setShowAddRole(false)}
                    />
                </Modal>
            )}

            {editingRole && (
                <Modal onClose={() => setEditingRole(null)}>
                    <RoleForm
                        role={editingRole}
                        onSubmit={(updates) => handleUpdateRole(editingRole.id, updates)}
                        onCancel={() => setEditingRole(null)}
                    />
                </Modal>
            )}
        </div>
    );
}

function RoleForm({ role, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        name: role?.name || '',
        description: role?.description || '',
        permissions: role?.permissions || []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setError('Role name is required');
            return;
        }

        try {
            setLoading(true);
            await onSubmit(formData);
        } catch (err) {
            setError('Failed to save role');
        } finally {
            setLoading(false);
        }
    };

    const handlePermissionChange = (category, permission) => {
        setFormData(prev => {
            const newPermissions = new Set(prev.permissions);
            if (newPermissions.has(permission)) {
                newPermissions.delete(permission);
            } else {
                newPermissions.add(permission);
            }
            return { ...prev, permissions: Array.from(newPermissions) };
        });
    };

    const handleAllPermissionsChange = (category) => {
        setFormData(prev => {
            const categoryPermissions = Object.keys(AVAILABLE_PERMISSIONS[category]);
            const allCategoryPermissionsSelected = categoryPermissions.every(
                permission => prev.permissions.includes(permission)
            );

            let newPermissions = new Set(prev.permissions);
            if (allCategoryPermissionsSelected) {
                // Remove all permissions from this category
                categoryPermissions.forEach(permission => newPermissions.delete(permission));
            } else {
                // Add all permissions from this category
                categoryPermissions.forEach(permission => newPermissions.add(permission));
            }

            return { ...prev, permissions: Array.from(newPermissions) };
        });
    };

    return (
        <div className="role-form">
            <h3>{role ? 'Edit Role' : 'Create New Role'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Role Name</label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter role name"
                        disabled={loading || role?.name === 'Admin'}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe the role's responsibilities"
                        disabled={loading}
                        rows={3}
                    />
                </div>

                <div className="form-group">
                    <label>Permissions</label>
                    <div className="permissions-grid">
                        {Object.entries(AVAILABLE_PERMISSIONS).map(([category, permissions]) => (
                            <div key={category} className="permission-category">
                                <div className="category-header">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={Object.keys(permissions).every(
                                                permission => formData.permissions.includes(permission)
                                            )}
                                            onChange={() => handleAllPermissionsChange(category)}
                                            disabled={loading || role?.name === 'Admin'}
                                        />
                                        <span className="category-name">
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </span>
                                    </label>
                                </div>
                                <div className="permission-list">
                                    {Object.entries(permissions).map(([permission, description]) => (
                                        <label key={permission} className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                checked={formData.permissions.includes(permission)}
                                                onChange={() => handlePermissionChange(category, permission)}
                                                disabled={loading || role?.name === 'Admin'}
                                            />
                                            <span className="permission-description">
                                                {description}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
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
                        disabled={loading || role?.name === 'Admin'}
                    >
                        {loading ? 'Saving...' : role ? 'Update Role' : 'Create Role'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default RoleManagement;