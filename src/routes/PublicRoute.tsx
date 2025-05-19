
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, authChecked } = useAuth();
  const location = useLocation();
  
  // During initial auth check, show loading indicator
  if (loading && !authChecked) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-gray-600">Verificando autenticação...</p>
      </div>
    );
  }

  // If authenticated and auth check is complete, redirect to dashboard or previous path
  if (user && authChecked) {
    const from = location.state?.from || '/dashboard';
    console.log('PublicRoute - Usuário autenticado, redirecionando para:', from);
    return <Navigate to={from} replace />;
  }

  // Caso contrário, renderiza a página pública
  return <>{children}</>;
};
