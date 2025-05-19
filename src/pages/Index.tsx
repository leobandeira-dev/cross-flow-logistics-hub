
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const Index = () => {
  const { user, authChecked } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect when auth check is complete
    if (authChecked) {
      if (!user) {
        console.log('Index page - No authenticated user, staying on dashboard');
        navigate('/dashboard', { replace: true });
      } else {
        // User is authenticated, check if we're already on dashboard
        if (window.location.pathname === '/index') {
          console.log('Index page - User authenticated, navigating to dashboard');
          navigate('/dashboard', { replace: true });
        }
      }
    }
  }, [user, authChecked, navigate]);

  // Show loading while checking auth
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p className="ml-3 text-gray-600">Redirecionando...</p>
    </div>
  );
};

export default Index;
