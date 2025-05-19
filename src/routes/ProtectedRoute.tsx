
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, authChecked } = useAuth();
  const location = useLocation();
  
  console.log('ProtectedRoute check -', {
    pathname: location.pathname,
    userAuthenticated: !!user,
    loading,
    authChecked
  });
  
  // During initial authentication check, show loading indicator
  if (loading && !authChecked) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-gray-600">Verificando autenticação...</p>
      </div>
    );
  }

  // If not authenticated after check is complete, redirect to login
  if (!user && authChecked) {
    console.log('ProtectedRoute - Usuário não autenticado, redirecionando para login');
    // Add state to remember where the user came from
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }
  
  // If authenticated, render children
  return <>{children}</>;
};
