
import { useState, useCallback } from 'react';

export interface Volume {
  id: string;
  notaFiscal: string;
  chaveNF: string; // Mudado para obrigatório para compatibilidade
  remetente: string; // Mudado para obrigatório para compatibilidade
  destinatario: string; // Mudado para obrigatório para compatibilidade
  endereco: string; // Mudado para obrigatório para compatibilidade
  cidade: string; // Mudado para obrigatório para compatibilidade
  uf: string; // Mudado para obrigatório para compatibilidade
  transportadora?: string;
  descricao: string; // Mudado para obrigatório para compatibilidade
  area?: string;
  quantidade: number; // Mudado para obrigatório para compatibilidade
  pesoTotal: string; // String para compatibilidade
  numeroPedido?: string;
  volumeNumber?: number;
  totalVolumes?: number;
  codigoONU?: string;
  codigoRisco?: string;
  classificacaoQuimica?: string;
  etiquetaMae?: string;
  etiquetado: boolean; // Campo obrigatório
  cidadeCompleta?: string;
  tipoEtiquetaMae?: 'geral' | 'palete';
  tipoVolume?: 'geral' | 'quimico';
}

export const useVolumeState = () => {
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [generatedVolumes, setGeneratedVolumes] = useState<Volume[]>([]);

  // Função para gerar ID consistente baseado na nota fiscal e número do volume
  const generateConsistentVolumeId = useCallback((notaFiscal: string, volumeNumber: number): string => {
    // Limpar caracteres especiais do número da nota fiscal
    const cleanNotaFiscal = notaFiscal.replace(/[^\w]/g, '').toUpperCase();
    // Formato: NF-{numeroNF}-VOL-{numeroVolume}
    return `NF-${cleanNotaFiscal}-VOL-${volumeNumber.toString().padStart(3, '0')}`;
  }, []);

  // Função para gerar volumes com IDs consistentes
  const generateVolumes = useCallback((formData: any) => {
    const totalVolumes = parseInt(formData.quantidadeVolumes) || 1;
    const pesoTotalStr = formData.pesoTotalBruto?.toString() || '0';
    const pesoTotal = parseFloat(pesoTotalStr.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
    const pesoPorVolume = totalVolumes > 0 ? pesoTotal / totalVolumes : 0;

    const newVolumes: Volume[] = [];
    
    for (let i = 1; i <= totalVolumes; i++) {
      const volumeId = generateConsistentVolumeId(formData.notaFiscal, i);
      
      const volume: Volume = {
        id: volumeId,
        notaFiscal: formData.notaFiscal || '',
        chaveNF: formData.chaveNF || '',
        remetente: formData.remetente || '',
        destinatario: formData.destinatario || '',
        endereco: formData.endereco || '',
        cidade: formData.cidade || '',
        uf: formData.uf || '',
        transportadora: formData.transportadora || '',
        descricao: `Volume ${i}/${totalVolumes}`, // Sempre fornecer descrição
        area: formData.area || '',
        quantidade: 1,
        pesoTotal: `${pesoPorVolume.toFixed(2)} Kg`, // String formatada
        numeroPedido: formData.numeroPedido || '',
        volumeNumber: i,
        totalVolumes: totalVolumes,
        codigoONU: formData.codigoONU || '',
        codigoRisco: formData.codigoRisco || '',
        classificacaoQuimica: formData.classificacaoQuimica || '',
        etiquetaMae: formData.etiquetaMae || '',
        etiquetado: false, // Campo obrigatório
        cidadeCompleta: `${formData.cidade || ''} - ${formData.uf || ''}`,
        tipoVolume: formData.tipoVolume || 'geral'
      };
      
      newVolumes.push(volume);
    }

    setGeneratedVolumes(newVolumes);
    return newVolumes;
  }, [generateConsistentVolumeId]);

  // Função para atualizar um volume específico
  const updateVolume = useCallback((updatedVolume: Volume) => {
    setGeneratedVolumes(prev => 
      prev.map(vol => vol.id === updatedVolume.id ? updatedVolume : vol)
    );
  }, []);

  // Função para limpar os volumes
  const clearVolumes = useCallback(() => {
    setVolumes([]);
    setGeneratedVolumes([]);
  }, []);

  return {
    volumes,
    setVolumes,
    generatedVolumes,
    setGeneratedVolumes,
    generateVolumes,
    updateVolume,
    clearVolumes,
    generateConsistentVolumeId
  };
};
