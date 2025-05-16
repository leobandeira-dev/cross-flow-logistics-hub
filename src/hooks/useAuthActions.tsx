
import { useState } from 'react';
import authService from '@/services/auth';
import { toast } from '@/hooks/use-toast';

export const useAuthActions = (
  setLoading: (loading: boolean) => void,
) => {
  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      console.log('Attempting to sign in with:', email);
      await authService.signIn({ email, password });
      console.log('Sign in successful in useAuth');
      
      // We'll let the onAuthStateChange listener update the user state
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo de volta!",
      });
      
      // Important: don't set loading to false here as the auth state change will do it
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      toast({
        title: "Erro ao fazer login",
        description: error?.message || "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
      setLoading(false); // Set loading to false on error
      throw error;
    }
  };

  const signUp = async (email: string, password: string, nome: string, telefone?: string): Promise<void> => {
    setLoading(true);
    try {
      console.log('Attempting to sign up with:', email);
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
      console.log('Attempting to sign out');
      await authService.signOut();
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

  const updatePassword = async (password: string) => {
    try {
      await authService.updatePassword(password);
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao atualizar senha:', error);
      toast({
        title: "Erro ao atualizar senha",
        description: error?.message || "Ocorreu um erro ao atualizar sua senha.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    forgotPassword,
    updatePassword
  };
};
