
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, authChecked, verifyAuthState } = useAuth();
  const location = useLocation();
  const [redirectChecked, setRedirectChecked] = useState(false);

  useEffect(() => {
    // Verify auth state if needed
    if (!loading && !authChecked) {
      verifyAuthState();
    }
    
    // Verificar autenticação uma vez quando o carregamento estiver concluído
    if (!loading && authChecked && !redirectChecked) {
      console.log('PublicRoute - path:', location.pathname, 'user:', !!user, 'loading:', loading, 'authChecked:', authChecked);
      setRedirectChecked(true);
    }
  }, [location, user, loading, redirectChecked, authChecked, verifyAuthState]);

  // Mostrar carregamento apenas durante a verificação inicial de autenticação
  if (loading || !authChecked) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-gray-600">Verificando estado de autenticação...</p>
      </div>
    );
  }

  // Para rotas públicas, se o usuário já estiver autenticado,
  // redirecionar para o dashboard
  if (user) {
    // Obter o destino pretendido do estado ou usar o padrão para dashboard
    const from = location.state?.from || '/dashboard';
    console.log('PublicRoute - User authenticated, redirecting to:', from);
    return <Navigate to={from} replace />;
  }

  // Caso contrário, renderizar a página pública
  return <>{children}</>;
};
