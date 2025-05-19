
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useRequireAuth = (redirectUrl: string = '/auth') => {
  const { user, loading, authChecked } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [localAuthChecked, setLocalAuthChecked] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    // Safety timeout to prevent stuck states
    timer = setTimeout(() => {
      if (!localAuthChecked) {
        console.log('useRequireAuth - Safety timeout triggered');
        setLocalAuthChecked(true);
      }
    }, 2000);
    
    // Only proceed when loading is complete and auth has been checked
    if (!loading && authChecked && !localAuthChecked) {
      console.log('useRequireAuth - Auth check completed, checking access. User:', !!user);
      setLocalAuthChecked(true);
      
      if (!user) {
        const currentPath = location.pathname;
        console.log('useRequireAuth - No user detected. Redirecting to auth from:', currentPath);
        navigate(redirectUrl, { state: { from: currentPath }, replace: true });
        return;
      }
      
      // Special handling for admin routes when user is authenticated
      const currentPath = location.pathname;
      const isAdminSection = currentPath.startsWith('/admin');
      
      console.log('useRequireAuth - Path:', currentPath, 'isAdmin:', isAdminSection, 'user role:', user?.funcao);
      
      // For admin section, require admin access
      if (isAdminSection && user.funcao !== 'admin') {
        console.log('Unauthorized access to admin area. Redirecting to dashboard');
        navigate('/dashboard', { replace: true });
      }
    }
    
    return () => clearTimeout(timer);
  }, [user, loading, navigate, redirectUrl, localAuthChecked, authChecked, location]);

  return { 
    user, 
    loading, 
    isAdmin: user?.funcao === 'admin',
    authChecked: localAuthChecked && authChecked
  };
};
