
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import etiquetaService, { CreateEtiquetaData, InutilizarEtiquetaData } from '@/services/etiquetaService';
import { Etiqueta } from '@/types/supabase/armazem.types';

export const useEtiquetasDatabase = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>([]);

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

  const salvarEtiqueta = useCallback(async (etiquetaData: CreateEtiquetaData) => {
    setIsLoading(true);
    try {
      const novaEtiqueta = await etiquetaService.criarEtiqueta(etiquetaData);
      setEtiquetas(prev => [novaEtiqueta, ...prev]);
      toast({
        title: "Sucesso",
        description: "Etiqueta salva com sucesso!",
      });
      return novaEtiqueta;
    } catch (error) {
      console.error('Erro ao salvar etiqueta:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar etiqueta no banco de dados.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const atualizarEtiqueta = useCallback(async (id: string, etiquetaData: Partial<CreateEtiquetaData>) => {
    setIsLoading(true);
    try {
      const etiquetaAtualizada = await etiquetaService.atualizarEtiqueta(id, etiquetaData);
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
        description: "Erro ao atualizar etiqueta no banco de dados.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const marcarComoEtiquetada = useCallback(async (id: string) => {
    try {
      await etiquetaService.marcarComoEtiquetada(id);
      setEtiquetas(prev => prev.map(etq => 
        etq.id === id 
          ? { ...etq, status: 'etiquetada', etiquetado: true, data_impressao: new Date().toISOString() }
          : etq
      ));
    } catch (error) {
      console.error('Erro ao marcar etiqueta como etiquetada:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar status da etiqueta.",
        variant: "destructive"
      });
      throw error;
    }
  }, []);

  const inutilizarEtiqueta = useCallback(async (id: string, dados: InutilizarEtiquetaData) => {
    setIsLoading(true);
    try {
      await etiquetaService.inutilizarEtiqueta(id, dados);
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
        description: "Erro ao inutilizar etiqueta.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    etiquetas,
    isLoading,
    buscarEtiquetas,
    salvarEtiqueta,
    atualizarEtiqueta,
    marcarComoEtiquetada,
    inutilizarEtiqueta
  };
};
