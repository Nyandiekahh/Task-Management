import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function ProtectedRoute({ children, requiredRole, requiredPermission }) {
    const { user, hasPermission } = useAuth();
    const location = useLocation();

    if (!user) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
        // Redirect to dashboard if role doesn't match
        return <Navigate to="/" replace />;
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
        // Redirect to dashboard if missing permission
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;
