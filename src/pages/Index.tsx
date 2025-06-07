
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const Index = () => {
  const { loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Index page - bypassing authentication checks');
    
    if (!loading) {
      // Always redirect to dashboard regardless of authentication status
      navigate('/dashboard', { replace: true });
    }
  }, [loading, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return null; // Will redirect to dashboard via useEffect
};

export default Index;
