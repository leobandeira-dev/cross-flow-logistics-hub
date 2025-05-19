
import { Route } from 'react-router-dom';
import { AdminRoute } from '../AdminRoute';

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
    // All admin routes using the AdminRoute component for stricter access control
    <Route key="admin-dashboard" path="/admin" element={
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    } />,
    
    // Clientes
    <Route key="clientes-admin" path="/admin/clientes" element={
      <AdminRoute>
        <ClientesAdmin />
      </AdminRoute>
    } />,
    
    // Financeiro
    <Route key="recebimentos-admin" path="/admin/financeiro/recebimentos" element={
      <AdminRoute>
        <RecebimentosAdmin />
      </AdminRoute>
    } />,
    
    <Route key="notas-fiscais-admin" path="/admin/financeiro/notas-fiscais" element={
      <AdminRoute>
        <NotasFiscaisAdmin />
      </AdminRoute>
    } />,
    
    // Produtos/Pacotes
    <Route key="pacotes-admin" path="/admin/produtos/pacotes" element={
      <AdminRoute>
        <PacotesAdmin />
      </AdminRoute>
    } />,
    
    // Acessos
    <Route key="acessos-admin" path="/admin/acessos" element={
      <AdminRoute>
        <AcessosAdmin />
      </AdminRoute>
    } />,
    
    <Route key="reset-senhas-admin" path="/admin/acessos/reset-senhas" element={
      <AdminRoute>
        <ResetSenhasAdmin />
      </AdminRoute>
    } />,
    
    // Suporte
    <Route key="suporte-admin" path="/admin/suporte" element={
      <AdminRoute>
        <SuporteAdmin />
      </AdminRoute>
    } />,
    
    // Leads
    <Route key="leads-admin" path="/admin/leads" element={
      <AdminRoute>
        <LeadsAdmin />
      </AdminRoute>
    } />,
  ];
};

export default AdminRoutes;
