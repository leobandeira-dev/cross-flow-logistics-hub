
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { OrdemCarregamento } from '@/types/supabase.types';
import { toast } from '@/hooks/use-toast';

export const useOrdensCarregamento = () => {
  const queryClient = useQueryClient();

  // Fetch all ordens de carregamento
  const { 
    data: ordensCarregamento = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['ordens-carregamento'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ordens_carregamento')
        .select(`
          *,
          empresa_cliente:empresas!empresa_cliente_id(*),
          motorista:motoristas(*),
          veiculo:veiculos(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar ordens de carregamento:', error);
        throw new Error(error.message);
      }

      return data as OrdemCarregamento[];
    }
  });

  // Create ordem de carregamento mutation
  const createOrdemMutation = useMutation({
    mutationFn: async (data: Partial<OrdemCarregamento>) => {
      const { data: newOrdem, error } = await supabase
        .from('ordens_carregamento')
        .insert({
          ...data,
          numero_ordem: data.numero_ordem || `OC-${Date.now()}`,
          status: data.status || 'pendente'
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return newOrdem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordens-carregamento'] });
      toast({
        title: "Sucesso",
        description: "Ordem de carregamento criada com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar ordem de carregamento",
        variant: "destructive",
      });
    }
  });

  // Update ordem de carregamento mutation
  const updateOrdemMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<OrdemCarregamento> }) => {
      const { data: updatedOrdem, error } = await supabase
        .from('ordens_carregamento')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return updatedOrdem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ordens-carregamento'] });
      toast({
        title: "Sucesso",
        description: "Ordem de carregamento atualizada com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar ordem de carregamento",
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
    isCreating: createOrdemMutation.isPending,
    isUpdating: updateOrdemMutation.isPending
  };
};
