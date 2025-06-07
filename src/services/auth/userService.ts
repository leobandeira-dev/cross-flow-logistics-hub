
import { supabase } from "@/integrations/supabase/client";

/**
 * Service for user-related operations - now using real Supabase data
 */
const userService = {
  /**
   * Retorna o usuário atual do Supabase
   */
  async getCurrentUser() {
    console.log('UserService: Checking current user from Supabase');
    
    try {
      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('UserService: Error getting session:', sessionError);
        return null;
      }

      if (!session?.user) {
        console.log('UserService: No authenticated user found');
        return null;
      }

      // Get user profile data
      const { data: profile, error: profileError } = await supabase
        .from('perfis')
        .select(`
          id,
          nome,
          email,
          funcao,
          empresa_id,
          empresa:empresas(
            id,
            razao_social,
            nome_fantasia,
            cnpj
          )
        `)
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error('UserService: Error fetching user profile:', profileError);
        return null;
      }

      console.log('UserService: User profile found:', profile);
      return profile;
    } catch (error) {
      console.error('UserService: Unexpected error:', error);
      return null;
    }
  },
};

export default userService;
