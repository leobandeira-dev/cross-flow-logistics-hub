
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const Index = () => {
  const { authChecked, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirection logic based on authentication status
    if (authChecked) {
      console.log('Index page - Authentication check completed');
      
      try {
        // If authenticated, go to dashboard, otherwise stay on landing page
        if (user) {
          console.log('User is authenticated, redirecting to dashboard');
          navigate('/dashboard', { replace: true });
        } else {
          console.log('User is not authenticated, showing landing page');
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Error during navigation:', error);
        // Fallback for navigation errors
        if (window.location.hostname.includes('lovableproject.com') || 
            window.location.hostname.includes('lovable.app')) {
          window.location.hash = user ? 'dashboard' : '';
        } else {
          window.location.href = user ? '/dashboard' : '/';
        }
      }
    }
  }, [authChecked, navigate, user]);

  // Show loading while checking authentication
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p className="ml-3 text-gray-600">Redirecionando...</p>
    </div>
  );
};

export default Index;
