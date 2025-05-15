
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
    console.log('Attempting sign in with:', credentials.email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      console.error('Sign in error:', error);
      throw new Error(error.message);
    }

    if (!data.user || !data.session) {
      console.error('No user or session returned');
      throw new Error('Falha no login: Resposta inválida do servidor');
    }

    console.log('Sign in successful, session:', data.session);

    return {
      user: {
        id: data.user.id,
        email: data.user.email || '',
      },
      session: {
        access_token: data.session.access_token,
        expires_at: data.session.expires_at,
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
    console.log('Attempting to sign out');
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Sign out error:', error);
      throw new Error(error.message);
    }

    console.log('Sign out successful');
    return true;
  },

  /**
   * Retorna o usuário atual
   */
  async getCurrentUser() {
    console.log('Checking current user');
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('No authenticated user found');
      return null;
    }
    
    console.log('User found, fetching additional data');
    
    // Buscar dados completos do usuário
    const { data: userData, error } = await supabase
      .from('usuarios')
      .select('*, empresa:empresa_id(*), perfil:perfil_id(*)')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
    
    console.log('User data retrieved successfully');
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
