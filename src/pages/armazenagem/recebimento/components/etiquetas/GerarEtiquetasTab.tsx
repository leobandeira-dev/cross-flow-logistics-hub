
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, RefreshCw } from 'lucide-react';
import FormLayout from './form/FormLayout';
import GeneratedVolumesPanel from './GeneratedVolumesPanel';
import DuplicateConfirmationDialog from './DuplicateConfirmationDialog';
import { Volume } from '../../hooks/etiquetas/useVolumeState';
import { useBatchAreaClassification } from '../../hooks/etiquetas/useBatchAreaClassification';
import { useAtomicEtiquetaGeneration } from '@/hooks/etiquetas/useAtomicEtiquetaGeneration';
import { AtomicEtiquetaData } from '@/services/etiqueta/etiquetaAtomicService';
import { toast } from '@/hooks/use-toast';

interface GerarEtiquetasTabProps {
  form: any;
  generatedVolumes: Volume[];
  handleGenerateVolumes: () => void;
  handlePrintEtiquetas: (volume: Volume) => void;
  handleClassifyVolume: (volume: Volume) => void;
  setVolumes?: React.Dispatch<React.SetStateAction<Volume[]>>;
  setGeneratedVolumes?: React.Dispatch<React.SetStateAction<Volume[]>>;
}

