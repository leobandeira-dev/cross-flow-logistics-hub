
import { Route } from 'react-router-dom';
import { PublicRoute } from '../PublicRoute';

// Pages Import
import AuthPage from '../../pages/AuthPage';
import ResetPassword from '../../pages/ResetPassword';

const AuthRoutes = () => {
  return (
    <>
      {/* Rota especial para processar tokens de autenticação */}
      <Route path="/auth/*" element={
        <PublicRoute>
          <AuthPage />
        </PublicRoute>
      } />
      
      <Route path="/auth" element={
        <PublicRoute>
          <AuthPage />
        </PublicRoute>
      } />
      
      <Route path="/reset-password" element={
        <PublicRoute>
          <ResetPassword />
        </PublicRoute>
      } />
    </>
  );
};

export default AuthRoutes;
