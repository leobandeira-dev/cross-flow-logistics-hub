
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [accessChecked, setAccessChecked] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  
  useEffect(() => {
    if (!loading && !accessChecked) {
      console.log('AdminRoute - path:', location.pathname, 'user:', !!user, 'function:', user?.funcao, 'loading:', loading);
      
      // Verificar se o usuário é administrador
      const isAdmin = user?.funcao === 'admin';
      setHasAccess(!!user && isAdmin);
      setAccessChecked(true);
    }
  }, [user, loading, accessChecked, location]);
  
  if (loading || !accessChecked) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
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
