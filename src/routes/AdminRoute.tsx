
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, authChecked } = useAuth();
  const location = useLocation();
  
  // Enquanto estiver verificando a autenticação, mostra um indicador de carregamento
  if (loading || !authChecked) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-gray-600">Verificando permissões...</p>
      </div>
    );
  }
  
  // Se não estiver autenticado, redireciona para login
  if (!user) {
    console.log('AdminRoute - Não autenticado, redirecionando para login');
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
  
  // Se estiver autenticado mas não for administrador, redireciona para dashboard
  if (user.funcao !== 'admin') {
    console.log('AdminRoute - Usuário não é administrador, redirecionando para dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  // Permitir acesso à seção de administrador
  console.log('AdminRoute - Usuário tem acesso de administrador, mostrando conteúdo de administrador');
  return <>{children}</>;
};
