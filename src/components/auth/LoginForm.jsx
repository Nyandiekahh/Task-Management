import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './LoginForm.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(credentials);
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-universe">
      <div className="floating-shapes">
        {[...Array(15)].map((_, i) => (
          <div key={i} className={`shape shape-${i + 1}`} />
        ))}
      </div>

      <div className="login-container">
        <div className="login-content">
          <div className="crystal-effect" />
          
          <h1 className="login-title">
            <span>E</span><span>n</span><span>t</span><span>e</span><span>r</span>
            <span className="space"></span>
            <span>P</span><span>o</span><span>r</span><span>t</span><span>a</span><span>l</span>
          </h1>

          {error && <div className="error-message">{error}</div>}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <input 
                type="text"
                required
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                disabled={loading}
              />
              <div className="input-border" />
              <label>Username</label>
              <div className="input-glow" />
            </div>

            <div className="input-wrapper">
              <input 
                type={isVisible ? "text" : "password"}
                required
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                disabled={loading}
              />
              <div className="input-border" />
              <label>Password</label>
              <div className="input-glow" />
              <button 
                type="button" 
                className="visibility-toggle"
                onClick={() => setIsVisible(!isVisible)}
                disabled={loading}
              >
                {isVisible ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            <button 
              type="submit" 
              className={`submit-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              <span className="button-text">
                {loading ? 'Logging in...' : 'Login'}
              </span>
              <div className="button-glows">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="button-glow" />
                ))}
              </div>
              {loading && <div className="loading-spinner" />}
            </button>
          </form>

          <div className="alternative-login">
            <span className="divider">or connect with</span>
            <div className="social-buttons">
              {['🎮', '🎨', '🎯'].map((icon, i) => (
                <button 
                  key={i} 
                  className="social-button"
                  disabled={loading}
                  onClick={() => alert(`${icon} login coming soon!`)}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;