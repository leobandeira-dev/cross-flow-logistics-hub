
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    console.log('AdminRoute - path:', location.pathname, 'user:', !!user, 'function:', user?.funcao, 'loading:', loading);
  }, [location, user, loading]);
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Check if the user is authenticated AND has admin role
  if (!user || user.funcao !== 'admin') {
    console.log('Access denied: User is not admin, redirecting from admin area');
    // Redirect to dashboard if not admin
    return <Navigate to="/dashboard" replace />;
  }
  
  // Allow access to admin section
  return <>{children}</>;
};
