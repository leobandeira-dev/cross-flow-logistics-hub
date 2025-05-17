
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';

// Pages Import
import Ocorrencias from '../../pages/sac/Ocorrencias';

const SACRoutes = () => {
  return (
    <>
      <Route path="/sac/ocorrencias" element={
        <ProtectedRoute>
          <Ocorrencias />
        </ProtectedRoute>
      } />
    </>
  );
};

export default SACRoutes;
