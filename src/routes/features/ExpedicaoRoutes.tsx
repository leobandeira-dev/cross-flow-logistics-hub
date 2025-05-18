
import { Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';

// Pages Import
import Faturamento from '../../pages/expedicao/Faturamento';
import EmissaoDocumentos from '../../pages/expedicao/EmissaoDocumentos';

const ExpedicaoRoutes = () => {
  return [
    <Route key="expedicao" path="/expedicao" element={
      <ProtectedRoute>
        <Navigate to="/expedicao/faturamento" replace />
      </ProtectedRoute>
    } />,
    
    <Route key="expedicao-faturamento" path="/expedicao/faturamento" element={
      <ProtectedRoute>
        <Faturamento />
      </ProtectedRoute>
    } />,
    
    <Route key="expedicao-documentos" path="/expedicao/documentos" element={
      <ProtectedRoute>
        <EmissaoDocumentos />
      </ProtectedRoute>
    } />
  ];
};

export default ExpedicaoRoutes;
