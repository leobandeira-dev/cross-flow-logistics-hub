
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute';

// Admin Pages Imports
import AdminDashboard from '@/pages/admin/AdminDashboard';
import ClientesAdmin from '@/pages/admin/clientes/ClientesAdmin';
import RecebimentosAdmin from '@/pages/admin/financeiro/RecebimentosAdmin';
import NotasFiscaisAdmin from '@/pages/admin/financeiro/NotasFiscaisAdmin';
import PacotesAdmin from '@/pages/admin/produtos/PacotesAdmin';
import AcessosAdmin from '@/pages/admin/acessos/AcessosAdmin';
import SuporteAdmin from '@/pages/admin/suporte/SuporteAdmin';
import LeadsAdmin from '@/pages/admin/leads/LeadsAdmin';
import ResetSenhasAdmin from '@/pages/admin/acessos/ResetSenhasAdmin';

const AdminRoutes = () => {
  return [
    // Admin Dashboard
    <Route key="admin-dashboard" path="/admin" element={
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    } />,
    
    // Clientes
    <Route key="clientes-admin" path="/admin/clientes" element={
      <ProtectedRoute>
        <ClientesAdmin />
      </ProtectedRoute>
    } />,
    
    // Financeiro
    <Route key="recebimentos-admin" path="/admin/financeiro/recebimentos" element={
      <ProtectedRoute>
        <RecebimentosAdmin />
      </ProtectedRoute>
    } />,
    
    <Route key="notas-fiscais-admin" path="/admin/financeiro/notas-fiscais" element={
      <ProtectedRoute>
        <NotasFiscaisAdmin />
      </ProtectedRoute>
    } />,
    
    // Produtos/Pacotes
    <Route key="pacotes-admin" path="/admin/produtos/pacotes" element={
      <ProtectedRoute>
        <PacotesAdmin />
      </ProtectedRoute>
    } />,
    
    // Acessos
    <Route key="acessos-admin" path="/admin/acessos" element={
      <ProtectedRoute>
        <AcessosAdmin />
      </ProtectedRoute>
    } />,
    
    <Route key="reset-senhas-admin" path="/admin/acessos/reset-senhas" element={
      <ProtectedRoute>
        <ResetSenhasAdmin />
      </ProtectedRoute>
    } />,
    
    // Suporte
    <Route key="suporte-admin" path="/admin/suporte" element={
      <ProtectedRoute>
        <SuporteAdmin />
      </ProtectedRoute>
    } />,
    
    // Leads
    <Route key="leads-admin" path="/admin/leads" element={
      <ProtectedRoute>
        <LeadsAdmin />
      </ProtectedRoute>
    } />,
  ];
};

export default AdminRoutes;
