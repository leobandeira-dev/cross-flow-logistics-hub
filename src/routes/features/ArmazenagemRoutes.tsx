
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';

// Pages Import
import Armazenagem from '../../pages/armazenagem/Armazenagem';
import RecebimentoOverview from '../../pages/armazenagem/RecebimentoOverview';
import MovimentacoesInternas from '../../pages/armazenagem/MovimentacoesInternas';
import Carregamento from '../../pages/armazenagem/Carregamento';
import OrdemCarregamento from '../../pages/armazenagem/carregamento/OrdemCarregamento';
import UnitizacaoPaletes from '../../pages/armazenagem/movimentacoes/UnitizacaoPaletes';
import CancelarUnitizacao from '../../pages/armazenagem/movimentacoes/CancelarUnitizacao';
import Enderecamento from '../../pages/armazenagem/movimentacoes/Enderecamento';

const ArmazenagemRoutes = () => {
  return (
    <>
      {/* Main Armazenagem Route */}
      <Route path="/armazenagem" element={
        <ProtectedRoute>
          <Armazenagem />
        </ProtectedRoute>
      } />

      {/* Armazenagem Subpages */}
      <Route path="/armazenagem/recebimento" element={
        <ProtectedRoute>
          <RecebimentoOverview />
        </ProtectedRoute>
      } />
      
      <Route path="/armazenagem/movimentacoes" element={
        <ProtectedRoute>
          <MovimentacoesInternas />
        </ProtectedRoute>
      } />
      
      {/* Movimentacoes subpages */}
      <Route path="/armazenagem/movimentacoes/unitizacao" element={
        <ProtectedRoute>
          <UnitizacaoPaletes />
        </ProtectedRoute>
      } />
      
      <Route path="/armazenagem/movimentacoes/cancelar-unitizacao" element={
        <ProtectedRoute>
          <CancelarUnitizacao />
        </ProtectedRoute>
      } />
      
      <Route path="/armazenagem/movimentacoes/enderecamento" element={
        <ProtectedRoute>
          <Enderecamento />
        </ProtectedRoute>
      } />
      
      <Route path="/armazenagem/carregamento" element={
        <ProtectedRoute>
          <Carregamento />
        </ProtectedRoute>
      } />
      
      <Route path="/armazenagem/ordem-carregamento" element={
        <ProtectedRoute>
          <OrdemCarregamento />
        </ProtectedRoute>
      } />
    </>
  );
};

export default ArmazenagemRoutes;
