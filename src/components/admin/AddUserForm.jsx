import React, { useState } from 'react';
import { apiService } from '../../services/api';
import { useNotifications } from '../../contexts/NotificationContext';
import './AddUserForm.css';

function AddUserForm({ onSubmit, onCancel, roles, loading }) {
    const { addNotification } = useNotifications();
    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: '',
        role: 'user'
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        const validationErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.email) {
            validationErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            validationErrors.email = 'Please enter a valid email address';
        }

        if (!formData.first_name?.trim()) {
            validationErrors.first_name = 'First name is required';
        }

        if (!formData.last_name?.trim()) {
            validationErrors.last_name = 'Last name is required';
        }

        return validationErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            console.log('Sending user data:', formData);

            const response = await apiService.request('/auth/users/', {
                method: 'POST',
                body: JSON.stringify({
                    email: formData.email.trim().toLowerCase(),
                    first_name: formData.first_name.trim(),
                    last_name: formData.last_name.trim(),
                    role: formData.role
                })
            });
            
            // Clear form
            setFormData({
                email: '',
                first_name: '',
                last_name: '',
                role: 'user'
            });
            
            addNotification({
                type: 'success',
                message: `User account created successfully. An OTP has been sent to ${formData.email}`,
                duration: 6000
            });
            
            if (onSubmit) {
                onSubmit(response);
            }
        } catch (error) {
            console.error('Create user error:', error);
            
            // Handle different types of errors
            if (error.response?.data) {
                const apiErrors = error.response.data;
                
                // Check if the error is about existing email
                if (apiErrors.email && apiErrors.email.includes('already exists')) {
                    setErrors({ 
                        email: 'This email address is already registered. Please use a different email.' 
                    });
                    addNotification({
                        type: 'error',
                        message: 'This email address is already registered.',
                        duration: 5000
                    });
                } else {
                    setErrors(apiErrors);
                    addNotification({
                        type: 'error',
                        message: 'Failed to create user account. Please check the form for errors.',
                        duration: 5000
                    });
                }
            } else {
                setErrors({ 
                    general: 'An unexpected error occurred. Please try again later.' 
                });
                addNotification({
                    type: 'error',
                    message: 'An unexpected error occurred. Please try again later.',
                    duration: 5000
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-user-form">
            <h3>Add New User</h3>
            
            <div className="form-info-message">
                The user will receive an email with an OTP to verify their account.
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="first_name">First Name*</label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        className={errors.first_name ? 'error' : ''}
                        disabled={isSubmitting}
                    />
                    {errors.first_name && <span className="error-text">{errors.first_name}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="last_name">Last Name*</label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        className={errors.last_name ? 'error' : ''}
                        disabled={isSubmitting}
                    />
                    {errors.last_name && <span className="error-text">{errors.last_name}</span>}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="email">Email*</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={errors.email ? 'error' : ''}
                    disabled={isSubmitting}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="role">Role*</label>
                <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className={errors.role ? 'error' : ''}
                    disabled={isSubmitting}
                >
                    {roles.map(role => (
                        <option key={role.id || role.name} value={role.name}>
                            {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                        </option>
                    ))}
                </select>
                {errors.role && <span className="error-text">{errors.role}</span>}
            </div>

            {errors.general && (
                <div className="error-message">{errors.general}</div>
            )}

            <div className="form-actions">
                <button 
                    type="button" 
                    onClick={onCancel}
                    className="button-secondary"
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button 
                    type="submit"
                    className="button-primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Creating User...' : 'Create User'}
                </button>
            </div>
        </form>
    );
}

export default AddUserForm;