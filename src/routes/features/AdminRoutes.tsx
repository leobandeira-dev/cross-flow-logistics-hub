
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
  // Create a wrapper component for admin routes
  const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );

  return [
    // All admin routes using the admin protected route wrapper
    <Route key="admin-dashboard" path="/admin" element={
      <AdminProtectedRoute>
        <AdminDashboard />
      </AdminProtectedRoute>
    } />,
    
    // Clientes
    <Route key="clientes-admin" path="/admin/clientes" element={
      <AdminProtectedRoute>
        <ClientesAdmin />
      </AdminProtectedRoute>
    } />,
    
    // Financeiro
    <Route key="recebimentos-admin" path="/admin/financeiro/recebimentos" element={
      <AdminProtectedRoute>
        <RecebimentosAdmin />
      </AdminProtectedRoute>
    } />,
    
    <Route key="notas-fiscais-admin" path="/admin/financeiro/notas-fiscais" element={
      <AdminProtectedRoute>
        <NotasFiscaisAdmin />
      </AdminProtectedRoute>
    } />,
    
    // Produtos/Pacotes
    <Route key="pacotes-admin" path="/admin/produtos/pacotes" element={
      <AdminProtectedRoute>
        <PacotesAdmin />
      </AdminProtectedRoute>
    } />,
    
    // Acessos
    <Route key="acessos-admin" path="/admin/acessos" element={
      <AdminProtectedRoute>
        <AcessosAdmin />
      </AdminProtectedRoute>
    } />,
    
    <Route key="reset-senhas-admin" path="/admin/acessos/reset-senhas" element={
      <AdminProtectedRoute>
        <ResetSenhasAdmin />
      </AdminProtectedRoute>
    } />,
    
    // Suporte
    <Route key="suporte-admin" path="/admin/suporte" element={
      <AdminProtectedRoute>
        <SuporteAdmin />
      </AdminProtectedRoute>
    } />,
    
    // Leads
    <Route key="leads-admin" path="/admin/leads" element={
      <AdminProtectedRoute>
        <LeadsAdmin />
      </AdminProtectedRoute>
    } />,
  ];
};

export default AdminRoutes;
