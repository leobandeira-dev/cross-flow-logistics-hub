
import { supabase } from "@/integrations/supabase/client";
import { SignUpCredentials } from "./authTypes";

/**
 * Service for registration operations
 */
const registrationService = {
  /**
   * Cadastra um novo usuário
   */
  async signUp(credentials: SignUpCredentials) {
    console.log('RegistrationService: Attempting sign up with:', credentials.email);
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
      console.error('RegistrationService: Sign up error:', error);
      throw new Error(error.message);
    }

    console.log('RegistrationService: Sign up successful');
    return data;
  },
};

export default registrationService;
