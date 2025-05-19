
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useRequireAuth = (redirectUrl: string = '/auth') => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Only execute redirect logic after initial loading is complete
    if (!loading) {
      // Set initial load to false after first check
      if (isInitialLoad) {
        const currentPath = window.location.pathname;
        const isAdminSection = currentPath.startsWith('/admin');
        
        console.log('useRequireAuth - Path:', currentPath, 'isAdmin:', isAdminSection, 'user:', !!user, 'isInitialLoad:', isInitialLoad);
        
        // For admin routes or when user is authenticated, don't redirect
        if (!user && !isAdminSection) {
          navigate(redirectUrl, { state: { from: currentPath } });
        }
        
        // Mark initial load as complete
        setIsInitialLoad(false);
      }
    }
  }, [user, loading, navigate, redirectUrl, isInitialLoad]);

  return { user, loading };
};
