
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import authService from '@/services/auth';
import { Usuario } from '@/types/supabase.types';
import { Session } from '@supabase/supabase-js';

export const useAuthState = () => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [connectionError, setConnectionError] = useState<boolean>(false);

  useEffect(() => {
    console.log('Setting up auth state listener');
    let connectionTimeout: ReturnType<typeof setTimeout>;
    
    // Função para processar tokens da URL (convites, reset de senha, etc)
    const processUrlParams = async () => {
      // Verificar se há parâmetros de autenticação na URL (inclusive convites)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');
      
      if (accessToken && refreshToken) {
        console.log(`Encontrado token na URL, tipo: ${type}`);
        try {
          // Setar a sessão com os tokens da URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) throw error;
          
          // Limpar URL após processamento dos tokens
          window.history.replaceState(null, document.title, window.location.pathname);
          
          console.log('Sessão definida com sucesso a partir dos parâmetros da URL');
          return; // Não prosseguir, pois o onAuthStateChange será acionado
        } catch (error) {
          console.error('Erro ao processar tokens da URL:', error);
          setConnectionError(true);
        }
      }
    };
    
    // Processar parâmetros da URL primeiro
    processUrlParams();
    
    // Configurar o listener de mudanças de estado de autenticação primeiro
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event, newSession ? 'session exists' : 'no session');
      
      // Atualizar o estado da sessão imediatamente
      setSession(newSession);
      
      if (newSession) {
        // Imediatamente atualizar o estado de carregamento para mostrar que estamos trabalhando
        setLoading(true);
        
        try {
          console.log('Fetching user data after auth state change');
          const userData = await authService.getCurrentUser();
          console.log('User data fetched:', userData);
          setUser(userData);
          setConnectionError(false);
          clearTimeout(connectionTimeout);
        } catch (error) {
          console.error('Error fetching user data after state change:', error);
          setUser(null);
          setConnectionError(true);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('No session in auth state change, clearing user state');
        setUser(null);
        setLoading(false);
      }
    });

    // Verificar sessão existente
    const checkUser = async () => {
      try {
        console.log('Checking for existing session');
        
        // Set a timeout to detect connection issues
        connectionTimeout = setTimeout(() => {
          console.log('Connection timeout reached - setting connection error state');
          setConnectionError(true);
          setLoading(false);
        }, 5000); // 5 seconds timeout
        
        const { data: { session: existingSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setConnectionError(true);
          setUser(null);
          setSession(null);
          setLoading(false);
          return;
        }
        
        clearTimeout(connectionTimeout);
        
        if (existingSession) {
          console.log('Existing session found, fetching user data');
          setSession(existingSession);
          try {
            const userData = await authService.getCurrentUser();
            console.log('User data fetched for existing session:', userData);
            setUser(userData);
          } catch (userError) {
            console.error('Error fetching user data:', userError);
            setUser(null);
          }
        } else {
          console.log('No existing session found');
          setUser(null);
          setSession(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setConnectionError(true);
        setUser(null);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    return () => {
      console.log('Cleaning up auth listener');
      subscription.unsubscribe();
      clearTimeout(connectionTimeout);
    };
  }, []);

  return { user, session, setUser, loading, setLoading, connectionError };
};
