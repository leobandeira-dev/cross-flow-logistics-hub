
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UpdateProfileData {
  nome?: string;
  telefone?: string;
  avatar_url?: string;
}

export const useUpdateProfile = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = async (data: UpdateProfileData) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    setIsLoading(true);
    try {
      // Update user metadata in auth.users
      const { error: authUpdateError } = await supabase.auth.updateUser({
        data: {
          nome: data.nome,
          telefone: data.telefone
        }
      });

      if (authUpdateError) {
        throw authUpdateError;
      }

      // Update profile in usuarios table
      const { error: profileUpdateError } = await supabase
        .from('usuarios')
        .update({
          nome: data.nome,
          telefone: data.telefone,
          avatar_url: data.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileUpdateError) {
        throw profileUpdateError;
      }

      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateProfile,
    isLoading
  };
};
