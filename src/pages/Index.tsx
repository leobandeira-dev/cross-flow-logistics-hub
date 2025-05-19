
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const Index = () => {
  const { user, loading, authChecked } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || !authChecked) return;
    
    console.log('Index page - Auth check completed, redirecting based on auth state');
    
    if (user) {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/auth', { replace: true });
    }
  }, [user, loading, authChecked, navigate]);

  // Show loading while checking auth
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <p className="ml-3 text-gray-600">Redirecionando...</p>
    </div>
  );
};

export default Index;
