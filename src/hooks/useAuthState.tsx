
import { useState, useEffect, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Usuario } from '@/types/supabase.types';
import { Session } from '@supabase/supabase-js';

export const useAuthState = () => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [connectionError, setConnectionError] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  
  // Keep track of initialization
  const initialized = useRef(false);

  // Set up auth state listeners and check current session
  useEffect(() => {
    console.log('Initializing auth state management');
    
    let isMounted = true;
    let initTimeout: NodeJS.Timeout | null = null;
    let authTimeout: NodeJS.Timeout | null = null;
    
    // Safety timeout to prevent stuck loading state
    initTimeout = setTimeout(() => {
      if (isMounted && loading) {
        console.log('Auth initialization safety timeout triggered');
        setLoading(false);
        if (!authChecked) setAuthChecked(true);
      }
    }, 3000);

    // First, set up the auth state change subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!isMounted) return;
        
        console.log('Evento de autenticação:', event);
        
        if (currentSession) {
          setSession(currentSession);
          
          if (currentSession.user) {
            const userData = currentSession.user;
            const usuarioData: Usuario = {
              id: userData.id,
              email: userData.email || '',
              nome: userData.user_metadata?.nome || 
                   userData.user_metadata?.nome || 
                   userData.user_metadata?.name || 
                   userData.email || '',
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
        
        // Don't mark as checked from events since session might still be initializing
      }
    );
    
    // Then check for an existing session
    const initializeAuth = async () => {
      if (initialized.current) return;
      initialized.current = true;
      
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
              nome: userData.user_metadata?.nome || 
                   userData.user_metadata?.nome || 
                   userData.user_metadata?.name || 
                   userData.email || '',
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
          
          // Allow a small delay to ensure all state updates are processed
          authTimeout = setTimeout(() => {
            if (isMounted && !authChecked) {
              console.log('Auth initialization completed, marking as checked');
              setAuthChecked(true);
            }
          }, 100);
        }
      }
    };
    
    // Start the initialization
    initializeAuth();
    
    // Clean up
    return () => {
      isMounted = false;
      subscription.unsubscribe();
      
      if (initTimeout) clearTimeout(initTimeout);
      if (authTimeout) clearTimeout(authTimeout);
    };
  }, []);

  return { 
    user, 
    session, 
    setUser, 
    loading, 
    setLoading, 
    connectionError,
    authChecked,
    setAuthChecked
  };
};
