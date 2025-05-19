
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useRequireAuth = (redirectUrl: string = '/dashboard') => {
  const { user, loading, authChecked } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Exit early if still loading or in preview environment with location restrictions
    if (loading) return;
    
    try {
      // Skip redirect if not authenticated but check is complete
      if (!loading && authChecked && !user) {
        const currentPath = location.pathname;
        console.log('useRequireAuth - No authenticated user detected. Redirecting from:', currentPath);
        
        // Use replace to avoid building up history stack
        navigate(redirectUrl, { 
          state: { from: currentPath }, 
          replace: true 
        });
        return;
      }
      
      // If the user is authenticated, check access to admin section
      if (!loading && authChecked && user) {
        const currentPath = location.pathname;
        const isAdminSection = currentPath.startsWith('/admin');
        
        // For admin section, require admin access
        if (isAdminSection && user.funcao !== 'admin') {
          console.log('Unauthorized access to admin section. Redirecting to dashboard');
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (error) {
      console.error('Navigation error in useRequireAuth:', error);
      // In case of error, fallback to simpler approach
      window.location.href = redirectUrl;
    }
  }, [user, loading, authChecked, navigate, redirectUrl, location.pathname]);

  return { 
    user, 
    loading, 
    isAdmin: user?.funcao === 'admin',
    authChecked
  };
};
