
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
      console.log('Iniciando busca de etiquetas...');
      const data = await etiquetaService.buscarEtiquetas();
      setEtiquetas(data);
      console.log(`Etiquetas carregadas: ${data.length}`);
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
      console.log(`Buscando etiqueta por ID: ${id}`);
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
      console.log('Salvando nova etiqueta:', etiquetaData);
      const novaEtiqueta = await etiquetaService.criarEtiqueta(etiquetaData);
      
      // Atualizar lista automaticamente
      setEtiquetas(prev => [novaEtiqueta, ...prev]);
      
      toast({
        title: "Sucesso",
        description: "Etiqueta gravada no Supabase com sucesso!",
      });
      return novaEtiqueta;
    } catch (error) {
      console.error('Erro ao salvar etiqueta:', error);
      toast({
        title: "Erro na Gravação",
        description: error instanceof Error ? error.message : "Erro ao gravar etiqueta no banco de dados Supabase.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // UPDATE - Atualizar etiqueta existente usando ID como chave primária
  const atualizarEtiqueta = useCallback(async (id: string, etiquetaData: Partial<CreateEtiquetaData>) => {
    setIsLoading(true);
    try {
      console.log(`Atualizando etiqueta com ID: ${id}`, etiquetaData);
      const etiquetaAtualizada = await etiquetaService.atualizarEtiqueta(id, etiquetaData);
      
      // Atualizar lista automaticamente usando ID como chave
      setEtiquetas(prev => prev.map(etq => etq.id === id ? etiquetaAtualizada : etq));
      
      toast({
        title: "Sucesso",
        description: "Etiqueta atualizada no Supabase com sucesso!",
      });
      return etiquetaAtualizada;
    } catch (error) {
      console.error('Erro ao atualizar etiqueta:', error);
      toast({
        title: "Erro na Atualização",
        description: error instanceof Error ? error.message : "Erro ao atualizar etiqueta no banco de dados Supabase.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // DELETE - Excluir etiqueta usando ID como chave primária
  const excluirEtiqueta = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      console.log(`Excluindo etiqueta com ID: ${id}`);
      await etiquetaService.excluirEtiqueta(id);
      
      // Remover da lista automaticamente usando ID como chave
      setEtiquetas(prev => prev.filter(etq => etq.id !== id));
      
      toast({
        title: "Sucesso",
        description: "Etiqueta excluída do Supabase com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao excluir etiqueta:', error);
      toast({
        title: "Erro na Exclusão",
        description: error instanceof Error ? error.message : "Erro ao excluir etiqueta do banco de dados Supabase.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // UPDATE - Marcar como etiquetada usando ID como chave primária
  const marcarComoEtiquetada = useCallback(async (id: string) => {
    try {
      console.log(`Marcando como etiquetada - ID: ${id}`);
      await etiquetaService.marcarComoEtiquetada(id);
      
      // Atualizar lista automaticamente usando ID como chave
      setEtiquetas(prev => prev.map(etq => 
        etq.id === id 
          ? { ...etq, status: 'etiquetada', etiquetado: true, data_impressao: new Date().toISOString() }
          : etq
      ));
    } catch (error) {
      console.error('Erro ao marcar etiqueta como etiquetada:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao atualizar status da etiqueta no Supabase.",
        variant: "destructive"
      });
      throw error;
    }
  }, []);

  // UPDATE - Inutilizar etiqueta usando ID como chave primária
  const inutilizarEtiqueta = useCallback(async (id: string, dados: InutilizarEtiquetaData) => {
    setIsLoading(true);
    try {
      console.log(`Inutilizando etiqueta com ID: ${id}`, dados);
      await etiquetaService.inutilizarEtiqueta(id, dados);
      
      // Atualizar lista automaticamente usando ID como chave
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
        description: "Etiqueta inutilizada no Supabase com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao inutilizar etiqueta:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao inutilizar etiqueta no Supabase.",
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
