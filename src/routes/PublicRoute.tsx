import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, authChecked } = useAuth();
  const location = useLocation();
  const [navigationReady, setNavigationReady] = useState(false);

  useEffect(() => {
    let navigationTimer: NodeJS.Timeout;
    
    // Safety timeout to prevent stuck states
    navigationTimer = setTimeout(() => {
      if (!navigationReady) {
        console.log('PublicRoute - Safety timeout triggered, forcing navigation decision');
        setNavigationReady(true);
      }
    }, 2000);
    
    // Wait for auth check to complete before deciding on navigation
    if (!loading && authChecked && !navigationReady) {
      console.log('PublicRoute - Auth check completed, ready for navigation. User:', !!user);
      setNavigationReady(true);
    }
    
    return () => clearTimeout(navigationTimer);
  }, [location, user, loading, navigationReady, authChecked]);

  // Show loading state while auth is being verified
  if (loading || !authChecked || !navigationReady) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-gray-600">Verificando estado de autenticação...</p>
      </div>
    );
  }

  // For public routes, if user is authenticated, redirect to dashboard
  if (user) {
    const from = location.state?.from || '/dashboard';
    console.log('PublicRoute - User authenticated, redirecting to:', from);
    return <Navigate to={from} replace />;
  }

  // Otherwise, render the public page
  console.log('PublicRoute - No authenticated user, showing public content');
  return <>{children}</>;
};
