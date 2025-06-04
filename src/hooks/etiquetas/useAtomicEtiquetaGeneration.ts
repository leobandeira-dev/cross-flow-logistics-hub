
import { useState } from 'react';
import { 
  etiquetaAtomicService, 
  AtomicEtiquetaData, 
  DuplicateCheckResult 
} from '@/services/etiqueta/etiquetaAtomicService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export const useAtomicEtiquetaGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [duplicateData, setDuplicateData] = useState<DuplicateCheckResult | null>(null);
  const [pendingData, setPendingData] = useState<AtomicEtiquetaData | null>(null);
  
  const { user } = useAuth();

  const verificarDuplicidade = async (notaFiscalId: string): Promise<DuplicateCheckResult> => {
    try {
      console.log('🔍 Verificando duplicidade para NF:', notaFiscalId);
      return await etiquetaAtomicService.verificarDuplicidade(notaFiscalId);
    } catch (error) {
      console.error('❌ Erro ao verificar duplicidade:', error);
      toast({
        title: "❌ Erro na Verificação",
        description: "Não foi possível verificar duplicidade da Nota Fiscal.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const gerarEtiquetasAtomicamente = async (dados: AtomicEtiquetaData): Promise<Array<any> | null> => {
    if (!user?.id) {
      toast({
        title: "❌ Usuário Não Autenticado",
        description: "É necessário estar logado para gerar etiquetas.",
        variant: "destructive"
      });
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

      console.log('📋 Verificando duplicidade antes da gravação...');
      
      // Verificar duplicidade primeiro
      const verificacao = await etiquetaAtomicService.verificarDuplicidade(dados.nota_fiscal_id);
      
      if (verificacao.hasDuplicates) {
        console.log('⚠️ Duplicidade encontrada:', verificacao);
        
        // Mostrar diálogo de confirmação
        setDuplicateData(verificacao);
        setPendingData(dadosCompletos);
        setShowDuplicateDialog(true);
        
        toast({
          title: "⚠️ Volumes Existentes Encontrados",
          description: `A Nota Fiscal já possui ${verificacao.existingVolumes} volume(s) gravado(s). Confirme se deseja criar novos volumes.`,
          variant: "default"
        });
        
        return null; // Aguardar confirmação do usuário
      }

      console.log('✅ Nenhuma duplicidade encontrada, prosseguindo...');
      
      // Se não há duplicatas, prosseguir diretamente
      const resultado = await etiquetaAtomicService.persistirEtiquetasAtomicamente(dadosCompletos);
      
      console.log('💾 Etiquetas persistidas com sucesso:', resultado.length);
      
      return resultado;
      
    } catch (error) {
      console.error('❌ Erro na geração atômica:', error);
      toast({
        title: "❌ Erro na Geração",
        description: error instanceof Error ? error.message : "Erro inesperado na geração de etiquetas",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const confirmarGeracao = async (): Promise<Array<any> | null> => {
    if (!pendingData) {
      toast({
        title: "❌ Dados Não Encontrados",
        description: "Dados para confirmação não foram encontrados.",
        variant: "destructive"
      });
      throw new Error('Dados pendentes não encontrados');
    }

    setIsGenerating(true);
    setShowDuplicateDialog(false);

    try {
      console.log('✅ Confirmando gravação de novos volumes...');
      
      const resultado = await etiquetaAtomicService.persistirEtiquetasAtomicamente(pendingData);
      
      console.log('💾 Confirmação concluída:', resultado.length, 'etiquetas');
      
      // Limpar dados pendentes
      setPendingData(null);
      setDuplicateData(null);
      
      return resultado;
    } catch (error) {
      console.error('❌ Erro na confirmação de geração:', error);
      toast({
        title: "❌ Erro na Confirmação",
        description: error instanceof Error ? error.message : "Erro ao confirmar gravação",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const cancelarGeracao = () => {
    console.log('❌ Geração cancelada pelo usuário');
    
    setShowDuplicateDialog(false);
    setPendingData(null);
    setDuplicateData(null);
    setIsGenerating(false);
    
    toast({
      title: "⚠️ Operação Cancelada",
      description: "A gravação de novos volumes foi cancelada.",
    });
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
