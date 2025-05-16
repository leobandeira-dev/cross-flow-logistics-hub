
import { supabase } from "@/integrations/supabase/client";

/**
 * Service for password-related operations
 */
const passwordService = {
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

export default passwordService;
