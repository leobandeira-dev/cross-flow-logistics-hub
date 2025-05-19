
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useRequireAuth = (redirectUrl: string = '/auth') => {
  const { user, loading, authChecked } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only proceed when auth check is complete and not loading
    if (!loading && authChecked) {
      console.log('useRequireAuth - Verificação de autenticação concluída, verificando acesso. Usuário:', !!user);
      
      if (!user) {
        const currentPath = location.pathname;
        console.log('useRequireAuth - Nenhum usuário detectado. Redirecionando para autenticação de:', currentPath);
        navigate(redirectUrl, { state: { from: currentPath }, replace: true });
        return;
      }
      
      // Special handling for admin routes when user is authenticated
      const currentPath = location.pathname;
      const isAdminSection = currentPath.startsWith('/admin');
      
      // For admin section, require admin access
      if (isAdminSection && user.funcao !== 'admin') {
        console.log('Acesso não autorizado à área administrativa. Redirecionando para o dashboard');
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, loading, navigate, redirectUrl, authChecked, location]);

  return { 
    user, 
    loading, 
    isAdmin: user?.funcao === 'admin',
    authChecked
  };
};
