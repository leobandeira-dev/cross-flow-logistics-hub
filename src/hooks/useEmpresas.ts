
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Empresa } from '@/types/supabase/empresa.types';
import { toast } from '@/hooks/use-toast';

export const useEmpresas = () => {
  const queryClient = useQueryClient();

  // Fetch all empresas
  const { 
    data: empresas = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['empresas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .order('razao_social', { ascending: true });

      if (error) {
        console.error('Erro ao buscar empresas:', error);
        throw new Error(error.message);
      }

      return data as Empresa[];
    }
  });

  // Create empresa mutation
  const createEmpresaMutation = useMutation({
    mutationFn: async (data: Partial<Empresa>) => {
      const { data: newEmpresa, error } = await supabase
        .from('empresas')
        .insert(data)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return newEmpresa;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      toast({
        title: "Sucesso",
        description: "Empresa criada com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar empresa",
        variant: "destructive",
      });
    }
  });

  // Update empresa mutation
  const updateEmpresaMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Empresa> }) => {
      const { data: updatedEmpresa, error } = await supabase
        .from('empresas')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return updatedEmpresa;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      toast({
        title: "Sucesso",
        description: "Empresa atualizada com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar empresa",
        variant: "destructive",
      });
    }
  });

  // Delete empresa mutation
  const deleteEmpresaMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('empresas')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      toast({
        title: "Sucesso",
        description: "Empresa excluída com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir empresa",
        variant: "destructive",
      });
    }
  });

  return {
    empresas,
    isLoading,
    error,
    refetch,
    createEmpresa: createEmpresaMutation.mutate,
    updateEmpresa: updateEmpresaMutation.mutate,
    deleteEmpresa: deleteEmpresaMutation.mutate,
    isCreating: createEmpresaMutation.isPending,
    isUpdating: updateEmpresaMutation.isPending,
    isDeleting: deleteEmpresaMutation.isPending
  };
};
