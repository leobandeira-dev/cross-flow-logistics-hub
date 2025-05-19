
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useRequireAuth = (redirectUrl: string = '/auth') => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect when loading is complete and user is not authenticated
    if (!loading && !user) {
      const currentPath = window.location.pathname;
      console.log('useRequireAuth - No user detected. Redirecting to auth from:', currentPath);
      navigate(redirectUrl, { state: { from: currentPath }, replace: true });
    }
    
    // Special handling for admin routes when user is authenticated
    if (!loading && user) {
      const currentPath = window.location.pathname;
      const isAdminSection = currentPath.startsWith('/admin');
      
      console.log('useRequireAuth - Path:', currentPath, 'isAdmin:', isAdminSection, 'user:', user?.funcao);
      
      // For admin section, require admin access
      if (isAdminSection && user.funcao !== 'admin') {
        console.log('Unauthorized access to admin area. Redirecting to dashboard');
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, loading, navigate, redirectUrl]);

  return { 
    user, 
    loading, 
    isAdmin: user?.funcao === 'admin' 
  };
};
