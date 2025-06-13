
import { Routes, Route } from 'react-router-dom';
import NotFound from '../pages/NotFound';

// Feature Routes
import CoreRoutes from './features/CoreRoutes';
import ArmazenagemRoutes from './features/ArmazenagemRoutes';
import ExpedicaoRoutes from './features/ExpedicaoRoutes';
import SACRoutes from './features/SACRoutes';
import ColetasRoutes from './features/ColetasRoutes';
import RelatoriosRoutes from './features/RelatoriosRoutes';
import CadastrosRoutes from './features/CadastrosRoutes';
import ConfiguracoesRoutes from './features/ConfiguracoesRoutes';
import AdminRoutes from './features/AdminRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Feature routes - spreading the array of routes returned by each feature */}
      {CoreRoutes()}
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
