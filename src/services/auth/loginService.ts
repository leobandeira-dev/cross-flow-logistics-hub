
import { supabase } from "@/integrations/supabase/client";
import { SignInCredentials, AuthSession } from "./authTypes";

/**
 * Service for login operations
 */
const loginService = {
  /**
   * Faz login do usuário
   */
  async signIn(credentials: SignInCredentials): Promise<AuthSession> {
    console.log('LoginService: Attempting sign in with:', credentials.email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      console.error('LoginService: Sign in error:', error);
      throw new Error(error.message);
    }

    if (!data.user || !data.session) {
      console.error('LoginService: No user or session returned');
      throw new Error('Falha no login: Resposta inválida do servidor');
    }

    console.log('LoginService: Sign in successful, session:', data.session);

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
};

export default loginService;
