
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Usuario } from '@/types/supabase.types';

export const useAuthActions = (
  setLoading: (loading: boolean) => void,
  setUser: (user: Usuario | null) => void
) => {
  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      console.log('Tentativa de login com:', email);
      
      // Simulação de login - verificar se as credenciais são válidas
      // Para demonstração, permitimos qualquer login
      const mockUser: Usuario = {
        id: '1',
        email: email,
        nome: email.split('@')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Armazenar usuário no localStorage
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      
      // Definir o usuário no estado
      setUser(mockUser);
      
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

  const signUp = async (email: string, password: string, nome: string, telefone?: string): Promise<void> => {
    setLoading(true);
    try {
      console.log('Tentativa de cadastro com:', email);
      
      // Simulação de cadastro
      const mockUser: Usuario = {
        id: '1',
        email: email,
        nome: nome,
        telefone: telefone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Armazenar usuário no localStorage para simulação
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      
      // Definir o usuário no estado
      setUser(mockUser);
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Bem-vindo ao sistema!",
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
      console.log('Efetuando logout');
      
      // Remover usuário do localStorage
      localStorage.removeItem('mockUser');
      
      // Limpar o usuário no estado
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
      // Simulação de envio de e-mail para redefinição de senha
      console.log('Solicitação de redefinição de senha para:', email);
      
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
      // Simulação de atualização de senha
      console.log('Atualizando senha');
      
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
