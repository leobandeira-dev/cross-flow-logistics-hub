
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useRequireAuth = (redirectUrl: string = '/auth') => {
  const { user, loading, authChecked } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [localAuthChecked, setLocalAuthChecked] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    // Timeout de segurança para evitar estados presos
    timer = setTimeout(() => {
      if (!localAuthChecked) {
        console.log('useRequireAuth - Timeout de segurança ativado');
        setLocalAuthChecked(true);
      }
    }, 2000);
    
    // Só prossegue quando o carregamento é concluído e a autenticação foi verificada
    if (!loading && authChecked && !localAuthChecked) {
      console.log('useRequireAuth - Verificação de autenticação concluída, verificando acesso. Usuário:', !!user);
      setLocalAuthChecked(true);
      
      if (!user) {
        const currentPath = location.pathname;
        console.log('useRequireAuth - Nenhum usuário detectado. Redirecionando para autenticação de:', currentPath);
        navigate(redirectUrl, { state: { from: currentPath }, replace: true });
        return;
      }
      
      // Tratamento especial para rotas de administrador quando o usuário está autenticado
      const currentPath = location.pathname;
      const isAdminSection = currentPath.startsWith('/admin');
      
      // Para seção de administrador, exigir acesso de administrador
      if (isAdminSection && user.funcao !== 'admin') {
        console.log('Acesso não autorizado à área administrativa. Redirecionando para o dashboard');
        navigate('/dashboard', { replace: true });
      }
    }
    
    return () => clearTimeout(timer);
  }, [user, loading, navigate, redirectUrl, localAuthChecked, authChecked, location]);

  return { 
    user, 
    loading, 
    isAdmin: user?.funcao === 'admin',
    authChecked: localAuthChecked && authChecked
  };
};
