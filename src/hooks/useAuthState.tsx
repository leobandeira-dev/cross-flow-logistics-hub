
import { useState, useEffect } from 'react';
import { Usuario } from '@/types/supabase.types';
import { Session } from '@supabase/supabase-js';

export const useAuthState = () => {
  // Create a mock user to bypass authentication
  const mockUser: Usuario = {
    id: '1',
    email: 'usuario@exemplo.com',
    nome: 'Usuário Padrão',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  const [user, setUser] = useState<Usuario | null>(mockUser);
  const [session, setSession] = useState<Session | null>({
    access_token: 'mock-access-token',
    expires_at: Date.now() + 3600000, // 1 hour from now
    user: mockUser
  } as any);
  const [loading, setLoading] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<boolean>(false);

  // No need to check for stored user since we're always using the mock user
  useEffect(() => {
    console.log('Initializing authentication state (frontend mode - bypassing authentication)');
    setLoading(false);
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
