
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
    console.log('AuthService: Attempting sign in with:', credentials.email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      console.error('AuthService: Sign in error:', error);
      throw new Error(error.message);
    }

    if (!data.user || !data.session) {
      console.error('AuthService: No user or session returned');
      throw new Error('Falha no login: Resposta inválida do servidor');
    }

    console.log('AuthService: Sign in successful, session:', data.session);

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
    console.log('AuthService: Attempting sign up with:', credentials.email);
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
      console.error('AuthService: Sign up error:', error);
      throw new Error(error.message);
    }

    console.log('AuthService: Sign up successful');
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
  async getCurrentUser(): Promise<Usuario | null> {
    console.log('AuthService: Checking current user');
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('AuthService: No authenticated user found');
      return null;
    }
    
    console.log('AuthService: User found, fetching additional data');
    
    try {
      // Buscar dados completos do usuário
      const { data: userData, error } = await supabase
        .from('usuarios')
        .select('*, empresa:empresa_id(*), perfil:perfil_id(*)')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('AuthService: Error fetching user data:', error);
        return null;
      }
      
      if (!userData) {
        console.log('AuthService: No user data found for ID:', user.id);
        return {
          id: user.id,
          email: user.email,
          nome: user.user_metadata?.nome || '',
          telefone: user.user_metadata?.telefone,
          created_at: user.created_at,
          updated_at: user.updated_at,
        } as Usuario;
      }
      
      console.log('AuthService: User data retrieved successfully:', userData);
      return userData as Usuario;
    } catch (error) {
      console.error('AuthService: Exception fetching user data:', error);
      return null;
    }
  },

  /**
   * Verifica se o usuário está autenticado
   */
  async isAuthenticated() {
    const { data: { session } } = await supabase.auth.getSession();
    console.log('AuthService: isAuthenticated check returned', !!session);
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
