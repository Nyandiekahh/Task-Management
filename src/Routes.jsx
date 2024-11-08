import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import SetPasswordPage from './pages/SetPasswordPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

function AppRoutes() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/set-password/:token" element={<SetPasswordPage />} />
            
            {/* Protected routes with MainLayout */}
            <Route path="/" element={
                <ProtectedRoute>
                    <MainLayout />
                </ProtectedRoute>
            }>
                {/* Dashboard - default route */}
                <Route index element={<DashboardPage />} />
                
                {/* Tasks */}
                <Route path="tasks" element={<TasksPage />} />
                
                {/* Profile */}
                <Route path="profile" element={<ProfilePage />} />
                
                {/* Admin routes */}
                <Route path="admin" element={
                    <ProtectedRoute requiredRole="admin">
                        <AdminPage />
                    </ProtectedRoute>
                } />
            </Route>

            {/* Catch all unmatched routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default AppRoutes;