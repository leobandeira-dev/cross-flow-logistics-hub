
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, connectionError } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    console.log('ProtectedRoute check - user:', user ? 'authenticated' : 'not authenticated', 'loading:', loading, 'connectionError:', connectionError);
  }, [user, loading, connectionError]);
  
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
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    console.log('No user found, redirecting to auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  console.log('User authenticated, rendering protected content');
  return <>{children}</>;
};
