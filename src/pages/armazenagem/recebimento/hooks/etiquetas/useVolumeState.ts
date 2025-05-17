
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
  tipoEtiquetaMae?: string;
  tipoVolume?: 'geral' | 'quimico';
  codigoONU?: string;
  codigoRisco?: string;
  transportadora?: string;
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
