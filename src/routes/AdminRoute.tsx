
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, authChecked } = useAuth();
  const location = useLocation();
  
  // Debug logs to trace the authentication flow
  console.log('AdminRoute - Check:', { 
    userId: user?.id,
    userRole: user?.funcao,
    isAdmin: user?.funcao === 'admin', 
    loading, 
    authChecked, 
    path: location.pathname 
  });
  
  // Durante a verificação inicial de autenticação, exibir indicador de carregamento
  if (loading && !authChecked) {
    console.log('AdminRoute - Verificando autenticação...');
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-gray-600">Verificando permissões...</p>
      </div>
    );
  }
  
  // Se não estiver autenticado após a verificação ser concluída, redirecionar para dashboard
  if (!user && authChecked) {
    console.log('AdminRoute - Não autenticado, redirecionando para dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  // Se estiver autenticado mas não for admin após a verificação ser concluída, redirecionar para dashboard
  if (user && authChecked && user.funcao !== 'admin') {
    console.log('AdminRoute - Usuário não é administrador:', user.funcao);
    return <Navigate to="/dashboard" replace />;
  }
  
  // Se for admin, mostrar conteúdo
  console.log('AdminRoute - Acesso permitido para admin');
  return <>{children}</>;
};
