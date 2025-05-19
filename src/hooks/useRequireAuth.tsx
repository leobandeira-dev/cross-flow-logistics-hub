
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useRequireAuth = (redirectUrl: string = '/dashboard') => {
  const { user, loading, authChecked } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only proceed when auth check is complete and not loading
    if (!loading && authChecked && !user) {
      const currentPath = location.pathname;
      console.log('useRequireAuth - Nenhum usuário detectado. Redirecionando para dashboard de:', currentPath);
      navigate(redirectUrl, { state: { from: currentPath }, replace: true });
      return;
    }
    
    // If user is authenticated, check for admin section access
    if (!loading && authChecked && user) {
      const currentPath = location.pathname;
      const isAdminSection = currentPath.startsWith('/admin');
      
      // For admin section, require admin access
      if (isAdminSection && user.funcao !== 'admin') {
        console.log('Acesso não autorizado à área administrativa. Redirecionando para o dashboard');
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, loading, authChecked, navigate, redirectUrl, location.pathname]);

  return { 
    user, 
    loading, 
    isAdmin: user?.funcao === 'admin',
    authChecked
  };
};
