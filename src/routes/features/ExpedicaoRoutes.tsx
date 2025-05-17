
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';

// Pages Import
import Faturamento from '../../pages/expedicao/Faturamento';
import EmissaoDocumentos from '../../pages/expedicao/EmissaoDocumentos';

const ExpedicaoRoutes = () => {
  return [
    <Route key="expedicao" path="/expedicao" element={
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
