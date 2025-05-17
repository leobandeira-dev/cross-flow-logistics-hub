
import { supabase } from "@/integrations/supabase/client";
import { SignUpCredentials } from "./authTypes";

/**
 * Service for registration operations - frontend only mock
 */
const registrationService = {
  /**
   * Cadastra um novo usuário
   */
  async signUp(credentials: SignUpCredentials) {
    console.log('RegistrationService: Mocking sign up with:', credentials.email);
    
    // In frontend-only mode, return mock data
    return {
      user: {
        id: 'mock-new-user-id',
        email: credentials.email,
        user_metadata: {
          nome: credentials.nome,
          telefone: credentials.telefone
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      session: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_at: Date.now() + 3600000 // 1 hour from now
      }
    };
  },
};

export default registrationService;
