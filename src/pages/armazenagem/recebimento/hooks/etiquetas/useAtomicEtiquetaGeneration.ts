
import { useState } from 'react';
import { 
  etiquetaAtomicService, 
  AtomicEtiquetaData, 
  DuplicateCheckResult 
} from '@/services/etiqueta/etiquetaAtomicService';
import { useAuth } from '@/hooks/useAuth';

export const useAtomicEtiquetaGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [duplicateData, setDuplicateData] = useState<DuplicateCheckResult | null>(null);
  const [pendingData, setPendingData] = useState<AtomicEtiquetaData | null>(null);
  
  const { user } = useAuth();

  const verificarDuplicidade = async (notaFiscalId: string): Promise<DuplicateCheckResult> => {
    try {
      return await etiquetaAtomicService.verificarDuplicidade(notaFiscalId);
    } catch (error) {
      console.error('Erro ao verificar duplicidade:', error);
      throw error;
    }
  };

  const gerarEtiquetasAtomicamente = async (dados: AtomicEtiquetaData): Promise<Array<any> | null> => {
    if (!user?.id) {
      throw new Error('Usuário não autenticado');
    }

    setIsGenerating(true);
    
    try {
      // Adicionar dados do usuário
      const dadosCompletos = {
        ...dados,
        criado_por_usuario_id: user.id,
        id_empresa: user.empresa_id || dados.id_empresa
      };

      // Verificar duplicidade primeiro
      const verificacao = await etiquetaAtomicService.verificarDuplicidade(dados.nota_fiscal_id);
      
      if (verificacao.hasDuplicates) {
        // Mostrar diálogo de confirmação
        setDuplicateData(verificacao);
        setPendingData(dadosCompletos);
        setShowDuplicateDialog(true);
        return null; // Aguardar confirmação do usuário
      }

      // Se não há duplicatas, prosseguir diretamente
      return await etiquetaAtomicService.persistirEtiquetasAtomicamente(dadosCompletos);
      
    } catch (error) {
      console.error('Erro na geração atômica:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const confirmarGeracao = async (): Promise<Array<any> | null> => {
    if (!pendingData) {
      throw new Error('Dados pendentes não encontrados');
    }

    setIsGenerating(true);
    setShowDuplicateDialog(false);

    try {
      const resultado = await etiquetaAtomicService.persistirEtiquetasAtomicamente(pendingData);
      setPendingData(null);
      setDuplicateData(null);
      return resultado;
    } catch (error) {
      console.error('Erro na confirmação de geração:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const cancelarGeracao = () => {
    setShowDuplicateDialog(false);
    setPendingData(null);
    setDuplicateData(null);
    setIsGenerating(false);
  };

  return {
    isGenerating,
    showDuplicateDialog,
    duplicateData,
    verificarDuplicidade,
    gerarEtiquetasAtomicamente,
    confirmarGeracao,
    cancelarGeracao
  };
};
