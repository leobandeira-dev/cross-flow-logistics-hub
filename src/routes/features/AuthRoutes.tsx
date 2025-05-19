
import { Route, Navigate } from 'react-router-dom';
import { PublicRoute } from '../PublicRoute';

// Pages Import
import ResetPassword from '../../pages/ResetPassword';

const AuthRoutes = () => {
  return [
    <Route key="auth-wildcard" path="/auth/*" element={
      <Navigate to="/dashboard" replace />
    } />,
    
    <Route key="auth" path="/auth" element={
      <Navigate to="/dashboard" replace />
    } />,
    
    <Route key="reset-password" path="/reset-password" element={
      <PublicRoute>
        <ResetPassword />
      </PublicRoute>
    } />
  ];
};

export default AuthRoutes;
