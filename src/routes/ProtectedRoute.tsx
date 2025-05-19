
import { useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    console.log('ProtectedRoute - path:', location.pathname, 'user:', !!user, 'loading:', loading);
  }, [location, user, loading]);
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-gray-600">Verificando autenticação...</p>
      </div>
    );
  }

  // If not loading and no user, redirect to auth page
  if (!user) {
    console.log('ProtectedRoute - No authenticated user, redirecting to login');
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
  
  // If authenticated, render the protected content
  return <>{children}</>;
};
