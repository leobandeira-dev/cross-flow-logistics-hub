
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
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

  // Se não estiver autenticado após a verificação ser concluída, redirecionar para login
  if (!user && authChecked) {
    console.log('ProtectedRoute - Usuário não autenticado, redirecionando para login');
    // Adicionamos o state para lembrar de onde o usuário veio
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }
  
  // Se autenticado, renderizar os filhos
  return <>{children}</>;
};
