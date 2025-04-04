import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ProtectedRoute = ({ element, allowedRoles, allowUnauthenticated = false }) => {
  const { isAuthenticated, user } = useAuthStore();

  const roleRedirects = {
    fan: '/',
    player: '/player-home',
    manager: '/manager-home',
    admin: '/admin-home',
  };

  if (!isAuthenticated) {
    if (allowUnauthenticated) {
      return element;
    }
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    const redirectTo = roleRedirects[user?.role] || '/';
    return <Navigate to={redirectTo} replace />;
  }

  return element;
};

export default ProtectedRoute;