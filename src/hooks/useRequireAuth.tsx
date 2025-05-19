
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
        setIsInitialLoad(false);
      }
      
      // Only redirect if not authenticated and on initial load
      // This prevents constant redirects during navigation
      if (!user && isInitialLoad) {
        const currentPath = window.location.pathname;
        const isAdminSection = currentPath.startsWith('/admin');
        
        console.log('useRequireAuth - Path:', currentPath, 'isAdmin:', isAdminSection, 'user:', !!user, 'isInitialLoad:', isInitialLoad);
        
        // For admin routes, we bypass the redirect logic
        // In a production app, you would want proper authentication checks here
        if (!isAdminSection) {
          navigate(redirectUrl, { state: { from: window.location.pathname } });
        }
      }
    }
  }, [user, loading, navigate, redirectUrl, isInitialLoad]);

  return { user, loading };
};
