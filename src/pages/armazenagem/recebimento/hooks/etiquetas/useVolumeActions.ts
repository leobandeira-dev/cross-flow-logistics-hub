
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Volume } from '../../components/etiquetas/VolumesTable';
import { EtiquetaGenerationResult } from '@/hooks/etiquetas/types';

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
    classificacaoQuimica?: 'nao_perigosa' | 'perigosa' | 'nao_classificada'
  ): Volume[] => {
    if (!notaFiscal || quantidadeVolumes <= 0) return [];
    
    // Usar o peso da nota fiscal diretamente quando disponível
    let pesoNumerico = 0;
    if (pesoTotal) {
      pesoNumerico = parseFloat(pesoTotal.replace(/[^\d,.-]/g, '').replace(',', '.'));
    }
    const pesoMedio = pesoNumerico / quantidadeVolumes;
    
    // Gerar ID único para ser usado em todos os volumes da mesma nota
    const uniqueId = uuidv4().split('-')[0];
    
    // Obter data atual no formato ddmmaa
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear()).slice(-2);
    const dateFormat = `${day}${month}${year}`;
    
    // Gerar volumes
    const volumes: Volume[] = [];
    
    for (let i = 1; i <= quantidadeVolumes; i++) {
      // Formato: "id unico"-"numero da nota"-"ddmmaa"-"1,2,3 etc"
      const id = `${uniqueId}-${notaFiscal}-${dateFormat}-${i.toString().padStart(3, '0')}`;
      
      volumes.push({
        id,
        notaFiscal,
        quantidade: 1,
        etiquetado: false,
        descricao: `Volume ${i} de ${quantidadeVolumes}`,
        remetente: notaFiscalData?.fornecedor || '',
        destinatario: notaFiscalData?.destinatario || '',
        endereco: notaFiscalData?.endereco || '',
        cidade: notaFiscalData?.cidade || '',
        cidadeCompleta: `${notaFiscalData?.cidade || ''} - ${notaFiscalData?.uf || ''}`,
        uf: notaFiscalData?.uf || '',
        pesoTotal: notaFiscalData?.pesoTotal || `${pesoMedio.toFixed(2)} Kg`,
        chaveNF: notaFiscalData?.chaveNF || '',
        tipoVolume,
        codigoONU,
        codigoRisco,
        classificacaoQuimica: tipoVolume === 'quimico' ? classificacaoQuimica || 'nao_classificada' : undefined,
        etiquetaMae: '',
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
          classificacaoQuimica: formData.tipoVolume === 'quimico' ? formData.classificacaoQuimica : undefined
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
