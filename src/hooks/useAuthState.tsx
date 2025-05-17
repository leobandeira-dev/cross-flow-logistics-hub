
import { useState, useEffect } from 'react';
import { Usuario } from '@/types/supabase.types';
import { Session } from '@supabase/supabase-js';

export const useAuthState = () => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<boolean>(false);

  // Simulação básica de autenticação para frontend sem backend
  useEffect(() => {
    console.log('Inicializando estado de autenticação (modo frontend)');
    
    // Verificar se há um usuário no localStorage
    const storedUser = localStorage.getItem('mockUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        console.log('Usuário recuperado do localStorage:', parsedUser);
      } catch (e) {
        console.error('Erro ao ler usuário do localStorage:', e);
        localStorage.removeItem('mockUser');
      }
    }
    
    setLoading(false);
  }, []);

  return { user, session, setUser, loading, setLoading, connectionError };
};
