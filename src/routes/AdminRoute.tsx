
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, authChecked, verifyAuthState } = useAuth();
  const location = useLocation();
  const [accessChecked, setAccessChecked] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  
  useEffect(() => {
    // Verify auth state if needed
    if (!loading && !authChecked) {
      verifyAuthState();
      return;
    }
    
    if (!loading && authChecked && !accessChecked) {
      console.log('AdminRoute - path:', location.pathname, 'user:', !!user, 'function:', user?.funcao, 'loading:', loading, 'authChecked:', authChecked);
      
      // Verificar se o usuário é administrador
      const isAdmin = user?.funcao === 'admin';
      setHasAccess(!!user && isAdmin);
      setAccessChecked(true);
    }
  }, [user, loading, accessChecked, location, authChecked, verifyAuthState]);
  
  if (loading || !authChecked || !accessChecked) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-gray-600">Verificando permissões...</p>
      </div>
    );
  }
  
  // Se não estiver autenticado, redirecionar para a página de login
  if (!user) {
    console.log('Access denied: User not authenticated, redirecting from admin area');
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
  
  // Verificar se o usuário está autenticado E tem função de administrador
  if (!hasAccess) {
    console.log('Access denied: User is not admin, redirecting from admin area');
    // Redirecionar para o dashboard se não for administrador
    return <Navigate to="/dashboard" replace />;
  }
  
  // Permitir acesso à seção de administração
  return <>{children}</>;
};
