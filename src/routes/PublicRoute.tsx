
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, authChecked } = useAuth();
  const location = useLocation();
  
  // Durante a verificação inicial de autenticação, exibir indicador de carregamento
  if (loading && !authChecked) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-gray-600">Verificando autenticação...</p>
      </div>
    );
  }

  // Se estiver autenticado e não estiver na página do dashboard, 
  // redirecionar para o dashboard ou origem
  if (user && authChecked && location.pathname !== '/dashboard') {
    // Verificamos se há um caminho de origem no state
    const from = location.state?.from || '/dashboard';
    console.log('PublicRoute - Usuário autenticado, redirecionando para:', from);
    return <Navigate to={from} replace />;
  }

  // Para usuários não autenticados, exibir o conteúdo público
  return <>{children}</>;
};
