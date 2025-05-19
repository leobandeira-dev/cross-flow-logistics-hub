
import { useAuthContext } from '@/contexts/AuthContext';

export const useAuth = () => {
  const auth = useAuthContext();
  
  // Debug log for user data
  console.log('useAuth hook called, returning user data:', { 
    userId: auth.user?.id,
    userEmail: auth.user?.email,
    userRole: auth.user?.funcao,
    isAdmin: auth.user?.funcao === 'admin',
    authChecked: auth.authChecked
  });
  
  return auth;
};
