import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import '../styles/components/auth.css';

function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Task Management System</h1>
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
