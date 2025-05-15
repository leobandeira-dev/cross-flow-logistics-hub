
import { supabase } from "@/integrations/supabase/client";
import { Usuario } from "@/types/supabase.types";

export type SignInCredentials = {
  email: string;
  password: string;
};

export type SignUpCredentials = {
  email: string;
  password: string;
  nome: string;
  telefone?: string;
};

export type AuthSession = {
  user: {
    id: string;
    email: string;
  };
  session: {
    access_token: string;
    expires_at: number;
  };
};

const authService = {
  /**
   * Faz login do usuário
   */
  async signIn(credentials: SignInCredentials): Promise<AuthSession> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      user: {
        id: data.user?.id || '',
        email: data.user?.email || '',
      },
      session: {
        access_token: data.session?.access_token || '',
        expires_at: data.session?.expires_at || 0,
      },
    };
  },

  /**
   * Cadastra um novo usuário
   */
  async signUp(credentials: SignUpCredentials) {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          nome: credentials.nome,
          telefone: credentials.telefone,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  /**
   * Faz logout do usuário
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw new Error(error.message);
    }

    return true;
  },

  /**
   * Retorna o usuário atual
   */
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }
    
    // Buscar dados completos do usuário
    const { data: userData, error } = await supabase
      .from('usuarios')
      .select('*, empresa:empresa_id(*), perfil:perfil_id(*)')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }
    
    return userData as Usuario;
  },

  /**
   * Verifica se o usuário está autenticado
   */
  async isAuthenticated() {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  /**
   * Solicita redefinição de senha
   */
  async forgotPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      throw new Error(error.message);
    }

    return true;
  },

  /**
   * Atualiza senha do usuário
   */
  async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({
      password,
    });
    
    if (error) {
      throw new Error(error.message);
    }

    return true;
  },
};

export default authService;
