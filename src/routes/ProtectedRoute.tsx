
import { useLocation, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, authChecked, verifyAuthState } = useAuth();
  const location = useLocation();
  const [authState, setAuthState] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
  
  useEffect(() => {
    if (!loading) {
      console.log('ProtectedRoute - path:', location.pathname, 'user:', !!user, 'loading:', loading, 'authChecked:', authChecked);
      
      // Verify auth state if needed
      if (!authChecked) {
        verifyAuthState();
        return;
      }
      
      if (user) {
        setAuthState('authenticated');
      } else {
        setAuthState('unauthenticated');
      }
    }
  }, [location, user, loading, authChecked, verifyAuthState]);
  
  // Mostrar carregamento apenas durante a verificação inicial
  if (loading || authState === 'checking') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-gray-600">Verificando autenticação...</p>
      </div>
    );
  }

  // Se não estiver carregando e não houver usuário, redirecionar para a página de autenticação
  if (authState === 'unauthenticated') {
    console.log('ProtectedRoute - No authenticated user, redirecting to login from:', location.pathname);
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
  
  // Se autenticado, renderizar o conteúdo protegido
  return <>{children}</>;
};
