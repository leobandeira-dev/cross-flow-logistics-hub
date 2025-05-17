
import { supabase } from "@/integrations/supabase/client";
import { SignInCredentials, AuthSession } from "./authTypes";

/**
 * Service for login operations - frontend only mock
 */
const loginService = {
  /**
   * Faz login do usuário
   */
  async signIn(credentials: SignInCredentials): Promise<AuthSession> {
    console.log('LoginService: Attempting sign in with:', credentials.email);
    
    // In frontend-only mode, just simulate a successful login
    return {
      user: {
        id: 'mock-user-id',
        email: credentials.email,
      },
      session: {
        access_token: 'mock-access-token',
        expires_at: Date.now() + 3600000, // 1 hour from now
      },
    };
  },
};

export default loginService;
