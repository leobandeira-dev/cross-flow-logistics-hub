
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
      
      // Special handling for admin routes
      const isAdminSection = currentPath.startsWith('/admin');
      
      console.log('useRequireAuth - Path:', currentPath, 'isAdmin:', isAdminSection, 'user:', user?.funcao, 'authChecked:', authChecked);
      
      // For admin section, require admin access
      if (isAdminSection) {
        // Only allow users with 'admin' function to access admin routes
        if (!user || user.funcao !== 'admin') {
          console.log('Unauthorized access to admin area. Redirecting to dashboard');
          navigate('/dashboard', { replace: true });
        }
      }
      // For non-admin routes, simply require authentication
      else if (!user) {
        console.log('Redirecting to auth from:', currentPath);
        navigate(redirectUrl, { state: { from: currentPath } });
      }
      
      // Mark auth as checked to prevent future redirects
      setAuthChecked(true);
    }
  }, [user, loading, navigate, redirectUrl, authChecked]);

  return { user, loading, isAdmin: user?.funcao === 'admin' };
};
