
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, RefreshCw } from 'lucide-react';
import FormLayout from './form/FormLayout';
import GeneratedVolumesPanel from './GeneratedVolumesPanel';
import { Volume } from '../../hooks/etiquetas/useVolumeState';
import { useBatchAreaClassification } from '../../hooks/etiquetas/useBatchAreaClassification';
import { useEtiquetasDatabase } from '@/hooks/useEtiquetasDatabase';
import { CreateEtiquetaData } from '@/services/etiquetaService';
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
  const { salvarEtiqueta, buscarEtiquetas, isLoading } = useEtiquetasDatabase();

  const onBatchClassifyArea = (area: string) => {
    if (setVolumes && setGeneratedVolumes) {
      handleBatchClassifyArea(area, setVolumes, setGeneratedVolumes);
    }
  };

  const validateRequiredFields = (volume: Volume): string[] => {
    const missingFields: string[] = [];
    
    if (!volume.notaFiscal || volume.notaFiscal.trim() === '') {
      missingFields.push('Nota Fiscal');
    }
    
    if (!volume.tipoVolume) {
      missingFields.push('Tipo de Volume');
    }
    
    // Para volumes químicos, verificar campos específicos
    if (volume.tipoVolume === 'quimico') {
      if (!volume.codigoONU || volume.codigoONU.trim() === '') {
        missingFields.push('Código ONU');
      }
      
      if (!volume.codigoRisco || volume.codigoRisco.trim() === '') {
        missingFields.push('Código de Risco');
      }
      
      if (!volume.classificacaoQuimica || volume.classificacaoQuimica === 'nao_classificada') {
        missingFields.push('Classificação Química');
      }
    }
    
    return missingFields;
  };

  const handleGravarEtiquetas = async () => {
    try {
      // Validar campos obrigatórios para todos os volumes
      const volumesWithErrors: { volume: Volume; missingFields: string[] }[] = [];
      
      generatedVolumes.forEach(volume => {
        const missingFields = validateRequiredFields(volume);
        if (missingFields.length > 0) {
          volumesWithErrors.push({ volume, missingFields });
        }
      });

      // Se houver erros de validação, mostrar mensagem detalhada
      if (volumesWithErrors.length > 0) {
        const errorMessages = volumesWithErrors.map(({ volume, missingFields }) => 
          `Volume ${volume.id}: ${missingFields.join(', ')}`
        ).join('\n');
        
        toast({
          title: "Campos Obrigatórios Faltando",
          description: `Os seguintes campos são obrigatórios:\n${errorMessages}`,
          variant: "destructive",
        });
        return;
      }

      // Contar volumes salvos com sucesso
      let volumesSalvos = 0;
      let volumesComErro = 0;
      const erros: string[] = [];

      const promises = generatedVolumes.map(async (volume) => {
        try {
          const etiquetaData: CreateEtiquetaData = {
            codigo: volume.id,
            tipo: 'volume',
            area: volume.area,
            remetente: volume.remetente,
            destinatario: volume.destinatario,
            endereco: volume.endereco,
            cidade: volume.cidade,
            uf: volume.uf,
            descricao: volume.descricao,
            transportadora: volume.transportadora,
            chave_nf: volume.chaveNF,
            quantidade: volume.quantidade,
            peso_total_bruto: volume.pesoTotal,
            numero_pedido: volume.numeroPedido || '',
            volume_numero: volume.volumeNumber || 1,
            total_volumes: volume.totalVolumes || 1,
            codigo_onu: volume.codigoONU,
            codigo_risco: volume.codigoRisco,
            classificacao_quimica: volume.classificacaoQuimica,
            status: 'gerada'
          };
          
          await salvarEtiqueta(etiquetaData);
          volumesSalvos++;
        } catch (error) {
          volumesComErro++;
          erros.push(`Volume ${volume.id}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
          console.error(`Erro ao gravar etiqueta do volume ${volume.id}:`, error);
        }
      });

      await Promise.all(promises);

      // Mostrar mensagem de confirmação detalhada
      if (volumesSalvos > 0 && volumesComErro === 0) {
        toast({
          title: "Etiquetas Gravadas com Sucesso",
          description: `${volumesSalvos} etiqueta(s) foram gravadas no sistema com todas as informações obrigatórias:
          • Nota Fiscal
          • Tipo de Volume
          ${generatedVolumes.some(v => v.tipoVolume === 'quimico') ? '• Código ONU\n• Código de Risco\n• Classificação Química' : ''}`,
        });
      } else if (volumesSalvos > 0 && volumesComErro > 0) {
        toast({
          title: "Gravação Parcialmente Concluída",
          description: `${volumesSalvos} etiqueta(s) gravadas com sucesso. ${volumesComErro} etiqueta(s) com erro.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro na Gravação",
          description: `Nenhuma etiqueta foi gravada. Erros encontrados:\n${erros.join('\n')}`,
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Erro ao gravar etiquetas:', error);
      toast({
        title: "Erro no Sistema",
        description: "Erro inesperado ao gravar etiquetas. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleAtualizarEtiquetas = async () => {
    try {
      await buscarEtiquetas();
      toast({
        title: "Etiquetas Atualizadas",
        description: "Lista de etiquetas atualizada com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar etiquetas:', error);
      toast({
        title: "Erro ao Atualizar",
        description: "Não foi possível atualizar a lista de etiquetas.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <FormLayout 
        form={form}
        onGenerateVolumes={handleGenerateVolumes}
        onBatchClassifyArea={setVolumes && setGeneratedVolumes ? onBatchClassifyArea : undefined}
        isGenerating={false}
      />
      
      {generatedVolumes.length > 0 && (
        <div className="space-y-4">
          <div className="flex gap-2 justify-end">
            <Button
              onClick={handleAtualizarEtiquetas}
              variant="outline"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button
              onClick={handleGravarEtiquetas}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Gravar Etiquetas
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
    </div>
  );
};

export default GerarEtiquetasTab;
