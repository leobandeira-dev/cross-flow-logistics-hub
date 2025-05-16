
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    console.log('ProtectedRoute check - user:', !!user, 'loading:', loading);
  }, [user, loading]);
  
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
