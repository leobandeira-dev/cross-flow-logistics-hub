
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Usuario } from '@/types/supabase.types';
import { Session } from '@supabase/supabase-js';

export const useAuthState = () => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [connectionError, setConnectionError] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  useEffect(() => {
    console.log('Inicializando estado de autenticação');
    let isMounted = true;
    
    // Primeiro configurar a assinatura para mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Evento de autenticação:', event);
        
        if (!isMounted) return;

        if (currentSession) {
          setSession(currentSession);
          
          if (currentSession.user) {
            const userData = currentSession.user;
            const usuarioData: Usuario = {
              id: userData.id,
              email: userData.email || '',
              nome: userData.user_metadata?.nome || userData.user_metadata?.name || userData.email || '',
              telefone: userData.user_metadata?.telefone,
              avatar_url: userData.user_metadata?.avatar_url,
              empresa_id: userData.user_metadata?.empresa_id,
              perfil_id: userData.user_metadata?.perfil_id,
              status: userData.user_metadata?.status,
              created_at: userData.created_at || new Date().toISOString(),
              updated_at: userData.updated_at || new Date().toISOString(),
              funcao: userData.user_metadata?.funcao || 'operador'
            };
            
            setUser(usuarioData);
            console.log('User updated from auth change event:', usuarioData.funcao);
          }
        } else {
          setUser(null);
          setSession(null);
          console.log('User is null from auth change event');
        }
      }
    );
    
    // Então verificar a sessão atual
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!isMounted) return;

        if (currentSession) {
          setSession(currentSession);
          
          if (currentSession.user) {
            const userData = currentSession.user;
            const usuarioData: Usuario = {
              id: userData.id,
              email: userData.email || '',
              nome: userData.user_metadata?.nome || userData.user_metadata?.name || userData.email || '',
              telefone: userData.user_metadata?.telefone,
              avatar_url: userData.user_metadata?.avatar_url,
              empresa_id: userData.user_metadata?.empresa_id,
              perfil_id: userData.user_metadata?.perfil_id,
              status: userData.user_metadata?.status,
              created_at: userData.created_at || new Date().toISOString(),
              updated_at: userData.updated_at || new Date().toISOString(),
              funcao: userData.user_metadata?.funcao || 'operador'
            };
            
            setUser(usuarioData);
            console.log('User initialized from session:', usuarioData.funcao);
          }
        } else {
          setUser(null);
          setSession(null);
          console.log('No active session found during initialization');
        }
      } catch (error) {
        if (!isMounted) return;
        console.error('Erro ao verificar sessão:', error);
        setConnectionError(true);
      } finally {
        if (isMounted) {
          setLoading(false);
          setAuthChecked(true);
        }
      }
    };
    
    initializeAuth();
    
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { 
    user, 
    session, 
    setUser, 
    loading, 
    setLoading, 
    connectionError,
    authChecked 
  };
};
