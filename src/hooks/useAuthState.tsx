
import { useState, useEffect } from 'react';
import { Usuario } from '@/types/supabase.types';
import { Session } from '@supabase/supabase-js';

export const useAuthState = () => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [connectionError, setConnectionError] = useState<boolean>(false);

  // Check for saved user in localStorage on component mount
  useEffect(() => {
    console.log('Initializing authentication state (frontend mode)');
    
    try {
      // Check for stored user data
      const storedUser = localStorage.getItem('mockUser');
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log('User recovered from localStorage:', parsedUser);
        setUser(parsedUser);
        
        // Create a mock session
        const mockSession = {
          access_token: 'mock-access-token',
          expires_at: Date.now() + 3600000, // 1 hour from now
          user: parsedUser
        };
        
        setSession(mockSession as any);
      } else {
        console.log('No stored user found in localStorage');
      }
    } catch (e) {
      console.error('Error reading user from localStorage:', e);
      localStorage.removeItem('mockUser');
      setConnectionError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  return { 
    user, 
    session, 
    setUser, 
    loading, 
    setLoading, 
    connectionError 
  };
};
