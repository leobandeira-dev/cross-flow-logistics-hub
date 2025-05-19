
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NotFound from '../pages/NotFound';
import LandingPage from '../pages/LandingPage';

// Feature Routes
import CoreRoutes from './features/CoreRoutes';
import AuthRoutes from './features/AuthRoutes';
import ArmazenagemRoutes from './features/ArmazenagemRoutes';
import ExpedicaoRoutes from './features/ExpedicaoRoutes';
import SACRoutes from './features/SACRoutes';
import ColetasRoutes from './features/ColetasRoutes';
import RelatoriosRoutes from './features/RelatoriosRoutes';
import CadastrosRoutes from './features/CadastrosRoutes';
import ConfiguracoesRoutes from './features/ConfiguracoesRoutes';
import AdminRoutes from './features/AdminRoutes';

const AppRoutes = () => {
  const { user, authChecked } = useAuth();
  
  console.log('AppRoutes rendering, user authenticated:', !!user, 'authChecked:', authChecked);
  
  return (
    <Routes>
      {/* Root route - redirect authenticated users to dashboard, otherwise show landing page */}
      <Route path="/" element={
        authChecked && user ? <Navigate to="/dashboard" replace /> : <LandingPage />
      } />
      
      {/* Home route - redirect to appropriate place */}
      <Route path="/home" element={
        authChecked && user ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />
      } />
      
      {/* Feature routes - spreading the array of routes returned by each feature */}
      {CoreRoutes()}
      {AuthRoutes()}
      {ArmazenagemRoutes()}
      {ExpedicaoRoutes()}
      {SACRoutes()}
      {ColetasRoutes()}
      {RelatoriosRoutes()}
      {CadastrosRoutes()}
      {ConfiguracoesRoutes()}
      {AdminRoutes()}
      
      {/* NotFound */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
