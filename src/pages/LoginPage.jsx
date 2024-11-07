import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
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

          {error && (
            <div className="error-message" style={{
              color: 'var(--error-color)',
              background: 'rgba(231, 76, 60, 0.1)',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <input 
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
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
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
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

// Styles
const styles = `
:root {
  --primary-color: #FF6B6B;
  --secondary-color: #4ECDC4;
  --accent-color: #FFE66D;
  --dark-color: #2C3E50;
  --light-color: #F7F9FC;
  --success-color: #2ECC71;
  --error-color: #E74C3C;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 1; }
}

@keyframes borderFlow {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

.login-universe {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a1a 0%, #2C3E50 100%);
  position: relative;
  overflow: hidden;
}

.floating-shapes {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.shape {
  position: absolute;
  width: 50px;
  height: 50px;
  background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
  border-radius: 43% 57% 71% 29% / 43% 57% 43% 57%;
  opacity: 0.1;
  animation: float 10s infinite;
}

.shape-1 { top: 10%; left: 10%; animation-delay: 0s; }
.shape-2 { top: 20%; right: 20%; animation-delay: 2s; }
.shape-3 { bottom: 30%; left: 30%; animation-delay: 4s; }
.shape-4 { bottom: 15%; right: 10%; animation-delay: 6s; }
.shape-5 { top: 40%; left: 50%; animation-delay: 8s; }

.login-container {
  width: 90%;
  max-width: 400px;
  position: relative;
  z-index: 1;
}

.login-content {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.crystal-effect {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
}

.login-title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2rem;
  color: var(--light-color);
}

.login-title span {
  display: inline-block;
  animation: pulse 2s infinite;
  animation-delay: calc(var(--i) * 0.1s);
}

.login-title .space {
  width: 10px;
  display: inline-block;
}

.input-wrapper {
  position: relative;
  margin-bottom: 30px;
}

.input-wrapper input {
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 8px;
  color: var(--light-color);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.input-wrapper label {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  pointer-events: none;
}

.input-wrapper input:focus + .input-border + label,
.input-wrapper input:valid + .input-border + label {
  top: -20px;
  left: 0;
  font-size: 0.8rem;
  color: var(--secondary-color);
}

.input-border {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    var(--primary-color),
    var(--secondary-color),
    var(--accent-color)
  );
  background-size: 200% 100%;
  animation: borderFlow 2s linear infinite;
}

.input-glow {
  position: absolute;
  inset: 0;
  border-radius: 8px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  box-shadow: 0 0 15px var(--secondary-color);
}

.input-wrapper input:focus ~ .input-glow {
  opacity: 0.2;
}

.visibility-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: var(--light-color);
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.visibility-toggle:hover {
  opacity: 1;
}

.submit-button {
  width: 100%;
  padding: 12px;
  background: none;
  border: none;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border-radius: 8px;
  margin-top: 20px;
}

.button-text {
  position: relative;
  z-index: 1;
  color: var(--light-color);
  font-size: 1.1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.button-glows {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    var(--primary-color),
    var(--secondary-color),
    var(--accent-color)
  );
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.submit-button:hover .button-glows {
  opacity: 1;
}

.button-glow {
  position: absolute;
  width: 50%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  transform: skewX(-20deg);
  transition: all 0.3s ease;
}

.button-glow:nth-child(1) { left: -100%; }
.button-glow:nth-child(2) { left: -50%; }
.button-glow:nth-child(3) { left: 0%; }
.button-glow:nth-child(4) { left: 50%; }

.submit-button:hover .button-glow {
  transform: skewX(-20deg) translateX(100%);
  transition: all 0.5s ease;
}

.alternative-login {
  margin-top: 30px;
  text-align: center;
}

.divider {
  display: block;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 20px;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 25%;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
}

.divider::before { left: 0; }
.divider::after { right: 0; }

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-button {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  color: var(--light-color);
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-button:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

@media (max-width: 480px) {
  .login-content {
    padding: 30px 20px;
  }

  .login-title {
    font-size: 1.5rem;
  }

  .social-buttons {
    gap: 10px;
  }
}

@keyframes glowPulse {
  0%, 100% {
    box-shadow: 0 0 20px var(--primary-color),
                0 0 40px var(--secondary-color);
  }
  50% {
    box-shadow: 0 0 40px var(--secondary-color),
                0 0 60px var(--primary-color);
  }
}

.login-content::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  padding: 2px;
  background: linear-gradient(
    45deg,
    var(--primary-color),
    var(--secondary-color),
    var(--accent-color)
  );
  -webkit-mask: 
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask: 
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  animation: glowPulse 3s infinite;
}

/* Additional styles for authentication states */
.error-message {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.submit-button.loading {
  position: relative;
  pointer-events: none;
}

.submit-button.loading .button-text {
  opacity: 0.7;
}

.submit-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.input-wrapper input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.social-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}
`;

// Apply styles
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default LoginPage;