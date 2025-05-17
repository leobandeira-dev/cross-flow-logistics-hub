
import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    console.log('PublicRoute check - user:', user ? 'authenticated' : 'not authenticated', 'loading:', loading);
  }, [user, loading]);
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (user) {
    console.log('User already authenticated, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  console.log('No authenticated user, rendering public content');
  return <>{children}</>;
};
