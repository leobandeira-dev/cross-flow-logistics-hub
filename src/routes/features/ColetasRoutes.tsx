
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';

// Pages Import
import SolicitacoesColeta from '../../pages/coletas/SolicitacoesColeta';
import AprovacoesColeta from '../../pages/coletas/AprovacoesColeta';
import CargasAlocacao from '../../pages/coletas/CargasAlocacao';

const ColetasRoutes = () => {
  return (
    <>
      <Route path="/coletas/solicitacoes" element={
        <ProtectedRoute>
          <SolicitacoesColeta />
        </ProtectedRoute>
      } />
      
      <Route path="/coletas/aprovacoes" element={
        <ProtectedRoute>
          <AprovacoesColeta />
        </ProtectedRoute>
      } />
      
      <Route path="/coletas/cargas" element={
        <ProtectedRoute>
          <CargasAlocacao />
        </ProtectedRoute>
      } />
    </>
  );
};

export default ColetasRoutes;
