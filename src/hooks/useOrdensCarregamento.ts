
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { OrdemCarregamento } from '@/types/supabase.types';
import { toast } from '@/hooks/use-toast';
import {
  buscarOrdensCarregamento,
  criarOrdemCarregamento,
  atualizarOrdemCarregamento,
  excluirOrdemCarregamento
} from '@/services/carregamento/ordemCarregamentoService';

export const useOrdensCarregamento = (filtros?: {
  status?: string;
  tipo?: string;
  dataInicio?: string;
  dataFim?: string;
}) => {
  const queryClient = useQueryClient();

  // Fetch all ordens de carregamento
  const { 
    data: ordensCarregamento = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['ordens-carregamento', filtros],
    queryFn: () => buscarOrdensCarregamento(filtros),
    retry: 3,
    retryDelay: 1000
  });

  // Create ordem de carregamento mutation
  const createOrdemMutation = useMutation({
    mutationFn: criarOrdemCarregamento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordens-carregamento'] });
      toast({
        title: "Sucesso",
        description: "Ordem de carregamento criada com sucesso!",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao criar ordem de carregamento:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar ordem de carregamento",
        variant: "destructive",
      });
    }
  });

  // Update ordem de carregamento mutation
  const updateOrdemMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<OrdemCarregamento> }) => 
      atualizarOrdemCarregamento(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordens-carregamento'] });
      toast({
        title: "Sucesso",
        description: "Ordem de carregamento atualizada com sucesso!",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar ordem de carregamento:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar ordem de carregamento",
        variant: "destructive",
      });
    }
  });

  // Delete ordem de carregamento mutation
  const deleteOrdemMutation = useMutation({
    mutationFn: excluirOrdemCarregamento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordens-carregamento'] });
      toast({
        title: "Sucesso",
        description: "Ordem de carregamento excluída com sucesso!",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao excluir ordem de carregamento:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir ordem de carregamento",
        variant: "destructive",
      });
    }
  });

  return {
    ordensCarregamento,
    isLoading,
    error,
    refetch,
    createOrdem: createOrdemMutation.mutate,
    updateOrdem: updateOrdemMutation.mutate,
    deleteOrdem: deleteOrdemMutation.mutate,
    isCreating: createOrdemMutation.isPending,
    isUpdating: updateOrdemMutation.isPending,
    isDeleting: deleteOrdemMutation.isPending
  };
};
