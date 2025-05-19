
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
  
  // Control initialization
  const initialized = useRef(false);
  const isMounted = useRef(true);

  useEffect(() => {
    console.log('Inicializando gerenciamento de estado de autenticação');
    
    let authTimeout: NodeJS.Timeout | null = null;
    
    // First, set up auth state change subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!isMounted.current) return;
        
        console.log('Evento de autenticação detectado:', event);
        
        // Update session state
        setSession(currentSession);
        
        // Update user state if we have a session
        if (currentSession?.user) {
          const userData = currentSession.user;
          console.log('Metadados do usuário:', userData.user_metadata);
          
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
          setLoading(false);
          setAuthChecked(true);
        } else {
          // Clear user state if no session
          setUser(null);
          setLoading(false);
          setAuthChecked(true);
        }
      }
    );
    
    // Then check for existing session
    const initializeAuth = async () => {
      if (initialized.current) return;
      initialized.current = true;
      
      try {
        console.log('Verificando sessão existente...');
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!isMounted.current) return;
        
        if (currentSession) {
          setSession(currentSession);
          
          if (currentSession.user) {
            const userData = currentSession.user;
            console.log('Metadados do usuário da sessão:', userData.user_metadata);
            
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
          }
        }
      } catch (error) {
        if (!isMounted.current) return;
        console.error('Erro ao verificar sessão:', error);
        setConnectionError(true);
      } finally {
        if (isMounted.current) {
          setLoading(false);
          setAuthChecked(true);
        }
      }
    };
    
    // Start initialization
    initializeAuth();
    
    // Safety timeout to prevent stuck loading state
    authTimeout = setTimeout(() => {
      if (isMounted.current && loading) {
        console.log('Timeout de segurança de inicialização de autenticação acionado');
        setLoading(false);
        setAuthChecked(true);
      }
    }, 3000);
    
    // Cleanup
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
