import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { useNotifications } from '../contexts/NotificationContext';

function SetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tokenValid, setTokenValid] = useState(true);
    const { token } = useParams();
    const navigate = useNavigate();
    const { addNotification } = useNotifications();

    useEffect(() => {
        verifyToken();
    }, [token]);

    const verifyToken = async () => {
        try {
            await apiService.request(`/auth/verify-token/${token}/`);
        } catch (error) {
            setTokenValid(false);
            setError('This password reset link is invalid or has expired.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await apiService.request('/auth/set-password/', {
                method: 'POST',
                body: JSON.stringify({
                    token,
                    password
                })
            });

            addNotification({
                type: 'success',
                message: 'Password set successfully! You can now login.'
            });

            navigate('/login');
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to set password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!tokenValid) {
        return (
            <div className="main-container invalid-token">
                <h2>Invalid Link</h2>
                <p>{error}</p>
                <button 
                    className="login-button"
                    onClick={() => navigate('/login')}
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div>
            <header className="header">
                <img src="/coat-of-arms.png" alt="Coat of Arms" className="coat-of-arms" />
                <h1 className="header-title">Task Management System</h1>
            </header>

            <div className="main-container">
                <h2 className="system-title">Set Your Password</h2>
                
                <form onSubmit={handleSubmit} className="set-password-form">
                    <div className="notice">
                        Please create a strong password for your account
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="password-requirements">
                        <h4>Password Requirements:</h4>
                        <ul>
                            <li>At least 8 characters long</li>
                            <li>Contains at least one number</li>
                            <li>Contains at least one uppercase letter</li>
                            <li>Contains at least one lowercase letter</li>
                            <li>Contains at least one special character (!@#$%^&*)</li>
                        </ul>
                    </div>

                    <button 
                        type="submit" 
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Setting Password...' : 'Set Password'}
                    </button>
                </form>

                <footer className="footer">
                    <p>&copy; 2024 Task Management System. All rights reserved.</p>
                    <p>Government of Kenya</p>
                </footer>
            </div>
        </div>
    );
}

export default SetPasswordPage;