
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useRequireAuth = (redirectUrl: string = '/auth') => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Only check authentication on initial load
    if (!loading && isInitialLoad) {
      const currentPath = window.location.pathname;
      const isAdminSection = currentPath.startsWith('/admin');
      
      console.log('useRequireAuth - Path:', currentPath, 'isAdmin:', isAdminSection, 'user:', !!user);
      
      // Don't redirect admin routes regardless of auth status
      // For non-admin routes, only redirect if user is not authenticated
      if (!user && !isAdminSection) {
        console.log('Redirecting to auth from:', currentPath);
        navigate(redirectUrl, { state: { from: currentPath } });
      }
      
      // Mark initial load as complete after first auth check
      setIsInitialLoad(false);
    }
  }, [user, loading, navigate, redirectUrl, isInitialLoad]);

  return { user, loading };
};
