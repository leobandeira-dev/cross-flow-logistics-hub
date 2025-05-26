
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotaFiscal } from '@/types/supabase/fiscal.types';
import { toast } from '@/hooks/use-toast';
import { 
  buscarNotasFiscais, 
  buscarNotaFiscalPorId,
  criarNotaFiscal,
  atualizarNotaFiscal,
  excluirNotaFiscal
} from '@/services/notaFiscal';

export const useNotasFiscais = (filtros?: {
  status?: string;
  tipo?: string;
  dataInicio?: string;
  dataFim?: string;
}) => {
  const queryClient = useQueryClient();

  // Fetch all notas fiscais
  const { 
    data: notasFiscais = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['notas-fiscais', filtros],
    queryFn: () => buscarNotasFiscais(filtros),
    retry: 3,
    retryDelay: 1000
  });

  // Create nota fiscal mutation
  const createNotaFiscalMutation = useMutation({
    mutationFn: criarNotaFiscal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notas-fiscais'] });
      toast({
        title: "Sucesso",
        description: "Nota fiscal criada com sucesso!",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao criar nota fiscal:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar nota fiscal",
        variant: "destructive",
      });
    }
  });

  // Update nota fiscal mutation
  const updateNotaFiscalMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<NotaFiscal> }) => 
      atualizarNotaFiscal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notas-fiscais'] });
      toast({
        title: "Sucesso",
        description: "Nota fiscal atualizada com sucesso!",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar nota fiscal:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar nota fiscal",
        variant: "destructive",
      });
    }
  });

  // Delete nota fiscal mutation
  const deleteNotaFiscalMutation = useMutation({
    mutationFn: excluirNotaFiscal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notas-fiscais'] });
      toast({
        title: "Sucesso",
        description: "Nota fiscal excluída com sucesso!",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao excluir nota fiscal:', error);
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
