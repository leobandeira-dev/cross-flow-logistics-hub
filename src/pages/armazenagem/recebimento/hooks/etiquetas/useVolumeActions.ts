
import { useState } from 'react';
import { Volume } from './useVolumeState'; // Use the correct Volume interface

export const useVolumeActions = () => {
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [generatedVolumes, setGeneratedVolumes] = useState<Volume[]>([]);

  // Função para gerar volumes com base nas informações da NF
  const generateVolumes = (
    notaFiscal: string,
    quantidadeVolumes: number,
    pesoTotal: string,
    notaFiscalData: any,
    tipoVolume: 'geral' | 'quimico' = 'geral',
    codigoONU?: string,
    codigoRisco?: string,
    classificacaoQuimica?: 'nao_perigosa' | 'perigosa' | 'nao_classificada',
    area?: string
  ): Volume[] => {
    if (!notaFiscal || quantidadeVolumes <= 0) return [];
    
    // Usar o peso da nota fiscal diretamente quando disponível
    let pesoNumerico = 0;
    if (pesoTotal) {
      pesoNumerico = parseFloat(pesoTotal.replace(/[^\d,.-]/g, '').replace(',', '.'));
    }
    const pesoMedio = pesoNumerico / quantidadeVolumes;
    
    // Limpar caracteres especiais do número da nota fiscal
    const cleanNotaFiscal = notaFiscal.replace(/[^\w]/g, '');
    
    // Obter data e hora atual
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // Formato de data/hora: ddmmhhmmss
    const dateTimeStr = `${day}${month}${hour}${minutes}${seconds}`;
    
    // Gerar volumes
    const volumes: Volume[] = [];
    
    for (let i = 1; i <= quantidadeVolumes; i++) {
      // Formato: {numeroNF}-{numeroVolume}-{ddmmhhmmss}
      const volumeNumberStr = i.toString().padStart(3, '0');
      const id = `${cleanNotaFiscal}-${volumeNumberStr}-${dateTimeStr}`;
      
      volumes.push({
        id,
        notaFiscal,
        quantidade: 1,
        etiquetado: false, // Campo obrigatório presente na interface
        // Sempre fornecer descrição obrigatória
        descricao: `Volume ${i}/${quantidadeVolumes}`,
        remetente: notaFiscalData?.fornecedor || '',
        destinatario: notaFiscalData?.destinatario || '',
        endereco: notaFiscalData?.endereco || '',
        cidade: notaFiscalData?.cidade || '',
        cidadeCompleta: `${notaFiscalData?.cidade || ''} - ${notaFiscalData?.uf || ''}`,
        uf: notaFiscalData?.uf || '',
        pesoTotal: `${pesoMedio.toFixed(2)} Kg`, // String formatada
        chaveNF: notaFiscalData?.chaveNF || '',
        tipoVolume,
        codigoONU,
        codigoRisco,
        classificacaoQuimica: tipoVolume === 'quimico' ? classificacaoQuimica || 'nao_classificada' : undefined,
        etiquetaMae: '',
        area: area || '01',
        // Números de volume corretos
        volumeNumber: i,
        totalVolumes: quantidadeVolumes
      });
    }
    
    return volumes;
  };

  // Função para classificar um volume
  const classifyVolume = (
    volume: Volume, 
    formData: any, 
    volumesArray: Volume[]
  ): Volume[] => {
    return volumesArray.map(vol => {
      if (vol.id === volume.id) {
        return {
          ...vol,
          tipoVolume: formData.tipoVolume,
          codigoONU: formData.codigoONU,
          codigoRisco: formData.codigoRisco,
          classificacaoQuimica: formData.tipoVolume === 'quimico' ? formData.classificacaoQuimica : undefined,
          area: formData.area
        };
      }
      return vol;
    });
  };

  // Função para vincular volumes a uma etiqueta mãe
  const vincularVolumes = (
    etiquetaMaeId: string,
    volumeIds: string[],
    volumesArray: Volume[]
  ): Volume[] => {
    return volumesArray.map(vol => {
      if (volumeIds.includes(vol.id)) {
        return {
          ...vol,
          etiquetaMae: etiquetaMaeId
        };
      }
      return vol;
    });
  };

  return {
    volumes,
    generatedVolumes,
    setVolumes,
    setGeneratedVolumes,
    generateVolumes,
    classifyVolume,
    vincularVolumes
  };
};
