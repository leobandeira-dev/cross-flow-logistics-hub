
import { useNavigate, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const Index = () => {
  const { user, loading, connectionError } = useAuth();
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
    
    console.log('Index page - checking auth state: user:', user ? 'authenticated' : 'not authenticated', 'loading:', loading, 'connectionError:', connectionError);
    
    if (!loading && !connectionError) {
      if (user) {
        console.log('User authenticated on Index page, redirecting to dashboard');
        navigate('/dashboard', { replace: true });
      } else {
        console.log('User not authenticated on Index page, redirecting to landing page');
        navigate('/', { replace: true });
      }
    }
  }, [user, loading, navigate, connectionError]);

  const handleRefresh = () => {
    window.location.reload();
  };
  
  if (connectionError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md mb-4">
          <AlertTitle>Erro de conexão</AlertTitle>
          <AlertDescription>
            Não foi possível conectar ao servidor. Por favor, verifique sua conexão com a internet e tente novamente.
          </AlertDescription>
        </Alert>
        <Button onClick={handleRefresh} className="mt-2">
          <RefreshCw className="mr-2 h-4 w-4" /> Tentar novamente
        </Button>
      </div>
    );
  }

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
