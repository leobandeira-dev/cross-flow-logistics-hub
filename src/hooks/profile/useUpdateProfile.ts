
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface UpdateProfileData {
  nome?: string;
  telefone?: string;
  avatar_url?: string;
}

export const useUpdateProfile = () => {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = async (data: UpdateProfileData) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    setIsLoading(true);
    try {
      // Atualizar o perfil no Supabase
      const { error } = await supabase
        .from('perfis')
        .update({
          nome: data.nome,
          telefone: data.telefone,
          avatar_url: data.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Erro ao atualizar perfil:', error);
        throw error;
      }

      // Atualizar o usuário no contexto de autenticação
      const updatedUser = {
        ...user,
        nome: data.nome || user.nome,
        telefone: data.telefone || user.telefone || '',
        avatar_url: data.avatar_url || user.avatar_url || '',
        updated_at: new Date().toISOString()
      };
      
      setUser(updatedUser);
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso."
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro ao atualizar suas informações.",
        variant: "destructive"
      });
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
