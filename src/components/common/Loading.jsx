import React from 'react';
import './Loading.css';

function Loading({ size = 'medium', message = 'Loading...' }) {
    return (
        <div className={`loading-container ${size}`}>
            <div className="loading-spinner"></div>
            {message && <p className="loading-message">{message}</p>}
        </div>
    );
}

export default Loading;