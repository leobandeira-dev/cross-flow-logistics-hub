
import { supabase } from "@/integrations/supabase/client";
import { Usuario } from "@/types/supabase/usuario.types";

export interface UserWithProfile {
  id: string;
  nome: string;
  email: string;
  perfil: string;
  avatar_url?: string;
}

/**
 * Fetches all users with their profiles from Supabase
 */
export const fetchUsers = async (): Promise<UserWithProfile[]> => {
  // Use the 'perfis' table which contains all user profiles
  const { data, error } = await supabase
    .from('perfis')
    .select(`
      id,
      nome,
      email,
      funcao,
      avatar_url
    `);

  if (error) {
    console.error('Error fetching users:', error);
    throw error;
  }

  // Ensure we get data back
  if (!data) {
    console.log('No users found');
    return [];
  }

  console.log('Fetched users:', data.length);

  return data.map(user => ({
    id: user.id,
    nome: user.nome,
    email: user.email,
    perfil: user.funcao || 'N/A',
    avatar_url: user.avatar_url
  }));
};

/**
 * Checks if the current user has permission to manage user permissions
 * Only admins and managers can manage permissions
 */
export const hasPermissionManagement = (userRole?: string): boolean => {
  const allowedRoles = ['Administrador', 'Gerente', 'admin', 'gerente', 'administrador'];
  return allowedRoles.includes(userRole || '');
};
