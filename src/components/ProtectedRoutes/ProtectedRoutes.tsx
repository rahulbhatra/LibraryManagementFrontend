
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { BearerAccessRefreshToken } from '../../models/authentication';

function ProtectedRoutes() {
  const isAuthenticated: BearerAccessRefreshToken = JSON.parse(localStorage.getItem('BearerAccessRefreshToken') || '');

  return (
    isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" />
  );
}

export default ProtectedRoutes;