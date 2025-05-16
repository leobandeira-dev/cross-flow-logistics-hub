
import { supabase } from "@/integrations/supabase/client";
import { Usuario } from "@/types/supabase.types";

/**
 * Service for user-related operations
 */
const userService = {
  /**
   * Retorna o usuário atual
   */
  async getCurrentUser(): Promise<Usuario | null> {
    console.log('UserService: Checking current user');
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('UserService: No authenticated user found');
      return null;
    }
    
    console.log('UserService: User found, fetching additional data');
    
    try {
      // Buscar dados completos do usuário
      const { data: userData, error } = await supabase
        .from('usuarios')
        .select('*, empresa:empresa_id(*), perfil:perfil_id(*)')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('UserService: Error fetching user data:', error);
        // Se houver erro na consulta, ainda retornamos os dados básicos do usuário
        return {
          id: user.id,
          email: user.email,
          nome: user.user_metadata?.nome || '',
          telefone: user.user_metadata?.telefone,
          created_at: user.created_at,
          updated_at: user.updated_at,
        } as Usuario;
      }
      
      if (!userData) {
        console.log('UserService: No user data found for ID:', user.id);
        // Se não encontrar o perfil no banco, criamos um registro básico em memória
        return {
          id: user.id,
          email: user.email,
          nome: user.user_metadata?.nome || '',
          telefone: user.user_metadata?.telefone,
          created_at: user.created_at,
          updated_at: user.updated_at,
        } as Usuario;
      }
      
      console.log('UserService: User data retrieved successfully:', userData);
      return userData as Usuario;
    } catch (error) {
      console.error('UserService: Exception fetching user data:', error);
      // Em caso de erro, retornamos os dados básicos do usuário
      return {
        id: user.id,
        email: user.email,
        nome: user.user_metadata?.nome || '',
        telefone: user.user_metadata?.telefone,
        created_at: user.created_at,
        updated_at: user.updated_at,
      } as Usuario;
    }
  },
};

export default userService;
