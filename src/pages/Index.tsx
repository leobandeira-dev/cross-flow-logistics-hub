
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
      navigate('/dashboard', { replace: true });
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
