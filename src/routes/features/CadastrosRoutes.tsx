
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';

// Pages Import
import CadastroUsuarios from '../../pages/usuarios/CadastroUsuarios';
import CadastroEmpresas from '../../pages/empresas/CadastroEmpresas';
import CadastroMotoristas from '../../pages/motoristas/CadastroMotoristas';
import CargasMotoristas from '../../pages/motoristas/CargasMotoristas';
import CadastroEnderecamento from '../../pages/cadastros/enderecamento/CadastroEnderecamento';

const CadastrosRoutes = () => {
  return (
    <>
      <Route path="/cadastros/usuarios" element={
        <ProtectedRoute>
          <CadastroUsuarios />
        </ProtectedRoute>
      } />
      
      <Route path="/cadastros/empresas" element={
        <ProtectedRoute>
          <CadastroEmpresas />
        </ProtectedRoute>
      } />
      
      <Route path="/cadastros/motoristas" element={
        <ProtectedRoute>
          <CadastroMotoristas />
        </ProtectedRoute>
      } />
      
      <Route path="/cadastros/motoristas/cargas" element={
        <ProtectedRoute>
          <CargasMotoristas />
        </ProtectedRoute>
      } />
      
      <Route path="/cadastros/enderecamento" element={
        <ProtectedRoute>
          <CadastroEnderecamento />
        </ProtectedRoute>
      } />
    </>
  );
};

export default CadastrosRoutes;
