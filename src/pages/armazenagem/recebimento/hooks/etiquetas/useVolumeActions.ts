
import { Volume } from '../../components/etiquetas/VolumesTable';
import { toast } from '@/hooks/use-toast';

export const useVolumeActions = () => {
  // Função para gerar ID sem segundos/minutos
  const generateVolumeId = (notaFiscal: string, volumeNumber: number, totalVolumes: number) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    
    // Formato: NF123456-001-002-20240605-14 (sem minutos e segundos)
    return `${notaFiscal}-${String(volumeNumber).padStart(3, '0')}-${String(totalVolumes).padStart(3, '0')}-${year}${month}${day}-${hour}`;
  };

  const generateVolumes = (
    notaFiscal: string,
    volumesTotal: number,
    pesoTotalBruto: string,
    notaFiscalData: any,
    tipoVolume: 'geral' | 'quimico' = 'geral',
    codigoONU: string = '',
    codigoRisco: string = ''
  ): Volume[] => {
    console.log('🔄 Gerando volumes:', { notaFiscal, volumesTotal, tipoVolume });
    
    if (!notaFiscal || volumesTotal <= 0) {
      toast({
        title: "Erro na geração",
        description: "Nota fiscal e número de volumes são obrigatórios.",
        variant: "destructive",
      });
      return [];
    }

    const volumes: Volume[] = [];
    
    for (let i = 1; i <= volumesTotal; i++) {
      const volumeId = generateVolumeId(notaFiscal, i, volumesTotal);
      
      const volume: Volume = {
        id: volumeId,
        notaFiscal: notaFiscal,
        volumeNumber: i,
        totalVolumes: volumesTotal,
        descricao: `Volume ${i}/${volumesTotal}`,
        pesoTotal: pesoTotalBruto,
        remetente: notaFiscalData?.emitente_razao_social || notaFiscalData?.remetente || 'REMETENTE',
        destinatario: notaFiscalData?.destinatario_razao_social || notaFiscalData?.destinatario || 'DESTINATÁRIO',
        endereco: notaFiscalData?.destinatario_endereco || notaFiscalData?.endereco || '',
        cidade: notaFiscalData?.destinatario_cidade || notaFiscalData?.cidade || 'CIDADE',
        uf: notaFiscalData?.destinatario_uf || notaFiscalData?.uf || 'UF',
        transportadora: notaFiscalData?.transportadora || '',
        chaveNF: notaFiscalData?.chave_acesso || notaFiscal,
        numeroPedido: notaFiscalData?.numero_pedido || '',
        quantidade: 1,
        area: '',
        classificacaoQuimica: tipoVolume === 'quimico' ? 'classificada' : 'nao_classificada',
        codigoONU: tipoVolume === 'quimico' ? codigoONU : '',
        codigoRisco: tipoVolume === 'quimico' ? codigoRisco : '',
        etiquetado: false,
        impresso: false,
        dataGeracao: new Date().toISOString(),
      };
      
      volumes.push(volume);
    }
    
    console.log(`✅ ${volumes.length} volumes gerados com sucesso`);
    return volumes;
  };

  const classifyVolume = (volume: Volume, area: string, classificacaoQuimica?: string) => {
    console.log('🏷️ Classificando volume:', volume.id, 'para área:', area);
    
    return {
      ...volume,
      area,
      classificacaoQuimica: classificacaoQuimica || volume.classificacaoQuimica
    };
  };

  const vincularVolumes = (etiquetaMaeId: string, volumeIds: string[], volumes: Volume[]): Volume[] => {
    console.log('🔗 Vinculando volumes à etiqueta mãe:', etiquetaMaeId);
    
    return volumes.map(volume => 
      volumeIds.includes(volume.id) 
        ? { ...volume, etiquetaMae: etiquetaMaeId }
        : volume
    );
  };

  return {
    generateVolumes,
    classifyVolume,
    vincularVolumes
  };
};
