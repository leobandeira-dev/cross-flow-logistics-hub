
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import etiquetaService, { CreateEtiquetaData, InutilizarEtiquetaData } from '@/services/etiquetaService';
import { Etiqueta } from '@/types/supabase/armazem.types';

export const useEtiquetasDatabase = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);

  // READ - Buscar todas as etiquetas
  const buscarEtiquetas = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await etiquetaService.buscarEtiquetas();
      setEtiquetas(data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar etiquetas:', error);
      toast({
        title: "Erro",
        description: "Erro ao buscar etiquetas do banco de dados.",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // READ - Buscar etiqueta por ID
  const buscarEtiquetaPorId = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const etiqueta = await etiquetaService.buscarEtiquetaPorId(id);
      return etiqueta;
    } catch (error) {
      console.error('Erro ao buscar etiqueta por ID:', error);
      toast({
        title: "Erro",
        description: "Erro ao buscar etiqueta.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // READ - Buscar etiquetas por código
  const buscarEtiquetasPorCodigo = useCallback(async (codigo: string) => {
    setIsLoading(true);
    try {
      const etiquetas = await etiquetaService.buscarEtiquetasPorCodigo(codigo);
      return etiquetas;
    } catch (error) {
      console.error('Erro ao buscar etiquetas por código:', error);
      toast({
        title: "Erro",
        description: "Erro ao buscar etiquetas por código.",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // CREATE - Salvar nova etiqueta
  const salvarEtiqueta = useCallback(async (etiquetaData: CreateEtiquetaData) => {
    setIsLoading(true);
    try {
      const novaEtiqueta = await etiquetaService.criarEtiqueta(etiquetaData);
      
      // Atualizar lista automaticamente
      setEtiquetas(prev => [novaEtiqueta, ...prev]);
      
      toast({
        title: "Sucesso",
        description: "Etiqueta criada com sucesso!",
      });
      return novaEtiqueta;
    } catch (error) {
      console.error('Erro ao salvar etiqueta:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao salvar etiqueta no banco de dados.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // UPDATE - Atualizar etiqueta existente
  const atualizarEtiqueta = useCallback(async (id: string, etiquetaData: Partial<CreateEtiquetaData>) => {
    setIsLoading(true);
    try {
      const etiquetaAtualizada = await etiquetaService.atualizarEtiqueta(id, etiquetaData);
      
      // Atualizar lista automaticamente
      setEtiquetas(prev => prev.map(etq => etq.id === id ? etiquetaAtualizada : etq));
      
      toast({
        title: "Sucesso",
        description: "Etiqueta atualizada com sucesso!",
      });
      return etiquetaAtualizada;
    } catch (error) {
      console.error('Erro ao atualizar etiqueta:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao atualizar etiqueta no banco de dados.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // DELETE - Excluir etiqueta
  const excluirEtiqueta = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await etiquetaService.excluirEtiqueta(id);
      
      // Remover da lista automaticamente
      setEtiquetas(prev => prev.filter(etq => etq.id !== id));
      
      toast({
        title: "Sucesso",
        description: "Etiqueta excluída com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao excluir etiqueta:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao excluir etiqueta.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // UPDATE - Marcar como etiquetada
  const marcarComoEtiquetada = useCallback(async (id: string) => {
    try {
      await etiquetaService.marcarComoEtiquetada(id);
      
      // Atualizar lista automaticamente
      setEtiquetas(prev => prev.map(etq => 
        etq.id === id 
          ? { ...etq, status: 'etiquetada', etiquetado: true, data_impressao: new Date().toISOString() }
          : etq
      ));
    } catch (error) {
      console.error('Erro ao marcar etiqueta como etiquetada:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao atualizar status da etiqueta.",
        variant: "destructive"
      });
      throw error;
    }
  }, []);

  // UPDATE - Inutilizar etiqueta
  const inutilizarEtiqueta = useCallback(async (id: string, dados: InutilizarEtiquetaData) => {
    setIsLoading(true);
    try {
      await etiquetaService.inutilizarEtiqueta(id, dados);
      
      // Atualizar lista automaticamente
      setEtiquetas(prev => prev.map(etq => 
        etq.id === id 
          ? { 
              ...etq, 
              status: 'inutilizada', 
              motivo_inutilizacao: dados.motivo_inutilizacao,
              data_inutilizacao: new Date().toISOString() 
            }
          : etq
      ));
      
      toast({
        title: "Sucesso",
        description: "Etiqueta inutilizada com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao inutilizar etiqueta:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao inutilizar etiqueta.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // Estado
    etiquetas,
    isLoading,
    
    // Operações CRUD
    // READ
    buscarEtiquetas,
    buscarEtiquetaPorId,
    buscarEtiquetasPorCodigo,
    
    // CREATE
    salvarEtiqueta,
    
    // UPDATE
    atualizarEtiqueta,
    marcarComoEtiquetada,
    inutilizarEtiqueta,
    
    // DELETE
    excluirEtiqueta
  };
};
