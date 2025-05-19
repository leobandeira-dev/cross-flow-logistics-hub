
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useRequireAuth = (redirectUrl: string = '/dashboard') => {
  const { user, loading, authChecked } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Só prosseguir quando a verificação de autenticação estiver completa e não estiver carregando
    if (!loading && authChecked && !user) {
      const currentPath = location.pathname;
      console.log('useRequireAuth - Nenhum usuário autenticado detectado. Redirecionando de:', currentPath);
      navigate(redirectUrl, { state: { from: currentPath }, replace: true });
      return;
    }
    
    // Se o usuário estiver autenticado, verificar acesso à seção de administração
    if (!loading && authChecked && user) {
      const currentPath = location.pathname;
      const isAdminSection = currentPath.startsWith('/admin');
      
      // Para seção de administração, exigir acesso de administrador
      if (isAdminSection && user.funcao !== 'admin') {
        console.log('Acesso não autorizado à seção de administração. Redirecionando para dashboard');
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
