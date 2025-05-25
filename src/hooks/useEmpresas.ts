
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Empresa } from '@/types/supabase/empresa.types';
import { toast } from '@/hooks/use-toast';
import {
  buscarEmpresas,
  criarEmpresa,
  atualizarEmpresa,
  excluirEmpresa
} from '@/services/empresa/empresaService';

export const useEmpresas = (filtros?: {
  tipo?: string;
  status?: string;
}) => {
  const queryClient = useQueryClient();

  // Fetch all empresas
  const { 
    data: empresas = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['empresas', filtros],
    queryFn: () => buscarEmpresas(filtros),
    retry: 3,
    retryDelay: 1000
  });

  // Create empresa mutation
  const createEmpresaMutation = useMutation({
    mutationFn: criarEmpresa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      toast({
        title: "Sucesso",
        description: "Empresa criada com sucesso!",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao criar empresa:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao criar empresa",
        variant: "destructive",
      });
    }
  });

  // Update empresa mutation
  const updateEmpresaMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Empresa> }) => 
      atualizarEmpresa(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      toast({
        title: "Sucesso",
        description: "Empresa atualizada com sucesso!",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar empresa:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar empresa",
        variant: "destructive",
      });
    }
  });

  // Delete empresa mutation
  const deleteEmpresaMutation = useMutation({
    mutationFn: excluirEmpresa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      toast({
        title: "Sucesso",
        description: "Empresa excluída com sucesso!",
      });
    },
    onError: (error: any) => {
      console.error('Erro ao excluir empresa:', error);
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
