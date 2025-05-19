
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Usuario } from '@/types/supabase.types';
import { Session } from '@supabase/supabase-js';

export const useAuthState = () => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [connectionError, setConnectionError] = useState<boolean>(false);

  useEffect(() => {
    console.log('Inicializando estado de autenticação');
    
    // Primeiro configuramos o listener de mudanças de estado
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Evento de autenticação:', event);
        setSession(currentSession);
        setUser(currentSession?.user as Usuario || null);
      }
    );
    
    // Depois verificamos a sessão atual
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user as Usuario || null);
      setLoading(false);
    }).catch(error => {
      console.error('Erro ao verificar sessão:', error);
      setConnectionError(true);
      setLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
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
