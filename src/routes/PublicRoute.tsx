import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, authChecked } = useAuth();
  const location = useLocation();
  const [redirectReady, setRedirectReady] = useState(false);

  useEffect(() => {
    // Only make navigation decisions when auth check is complete and not loading
    if (!loading && authChecked) {
      console.log('PublicRoute - Auth check completed, ready for navigation. User:', !!user);
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
