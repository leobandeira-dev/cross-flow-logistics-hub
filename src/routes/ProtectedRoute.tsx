
import { useLocation, Navigate } from 'react-router-dom';
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
  
  // Check if path is in admin section
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Allow access to all routes regardless of authentication status
  // This is currently bypassing authentication as before
  return <>{children}</>;
};
