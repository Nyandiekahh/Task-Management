import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/common/Loading';
import '../styles/components/profile.css';


function ProfilePage() {
    const { user, updateUser } = useAuth();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        title: user?.title || '',
        department: user?.department || '',
        phone: user?.phone || '',
        notifications: user?.notifications || {
            email: true,
            push: true,
            taskUpdates: true,
            taskAssignments: true
        }
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                notifications: {
                    ...prev.notifications,
                    [name]: checked
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // In a real app, this would be an API call
            await updateUser(formData);
            setEditing(false);
        } catch (err) {
            setError('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <Loading />;

    return (
        <div className="profile-page">
            <div className="profile-header">
                <h2>Profile Settings</h2>
                {!editing && (
                    <button 
                        className="edit-button"
                        onClick={() => setEditing(true)}
                    >
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="profile-content">
                <div className="profile-section">
                    <div className="profile-avatar">
                        <div className="avatar-placeholder">
                            {user.name?.charAt(0) || 'U'}
                        </div>
                        {editing && (
                            <button className="change-avatar-button">
                                Change Photo
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={!editing || loading}
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
                                disabled={!editing || loading}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="title">Job Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    disabled={!editing || loading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="department">Department</label>
                                <input
                                    type="text"
                                    id="department"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    disabled={!editing || loading}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                disabled={!editing || loading}
                            />
                        </div>

                        {editing && (
                            <>
                                <h3>Notification Preferences</h3>
                                <div className="notification-preferences">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="email"
                                            checked={formData.notifications.email}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                        Email Notifications
                                    </label>

                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="push"
                                            checked={formData.notifications.push}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                        Push Notifications
                                    </label>

                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="taskUpdates"
                                            checked={formData.notifications.taskUpdates}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                        Task Updates
                                    </label>

                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="taskAssignments"
                                            checked={formData.notifications.taskAssignments}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                        Task Assignments
                                    </label>
                                </div>

                                {error && <div className="error-message">{error}</div>}

                                <div className="form-actions">
                                    <button 
                                        type="button" 
                                        onClick={() => setEditing(false)}
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
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;