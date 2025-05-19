
import { useLocation, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, authChecked } = useAuth();
  const location = useLocation();
  const [navigationReady, setNavigationReady] = useState(false);
  
  useEffect(() => {
    let navigationTimer: NodeJS.Timeout;
    
    // Safety timeout to prevent stuck states
    navigationTimer = setTimeout(() => {
      if (!navigationReady) {
        console.log('ProtectedRoute - Safety timeout triggered, forcing navigation decision');
        setNavigationReady(true);
      }
    }, 2000);
  
    // Wait for auth check to complete before deciding on navigation
    if (!loading && authChecked && !navigationReady) {
      console.log('ProtectedRoute - Auth check completed, ready for navigation. User:', !!user);
      setNavigationReady(true);
    }
    
    return () => clearTimeout(navigationTimer);
  }, [location, user, loading, authChecked, navigationReady]);
  
  // While auth state is being verified, show a loading indicator
  if (loading || !authChecked || !navigationReady) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-gray-600">Verificando autenticação...</p>
      </div>
    );
  }

  // If not authenticated after check completes, redirect to login
  if (!user) {
    console.log('ProtectedRoute - No authenticated user, redirecting to login from:', location.pathname);
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
  
  // If authenticated, render the protected content
  console.log('ProtectedRoute - User authenticated, showing protected content');
  return <>{children}</>;
};
