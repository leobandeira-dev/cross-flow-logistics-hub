
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import authService from '@/services/authService';
import { Usuario } from '@/types/supabase.types';
import { toast } from '@/hooks/use-toast';

type AuthContextType = {
  user: Usuario | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, nome: string, telefone?: string) => Promise<void>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'SIGNED_IN' && session) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          console.log('User data fetched after sign in:', userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        console.log('User signed out');
      }
    });

    // Then check for existing session
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('Existing session found');
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } else {
          console.log('No session found');
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Call the signIn method but don't return its result directly
      await authService.signIn({ email, password });
      console.log('Sign in successful');
      
      // We don't need to set user here as it will be handled by the onAuthStateChange listener
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });
      
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      toast({
        title: "Erro ao fazer login",
        description: error?.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, nome: string, telefone?: string) => {
    setLoading(true);
    try {
      await authService.signUp({ email, password, nome, telefone });
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Verifique seu e-mail para confirmar o cadastro.",
      });
    } catch (error: any) {
      console.error('Erro ao fazer cadastro:', error);
      toast({
        title: "Erro ao fazer cadastro",
        description: error?.message || "Verifique os dados informados e tente novamente.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado do sistema.",
      });
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      toast({
        title: "Erro ao fazer logout",
        description: error?.message || "Ocorreu um erro ao desconectar.",
        variant: "destructive",
      });
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      await authService.forgotPassword(email);
      toast({
        title: "E-mail enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    } catch (error: any) {
      console.error('Erro ao solicitar redefinição de senha:', error);
      toast({
        title: "Erro ao solicitar redefinição",
        description: error?.message || "Verifique o e-mail informado e tente novamente.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
