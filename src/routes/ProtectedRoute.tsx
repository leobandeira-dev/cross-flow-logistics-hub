
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, authChecked } = useAuth();
  const location = useLocation();
  
  // Enquanto estiver verificando a autenticação, mostra um indicador de carregamento
  if (loading || !authChecked) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-gray-600">Verificando autenticação...</p>
      </div>
    );
  }

  // Se não estiver autenticado após a verificação, redireciona para login
  if (!user) {
    console.log('ProtectedRoute - Usuário não autenticado, redirecionando para login de:', location.pathname);
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
  
  // Se estiver autenticado, renderiza o conteúdo protegido
  return <>{children}</>;
};
