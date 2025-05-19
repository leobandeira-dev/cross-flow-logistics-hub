
import { useLocation, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, authChecked } = useAuth();
  const location = useLocation();
  const [redirectReady, setRedirectReady] = useState(false);
  
  useEffect(() => {
    // Only make navigation decisions when auth check is complete and not loading
    if (!loading && authChecked) {
      console.log('ProtectedRoute - Auth check completed, ready for navigation. User:', !!user);
      setRedirectReady(true);
    }
  }, [user, loading, authChecked]);
  
  // While still checking auth state, show a loading indicator
  if (loading || !authChecked || !redirectReady) {
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
