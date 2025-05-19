
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useRequireAuth = (redirectUrl: string = '/auth') => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Only perform auth check once when loading is complete
    if (!loading && !authChecked) {
      const currentPath = window.location.pathname;
      const isAdminSection = currentPath.startsWith('/admin');
      
      console.log('useRequireAuth - Path:', currentPath, 'isAdmin:', isAdminSection, 'user:', !!user, 'authChecked:', authChecked);
      
      // Only redirect non-admin paths when user is not authenticated
      if (!user && !isAdminSection) {
        console.log('Redirecting to auth from:', currentPath);
        navigate(redirectUrl, { state: { from: currentPath } });
      }
      
      // Mark auth as checked to prevent future redirects
      setAuthChecked(true);
    }
  }, [user, loading, navigate, redirectUrl, authChecked]);

  return { user, loading };
};
