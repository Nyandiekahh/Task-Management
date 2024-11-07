import React, { useEffect } from 'react';
import './Modal.css';

function Modal({ children, onClose }) {
    useEffect(() => {
        // Prevent background scrolling when modal is open
        document.body.style.overflow = 'hidden';
        
        // Cleanup
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Close modal if clicking outside content
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-content">
                <button className="modal-close" onClick={onClose} aria-label="Close modal">
                    ×
                </button>
                {children}
            </div>
        </div>
    );
}

export default Modal;