
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { loading } = useAuth();
  
  useEffect(() => {
    console.log('PublicRoute bypassing authentication - allowing access to public routes');
  }, []);
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Always render the children without redirecting
  return <>{children}</>;
};
