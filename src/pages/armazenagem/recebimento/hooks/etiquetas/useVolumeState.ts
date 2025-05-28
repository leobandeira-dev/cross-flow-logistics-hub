
import { useState } from 'react';

/**
 * Volume interface definition
 */
export interface Volume {
  id: string;
  notaFiscal: string;
  descricao: string;
  quantidade: number;
  etiquetado: boolean;
  remetente: string;
  destinatario: string;
  endereco: string;
  cidade: string;
  cidadeCompleta?: string;
  uf: string;
  pesoTotal: string;
  chaveNF: string;
  etiquetaMae?: string;
  tipoEtiquetaMae?: 'geral' | 'palete';
  tipoVolume?: 'geral' | 'quimico';
  codigoONU?: string;
  codigoRisco?: string;
  classificacaoQuimica?: 'nao_perigosa' | 'perigosa' | 'nao_classificada';
  transportadora?: string;
  area?: string;
  // Campos adicionais necessários
  numeroPedido?: string;
  volumeNumber?: number;
  totalVolumes?: number;
}

/**
 * Hook for managing volume state
 */
export const useVolumeState = () => {
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [generatedVolumes, setGeneratedVolumes] = useState<Volume[]>([]);

  return {
    volumes,
    generatedVolumes,
    setVolumes,
    setGeneratedVolumes
  };
};
