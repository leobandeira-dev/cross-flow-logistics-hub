
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const Index = () => {
  const { authChecked } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionar para dashboard quando a verificação de autenticação estiver completa
    if (authChecked) {
      console.log('Index page - Verificação de autenticação concluída, redirecionando para dashboard');
      try {
        navigate('/dashboard', { replace: true });
      } catch (error) {
        console.error('Error navigating to dashboard:', error);
        // Fallback para navegação direta em caso de erro
        if (window.location.hostname.includes('lovableproject.com') || 
            window.location.hostname.includes('lovable.app')) {
          window.location.hash = 'dashboard';
        } else {
          window.location.href = '/dashboard';
        }
      }
    }
  }, [authChecked, navigate]);

  // Mostrar carregamento enquanto verifica autenticação
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p className="ml-3 text-gray-600">Redirecionando...</p>
    </div>
  );
};

export default Index;
