
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Only check auth once when loading is complete
    if (!loading && !authChecked) {
      console.log('PublicRoute - path:', location.pathname, 'user:', !!user, 'loading:', loading);
      setAuthChecked(true);
    }
  }, [location, user, loading, authChecked]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-gray-600">Verificando estado de autenticação...</p>
      </div>
    );
  }

  // For public routes, if user is already authenticated,
  // redirect them to dashboard
  if (user) {
    // Get the intended destination from state, or default to dashboard
    const from = location.state?.from || '/dashboard';
    console.log('PublicRoute - User authenticated, redirecting to:', from);
    return <Navigate to={from} replace />;
  }

  // Otherwise render the public page
  return <>{children}</>;
};