const GerarEtiquetasTab: React.FC<GerarEtiquetasTabProps> = ({
  form,
  generatedVolumes,
  handleGenerateVolumes,
  handlePrintEtiquetas,
  handleClassifyVolume,
  setVolumes,
  setGeneratedVolumes
}) => {
  const { handleBatchClassifyArea } = useBatchAreaClassification();
  const {
    isGenerating,
    showDuplicateDialog,
    duplicateData,
    gerarEtiquetasAtomicamente,
    confirmarGeracao,
    cancelarGeracao
  } = useAtomicEtiquetaGeneration();

  const onBatchClassifyArea = (area: string) => {
    if (setVolumes && setGeneratedVolumes) {
      handleBatchClassifyArea(area, setVolumes, setGeneratedVolumes);
    }
  };

  const prepareAtomicData = (): AtomicEtiquetaData | null => {
    const formValues = form.getValues();
    
    // Validar campos obrigatórios
    if (!formValues.numeroNotaFiscal) {
      toast({
        title: "❌ Campo Obrigatório",
        description: "Número da Nota Fiscal é obrigatório.",
        variant: "destructive"
      });
      return null;
    }

    if (!formValues.quantidadeVolumes || formValues.quantidadeVolumes <= 0) {
      toast({
        title: "❌ Campo Obrigatório", 
        description: "Quantidade de volumes deve ser maior que zero.",
        variant: "destructive"
      });
      return null;
    }

    // Preparar dados para persistência atômica
    const atomicData: AtomicEtiquetaData = {
      nota_fiscal_id: formValues.numeroNotaFiscal,
      numero_volumes: parseInt(formValues.quantidadeVolumes),
      tipo_etiqueta: formValues.tipoEtiqueta || 'Volume Simples',
      informacoes_adicionais: formValues.informacoesAdicionais,
      id_empresa: '', // Será preenchido pelo hook
      criado_por_usuario_id: '', // Será preenchido pelo hook
      area: formValues.areaVolumePrefix,
      remetente: formValues.remetente,
      destinatario: formValues.destinatario,
      endereco: formValues.endereco,
      cidade: formValues.cidade,
      uf: formValues.uf,
      transportadora: formValues.transportadora,
      chave_nf: formValues.chaveNF,
      peso_total_bruto: formValues.pesoTotalBruto?.toString(),
      numero_pedido: formValues.numeroPedido,
      codigo_onu: formValues.codigoONU,
      codigo_risco: formValues.codigoRisco,
      classificacao_quimica: formValues.classificacaoQuimica
    };

    return atomicData;
  };

  const convertEtiquetaToVolume = (etiqueta: any, atomicData: AtomicEtiquetaData): Volume => {
    return {
      id: etiqueta.codigo,
      volumeNumber: etiqueta.volume_numero,
      totalVolumes: etiqueta.total_volumes,
      notaFiscal: atomicData.nota_fiscal_id,
      area: etiqueta.area || '',
      chaveNF: atomicData.chave_nf || '',
      remetente: atomicData.remetente || '',
      destinatario: atomicData.destinatario || '',
      endereco: atomicData.endereco || '',
      cidade: atomicData.cidade || '',
      uf: atomicData.uf || '',
      pesoTotal: atomicData.peso_total_bruto || '',
      etiquetaMae: '',
      descricao: atomicData.informacoes_adicionais || '',
      quantidade: 1,
      etiquetado: false,
      tipoVolume: atomicData.codigo_onu ? 'quimico' : 'geral',
      codigoONU: atomicData.codigo_onu,
      codigoRisco: atomicData.codigo_risco,
      classificacaoQuimica: atomicData.classificacao_quimica as any,
      transportadora: atomicData.transportadora,
      cidadeCompleta: `${atomicData.cidade || ''} - ${atomicData.uf || ''}`.trim()
    };
  };

  const handleGravarEtiquetasAtomicamente = async () => {
    try {
      console.log('🚀 Iniciando geração atômica de etiquetas...');
      
      const atomicData = prepareAtomicData();
      if (!atomicData) {
        return;
      }

      // Mostrar loading
      toast({
        title: "🔄 Verificando Duplicidade",
        description: "Verificando se já existem volumes para esta Nota Fiscal...",
      });

      const etiquetasGeradas = await gerarEtiquetasAtomicamente(atomicData);
      
      if (etiquetasGeradas && setGeneratedVolumes) {
        console.log('✅ Etiquetas geradas atomicamente:', etiquetasGeradas.length);
        
        // Converter para formato Volume
        const volumes: Volume[] = etiquetasGeradas.map((etiqueta) => 
          convertEtiquetaToVolume(etiqueta, atomicData)
        );
        
        setGeneratedVolumes(volumes);

        // Toast de sucesso
        toast({
          title: "✅ Etiquetas Gravadas com Sucesso",
          description: `${etiquetasGeradas.length} etiqueta(s) foram persistidas no banco de dados para a NF ${atomicData.nota_fiscal_id}.`,
        });
      }
      
    } catch (error) {
      console.error('💥 Erro na geração atômica:', error);
      toast({
        title: "❌ Erro na Gravação",
        description: error instanceof Error ? error.message : "Erro inesperado na gravação de etiquetas",
        variant: "destructive"
      });
    }
  };

  const handleConfirmarGeracao = async () => {
    try {
      const atomicData = prepareAtomicData();
      if (!atomicData) return;

      // Mostrar loading
      toast({
        title: "🔄 Gravando Etiquetas",
        description: "Confirmando gravação de novos volumes...",
      });

      const etiquetasGeradas = await confirmarGeracao();
      
      if (etiquetasGeradas && setGeneratedVolumes) {
        const volumes: Volume[] = etiquetasGeradas.map((etiqueta) => 
          convertEtiquetaToVolume(etiqueta, atomicData)
        );
        
        setGeneratedVolumes(volumes);

        // Toast de sucesso
        toast({
          title: "✅ Novos Volumes Gravados",
          description: `${etiquetasGeradas.length} nova(s) etiqueta(s) foram adicionadas para a NF ${atomicData.nota_fiscal_id}.`,
        });
      }
    } catch (error) {
      console.error('❌ Erro na confirmação:', error);
      toast({
        title: "❌ Erro na Confirmação",
        description: error instanceof Error ? error.message : "Erro ao confirmar gravação",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <FormLayout 
        form={form}
        onGenerateVolumes={handleGenerateVolumes}
        onBatchClassifyArea={setVolumes && setGeneratedVolumes ? onBatchClassifyArea : undefined}
        isGenerating={isGenerating}
      />
      
      {generatedVolumes.length > 0 && (
        <div className="space-y-4">
          <div className="flex gap-2 justify-end">
            <Button
              onClick={handleGravarEtiquetasAtomicamente}
              disabled={isGenerating || generatedVolumes.length === 0}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Save className="h-4 w-4" />
              {isGenerating ? 'Gravando...' : 'Gravar Etiquetas (Atômico)'}
            </Button>
          </div>
          
          <GeneratedVolumesPanel
            volumes={generatedVolumes}
            handlePrintEtiquetas={handlePrintEtiquetas}
            handleClassifyVolume={handleClassifyVolume}
            showEtiquetaMaeColumn={false}
          />
        </div>
      )}

      {/* Diálogo de Confirmação de Duplicidade */}
      <DuplicateConfirmationDialog
        open={showDuplicateDialog}
        onOpenChange={() => {}}
        onConfirm={handleConfirmarGeracao}
        onCancel={cancelarGeracao}
        duplicateData={duplicateData || { hasDuplicates: false, existingVolumes: 0, volumes: [] }}
        numeroNotaFiscal={form.getValues('numeroNotaFiscal')}
      />
    </div>
  );
};

export default GerarEtiquetasTab;
