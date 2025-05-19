
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, authChecked } = useAuth();
  const location = useLocation();
  
  // During initial auth check, show loading indicator
  if (loading && !authChecked) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-gray-600">Verificando permissões...</p>
      </div>
    );
  }
  
  // If not authenticated after check is complete, redirect to dashboard
  if (!user && authChecked) {
    console.log('AdminRoute - Não autenticado, redirecionando para dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  // If authenticated but not admin after check is complete, redirect to dashboard
  if (user && authChecked && user.funcao !== 'admin') {
    console.log('AdminRoute - Usuário não é administrador, redirecionando para dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  // If admin, show content
  return <>{children}</>;
};
