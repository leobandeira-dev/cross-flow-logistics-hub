
import { useNavigate, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Index page - checking auth state: user:', !!user, 'loading:', loading);
    
    if (!loading) {
      if (user) {
        console.log('User authenticated on Index page, redirecting to dashboard');
        navigate('/dashboard', { replace: true });
      } else {
        console.log('User not authenticated on Index page, redirecting to landing page');
        navigate('/', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  // Immediate redirect if state is already determined
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />;
};

export default Index;
