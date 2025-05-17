
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';

// Pages Import
import ReportsDashboard from '../../pages/relatorios/ReportsDashboard';
import SolicitacoesReport from '../../pages/relatorios/coletas/SolicitacoesReport';

const RelatoriosRoutes = () => {
  return [
    <Route key="relatorios" path="/relatorios" element={
      <ProtectedRoute>
        <ReportsDashboard />
      </ProtectedRoute>
    } />,
    
    <Route key="relatorios-coletas-solicitacoes" path="/relatorios/coletas/solicitacoes" element={
      <ProtectedRoute>
        <SolicitacoesReport />
      </ProtectedRoute>
    } />
  ];
};

export default RelatoriosRoutes;
