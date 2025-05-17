
import { useNavigate, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [processingAuthParams, setProcessingAuthParams] = useState<boolean>(false);

  useEffect(() => {
    // Verificar se há parâmetros de autenticação na URL
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      setProcessingAuthParams(true);
      // Redirecionar para a página de autenticação para processar os parâmetros
      navigate('/auth', { replace: true });
      return;
    }
    
    console.log('Index page - checking auth state: user:', user ? 'authenticated' : 'not authenticated', 'loading:', loading);
    
    if (!loading) {
      if (user) {
        console.log('User authenticated on Index page, redirecting to dashboard');
        navigate('/dashboard', { replace: true });
      } else {
        console.log('User not authenticated on Index page, redirecting to landing page');
        navigate('/', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  if (loading || processingAuthParams) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Immediate redirect if state is already determined
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />;
};

export default Index;
