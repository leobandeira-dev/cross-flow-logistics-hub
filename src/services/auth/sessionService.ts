
import { supabase } from "@/integrations/supabase/client";

/**
 * Service for handling authentication sessions
 */
const sessionService = {
  /**
   * Verifica se o usuário está autenticado
   */
  async isAuthenticated() {
    const { data: { session } } = await supabase.auth.getSession();
    console.log('SessionService: isAuthenticated check returned', !!session);
    return !!session;
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
};

export default sessionService;
