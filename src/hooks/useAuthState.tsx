
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
  
  // Controlar inicialização
  const initialized = useRef(false);
  const isMounted = useRef(true);

  // Configurar ouvintes de estado de autenticação e verificar sessão atual
  useEffect(() => {
    console.log('Inicializando gerenciamento de estado de autenticação');
    
    let authTimeout: NodeJS.Timeout | null = null;
    
    // Primeiro, configurar a assinatura de alteração de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (!isMounted.current) return;
        
        console.log('Evento de autenticação detectado:', event);
        
        if (currentSession) {
          setSession(currentSession);
          
          if (currentSession.user) {
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
            console.log('Usuário atualizado a partir do evento de alteração de autenticação:', usuarioData);
          }
        } else {
          setUser(null);
          setSession(null);
          console.log('Usuário é nulo a partir do evento de alteração de autenticação');
        }

        // Sempre marcar a autenticação como verificada após uma alteração de estado de autenticação
        if (!authChecked) {
          setAuthChecked(true);
          setLoading(false);
        }
      }
    );
    
    // Em seguida, verificar se há uma sessão existente
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
            console.log('Usuário inicializado a partir da sessão:', usuarioData);
          }
        } else {
          setUser(null);
          setSession(null);
          console.log('Nenhuma sessão ativa encontrada durante a inicialização');
        }
      } catch (error) {
        if (!isMounted.current) return;
        console.error('Erro ao verificar sessão:', error);
        setConnectionError(true);
      } finally {
        if (isMounted.current) {
          setLoading(false);
          setAuthChecked(true);
          console.log('Inicialização de autenticação concluída, marcando como verificada');
        }
      }
    };
    
    // Iniciar a inicialização
    initializeAuth();
    
    // Timeout de segurança para evitar estado de carregamento travado
    authTimeout = setTimeout(() => {
      if (isMounted.current && loading) {
        console.log('Timeout de segurança de inicialização de autenticação acionado');
        setLoading(false);
        setAuthChecked(true);
      }
    }, 3000);
    
    // Limpeza
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
