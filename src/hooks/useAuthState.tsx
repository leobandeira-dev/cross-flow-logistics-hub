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
  const isMounted = useRef(true);

  // Set up auth state listeners and check current session
  useEffect(() => {
    console.log('Initializing auth state management');
    
    let authTimeout: NodeJS.Timeout | null = null;
    
    // First, set up the auth state change subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (!isMounted.current) return;
        
        console.log('Auth event detected:', event);
        
        if (currentSession) {
          setSession(currentSession);
          
          if (currentSession.user) {
            const userData = currentSession.user;
            console.log('User metadata:', userData.user_metadata);
            
            const usuarioData: Usuario = {
              id: userData.id,
              email: userData.email || '',
              nome: userData.user_metadata?.nome || 
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
            console.log('User updated from auth change event:', usuarioData);
          }
        } else {
          setUser(null);
          setSession(null);
          console.log('User is null from auth change event');
        }

        // Always mark auth as checked after an auth state change
        if (!authChecked) {
          setAuthChecked(true);
          setLoading(false);
        }
      }
    );
    
    // Then check for an existing session
    const initializeAuth = async () => {
      if (initialized.current) return;
      initialized.current = true;
      
      try {
        console.log('Checking for existing session...');
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!isMounted.current) return;
        
        if (currentSession) {
          setSession(currentSession);
          
          if (currentSession.user) {
            const userData = currentSession.user;
            console.log('User metadata from session:', userData.user_metadata);
            
            const usuarioData: Usuario = {
              id: userData.id,
              email: userData.email || '',
              nome: userData.user_metadata?.nome || 
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
            console.log('User initialized from session:', usuarioData);
          }
        } else {
          setUser(null);
          setSession(null);
          console.log('No active session found during initialization');
        }
      } catch (error) {
        if (!isMounted.current) return;
        console.error('Error checking session:', error);
        setConnectionError(true);
      } finally {
        if (isMounted.current) {
          setLoading(false);
          setAuthChecked(true);
          console.log('Auth initialization completed, marking as checked');
        }
      }
    };
    
    // Start the initialization
    initializeAuth();
    
    // Safety timeout to prevent stuck loading state
    authTimeout = setTimeout(() => {
      if (isMounted.current && loading) {
        console.log('Auth initialization safety timeout triggered');
        setLoading(false);
        setAuthChecked(true);
      }
    }, 3000);
    
    // Clean up
    return () => {
      isMounted.current = false;
      subscription.unsubscribe();
      
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
