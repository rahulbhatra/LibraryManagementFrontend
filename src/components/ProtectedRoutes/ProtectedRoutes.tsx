
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { BearerAccessRefreshToken } from '../../models/authentication';
import TokenService from '../services/token.service';

function ProtectedRoutes() {
  const isAuthenticated: BearerAccessRefreshToken = TokenService.getBearerAccessRefreshToken();

  return (
    isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" />
  );
}

export default ProtectedRoutes;