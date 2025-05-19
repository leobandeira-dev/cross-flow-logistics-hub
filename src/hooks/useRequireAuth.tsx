
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useRequireAuth = (redirectUrl: string = '/auth') => {
  const { user, loading, authChecked, verifyAuthState } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [localAuthChecked, setLocalAuthChecked] = useState(false);

  useEffect(() => {
    // Verify auth state if needed
    if (!loading && !authChecked) {
      verifyAuthState();
      return;
    }
    
    // Só redirecionar quando o carregamento estiver completo, a autenticação tiver sido verificada,
    // e nossa verificação local ainda não tiver sido feita
    if (!loading && authChecked && !localAuthChecked) {
      setLocalAuthChecked(true);
      
      if (!user) {
        const currentPath = location.pathname;
        console.log('useRequireAuth - No user detected. Redirecting to auth from:', currentPath);
        navigate(redirectUrl, { state: { from: currentPath }, replace: true });
        return;
      }
      
      // Tratamento especial para rotas de administrador quando o usuário está autenticado
      const currentPath = location.pathname;
      const isAdminSection = currentPath.startsWith('/admin');
      
      console.log('useRequireAuth - Path:', currentPath, 'isAdmin:', isAdminSection, 'user:', user?.funcao);
      
      // Para a seção de administrador, requer acesso de administrador
      if (isAdminSection && user.funcao !== 'admin') {
        console.log('Unauthorized access to admin area. Redirecting to dashboard');
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, loading, navigate, redirectUrl, localAuthChecked, authChecked, verifyAuthState, location]);

  return { 
    user, 
    loading, 
    isAdmin: user?.funcao === 'admin',
    authChecked: localAuthChecked && authChecked
  };
};
