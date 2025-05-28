
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, RefreshCw } from 'lucide-react';
import FormLayout from './form/FormLayout';
import GeneratedVolumesPanel from './GeneratedVolumesPanel';
import { Volume } from '../../hooks/etiquetas/useVolumeState';
import { useBatchAreaClassification } from '../../hooks/etiquetas/useBatchAreaClassification';
import { useEtiquetasDatabase } from '@/hooks/useEtiquetasDatabase';
import { CreateEtiquetaData } from '@/services/etiquetaService';

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

  const handleGravarEtiquetas = async () => {
    try {
      const promises = generatedVolumes.map(async (volume) => {
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
          classificacao_quimica: volume.classificacaoQuimica
        };
        
        return await salvarEtiqueta(etiquetaData);
      });

      await Promise.all(promises);
    } catch (error) {
      console.error('Erro ao gravar etiquetas:', error);
    }
  };

  const handleAtualizarEtiquetas = async () => {
    try {
      await buscarEtiquetas();
    } catch (error) {
      console.error('Erro ao atualizar etiquetas:', error);
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
