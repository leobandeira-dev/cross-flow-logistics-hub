
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, authChecked } = useAuth();
  const location = useLocation();
  const [navigationReady, setNavigationReady] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  
  useEffect(() => {
    let navigationTimer: NodeJS.Timeout;
    
    // Safety timeout to prevent stuck states
    navigationTimer = setTimeout(() => {
      if (!navigationReady) {
        console.log('AdminRoute - Safety timeout triggered, forcing navigation decision');
        setNavigationReady(true);
      }
    }, 2000);
  
    // Check access permissions once auth state is loaded
    if (!loading && authChecked && !navigationReady) {
      console.log('AdminRoute - Auth check completed, checking permissions. User:', 
                  !!user, 'function:', user?.funcao);
      
      // Check if user has admin role
      const isAdmin = user?.funcao === 'admin';
      setHasAccess(!!user && isAdmin);
      setNavigationReady(true);
    }
    
    return () => clearTimeout(navigationTimer);
  }, [user, loading, navigationReady, location, authChecked]);
  
  if (loading || !authChecked || !navigationReady) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-gray-600">Verificando permissões...</p>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!user) {
    console.log('Access denied: User not authenticated, redirecting from admin area');
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
  
  // If authenticated but not admin, redirect to dashboard
  if (!hasAccess) {
    console.log('Access denied: User is not admin, redirecting from admin area');
    return <Navigate to="/dashboard" replace />;
  }
  
  // Allow access to admin section
  console.log('AdminRoute - User has admin access, showing admin content');
  return <>{children}</>;
};
