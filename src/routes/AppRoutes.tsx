
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NotFound from '../pages/NotFound';

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
  const { user } = useAuth();
  
  console.log('AppRoutes rendering, user authenticated:', !!user);
  
  return (
    <Routes>
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
      {AdminRoutes()} {/* Add the Admin routes here */}
      
      {/* NotFound */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
