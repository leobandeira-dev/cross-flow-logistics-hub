
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, authChecked } = useAuth();
  const location = useLocation();
  const [redirectReady, setRedirectReady] = useState(false);
  
  useEffect(() => {
    // Only make navigation decisions when auth check is complete and not loading
    if (!loading && authChecked) {
      console.log('AdminRoute - Auth check completed, ready for navigation. User:', !!user, 'Role:', user?.funcao);
      setRedirectReady(true);
    }
  }, [user, loading, authChecked]);
  
  // While still checking auth state, show a loading indicator
  if (loading || !authChecked || !redirectReady) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-gray-600">Verificando permissões...</p>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!user) {
    console.log('AdminRoute - Not authenticated, redirecting to login');
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
  
  // If authenticated but not admin, redirect to dashboard
  if (user.funcao !== 'admin') {
    console.log('AdminRoute - User is not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  // Allow access to admin section
  console.log('AdminRoute - User has admin access, showing admin content');
  return <>{children}</>;
};
