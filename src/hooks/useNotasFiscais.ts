
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { NotaFiscal } from '@/types/supabase/fiscal.types';
import { toast } from '@/hooks/use-toast';

export const useNotasFiscais = () => {
  const queryClient = useQueryClient();

  // Fetch all notas fiscais
  const { 
    data: notasFiscais = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['notas-fiscais'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notas_fiscais')
        .select(`
          *,
          remetente:empresas!remetente_id(*),
          destinatario:empresas!destinatario_id(*),
          transportadora:empresas!transportadora_id(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar notas fiscais:', error);
        throw new Error(error.message);
      }

      return data as NotaFiscal[];
    }
  });

  // Create nota fiscal mutation
  const createNotaFiscalMutation = useMutation({
    mutationFn: async (data: Partial<NotaFiscal>) => {
      const { data: newNota, error } = await supabase
        .from('notas_fiscais')
        .insert(data)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return newNota;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notas-fiscais'] });
      toast({
        title: "Sucesso",
        description: "Nota fiscal criada com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar nota fiscal",
        variant: "destructive",
      });
    }
  });

  // Update nota fiscal mutation
  const updateNotaFiscalMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<NotaFiscal> }) => {
      const { data: updatedNota, error } = await supabase
        .from('notas_fiscais')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return updatedNota;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notas-fiscais'] });
      toast({
        title: "Sucesso",
        description: "Nota fiscal atualizada com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar nota fiscal",
        variant: "destructive",
      });
    }
  });

  // Delete nota fiscal mutation
  const deleteNotaFiscalMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notas_fiscais')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notas-fiscais'] });
      toast({
        title: "Sucesso",
        description: "Nota fiscal excluída com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir nota fiscal",
        variant: "destructive",
      });
    }
  });

  return {
    notasFiscais,
    isLoading,
    error,
    refetch,
    createNotaFiscal: createNotaFiscalMutation.mutate,
    updateNotaFiscal: updateNotaFiscalMutation.mutate,
    deleteNotaFiscal: deleteNotaFiscalMutation.mutate,
    isCreating: createNotaFiscalMutation.isPending,
    isUpdating: updateNotaFiscalMutation.isPending,
    isDeleting: deleteNotaFiscalMutation.isPending
  };
};
