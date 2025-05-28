
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
      console.log('Iniciando processo de gravação de etiquetas no Supabase...');
      
      // Validar se há volumes para gravar
      if (generatedVolumes.length === 0) {
        toast({
          title: "Nenhuma Etiqueta para Gravar",
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
          title: "Validação de Campos Obrigatórios",
          description: `Os seguintes campos são obrigatórios e estão faltando:\n${errorMessages}`,
          variant: "destructive",
        });
        return;
      }

      // Contar volumes salvos com sucesso
      let volumesSalvos = 0;
      let volumesComErro = 0;
      const erros: string[] = [];

      console.log(`Iniciando gravação de ${generatedVolumes.length} etiquetas...`);

      const promises = generatedVolumes.map(async (volume, index) => {
        try {
          console.log(`Processando etiqueta ${index + 1}/${generatedVolumes.length}: ${volume.id}`);
          
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
          
          console.log(`Salvando etiqueta no Supabase:`, etiquetaData);
          const etiquetaSalva = await salvarEtiqueta(etiquetaData);
          console.log(`Etiqueta ${volume.id} salva com sucesso. ID no banco: ${etiquetaSalva.id}`);
          volumesSalvos++;
        } catch (error) {
          volumesComErro++;
          const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
          erros.push(`Volume ${volume.id}: ${errorMessage}`);
          console.error(`Erro ao gravar etiqueta do volume ${volume.id}:`, error);
        }
      });

      await Promise.all(promises);

      console.log(`Processo de gravação concluído. Salvos: ${volumesSalvos}, Erros: ${volumesComErro}`);

      // Mostrar mensagem de confirmação detalhada e clara
      if (volumesSalvos > 0 && volumesComErro === 0) {
        toast({
          title: "✅ Etiquetas Gravadas com Sucesso",
          description: `${volumesSalvos} etiqueta(s) foram gravadas no banco de dados Supabase com sucesso! 
          
Todas as informações obrigatórias foram validadas e salvas:
• Nota Fiscal ✓
• Tipo de Volume ✓
${generatedVolumes.some(v => v.tipoVolume === 'quimico') ? '• Código ONU ✓\n• Código de Risco ✓\n• Classificação Química ✓' : ''}

As etiquetas estão prontas para impressão e consulta.`,
        });
      } else if (volumesSalvos > 0 && volumesComErro > 0) {
        toast({
          title: "⚠️ Gravação Parcialmente Concluída",
          description: `${volumesSalvos} etiqueta(s) gravadas com sucesso no Supabase.
${volumesComErro} etiqueta(s) apresentaram erro durante a gravação.

Verifique os dados dos volumes com erro e tente novamente.`,
          variant: "destructive",
        });
        console.error('Erros encontrados:', erros);
      } else {
        toast({
          title: "❌ Falha na Gravação",
          description: `Nenhuma etiqueta foi gravada no banco de dados Supabase.

Erros encontrados:
${erros.slice(0, 3).join('\n')}${erros.length > 3 ? `\n... e mais ${erros.length - 3} erro(s)` : ''}

Verifique os dados e tente novamente.`,
          variant: "destructive",
        });
        console.error('Todos os erros:', erros);
      }

    } catch (error) {
      console.error('Erro crítico no processo de gravação:', error);
      toast({
        title: "❌ Erro Crítico no Sistema",
        description: `Erro inesperado durante a gravação das etiquetas no Supabase.

Detalhes: ${error instanceof Error ? error.message : 'Erro desconhecido'}

Tente novamente ou contate o suporte técnico.`,
        variant: "destructive",
      });
    }
  };

  const handleAtualizarEtiquetas = async () => {
    try {
      console.log('Atualizando lista de etiquetas do Supabase...');
      await buscarEtiquetas();
      toast({
        title: "✅ Etiquetas Atualizadas",
        description: "A lista de etiquetas foi atualizada com sucesso a partir do banco de dados Supabase.",
      });
      console.log('Lista de etiquetas atualizada com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar etiquetas:', error);
      toast({
        title: "❌ Erro ao Atualizar",
        description: `Não foi possível atualizar a lista de etiquetas do Supabase.

Detalhes: ${error instanceof Error ? error.message : 'Erro desconhecido'}

Tente novamente.`,
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
              {isLoading ? 'Gravando...' : 'Gravar no Supabase'}
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
