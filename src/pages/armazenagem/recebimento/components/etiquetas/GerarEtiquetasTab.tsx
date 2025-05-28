
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
    
    // Verificar campos básicos obrigatórios
    if (!volume.id || volume.id.trim() === '') {
      missingFields.push('Código da Etiqueta');
    }
    
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
      console.log('🚀 Iniciando processo de gravação de etiquetas...');
      console.log('📦 Volumes a serem gravados:', generatedVolumes);
      
      // Validar se há volumes para gravar
      if (generatedVolumes.length === 0) {
        toast({
          title: "❌ Nenhuma Etiqueta para Gravar",
          description: "Gere volumes primeiro antes de tentar gravar as etiquetas.",
          variant: "destructive",
        });
        return;
      }

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
          title: "⚠️ Campos Obrigatórios Faltando",
          description: `Os seguintes campos são obrigatórios:\n${errorMessages}`,
          variant: "destructive",
        });
        console.error('❌ Validação falhou:', volumesWithErrors);
        return;
      }

      // Contar volumes salvos com sucesso
      let volumesSalvos = 0;
      let volumesComErro = 0;
      const erros: string[] = [];

      console.log(`📝 Iniciando gravação de ${generatedVolumes.length} etiquetas...`);

      // Processar cada volume individualmente
      for (const volume of generatedVolumes) {
        try {
          console.log(`💾 Processando volume: ${volume.id}`, volume);
          
          // Preparar dados da etiqueta com mapeamento correto e simplificado
          const etiquetaData: CreateEtiquetaData = {
            codigo: volume.id,
            tipo: 'volume',
            area: volume.area || null,
            remetente: volume.remetente || null,
            destinatario: volume.destinatario || null,
            endereco: volume.endereco || null,
            cidade: volume.cidade || null,
            uf: volume.uf || null,
            cep: null, // CEP não está disponível no Volume
            descricao: volume.descricao || 'Volume gerado automaticamente',
            transportadora: volume.transportadora || null,
            chave_nf: volume.chaveNF || volume.notaFiscal || null,
            quantidade: volume.quantidade || 1,
            peso_total_bruto: volume.pesoTotal || null,
            numero_pedido: volume.numeroPedido || null,
            volume_numero: volume.volumeNumber || 1,
            total_volumes: volume.totalVolumes || 1,
            codigo_onu: volume.codigoONU || null,
            codigo_risco: volume.codigoRisco || null,
            classificacao_quimica: volume.classificacaoQuimica || null,
            status: 'gerada'
          };
          
          console.log('💽 Dados preparados para gravação:', etiquetaData);
          
          const etiquetaSalva = await salvarEtiqueta(etiquetaData);
          console.log(`✅ Etiqueta ${volume.id} salva com sucesso! ID: ${etiquetaSalva.id}`);
          volumesSalvos++;
          
        } catch (error) {
          volumesComErro++;
          const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
          erros.push(`Volume ${volume.id}: ${errorMessage}`);
          console.error(`❌ Erro ao gravar volume ${volume.id}:`, error);
        }
      }

      console.log(`🏁 Processo concluído. Salvos: ${volumesSalvos}, Erros: ${volumesComErro}`);

      // Mostrar mensagem de resultado
      if (volumesSalvos > 0 && volumesComErro === 0) {
        toast({
          title: "✅ Etiquetas Gravadas com Sucesso",
          description: `${volumesSalvos} etiqueta(s) foram gravadas no banco de dados com sucesso!`,
        });
      } else if (volumesSalvos > 0 && volumesComErro > 0) {
        toast({
          title: "⚠️ Gravação Parcialmente Concluída",
          description: `${volumesSalvos} etiqueta(s) gravadas com sucesso. ${volumesComErro} etiqueta(s) com erro.`,
          variant: "destructive",
        });
        console.error('Erros encontrados:', erros);
      } else {
        toast({
          title: "❌ Falha na Gravação",
          description: `Nenhuma etiqueta foi gravada. Erros: ${erros.slice(0, 2).join(', ')}${erros.length > 2 ? '...' : ''}`,
          variant: "destructive",
        });
        console.error('Todos os erros:', erros);
      }

    } catch (error) {
      console.error('💥 Erro crítico no processo de gravação:', error);
      toast({
        title: "❌ Erro Crítico",
        description: `Erro inesperado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive",
      });
    }
  };

  const handleAtualizarEtiquetas = async () => {
    try {
      console.log('🔄 Atualizando lista de etiquetas...');
      await buscarEtiquetas();
      toast({
        title: "✅ Lista Atualizada",
        description: "A lista de etiquetas foi atualizada com sucesso.",
      });
      console.log('✅ Lista de etiquetas atualizada');
    } catch (error) {
      console.error('❌ Erro ao atualizar etiquetas:', error);
      toast({
        title: "❌ Erro ao Atualizar",
        description: `Não foi possível atualizar a lista: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
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
              Atualizar Lista
            </Button>
            <Button
              onClick={handleGravarEtiquetas}
              disabled={isLoading || generatedVolumes.length === 0}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'Gravando...' : 'Gravar Etiqueta'}
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
