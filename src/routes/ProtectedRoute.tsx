
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useRequireAuth } from '../hooks/useRequireAuth';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useRequireAuth('/auth');
  const location = useLocation();
  
  useEffect(() => {
    console.log('ProtectedRoute - path:', location.pathname, 'user:', !!user, 'loading:', loading);
  }, [location, user, loading]);
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Once loading is complete, render children regardless of auth state
  // Redirection is handled in useRequireAuth to prevent loops
  return <>{children}</>;
};
