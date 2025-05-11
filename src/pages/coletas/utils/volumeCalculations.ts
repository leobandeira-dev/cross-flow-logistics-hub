
// Utility functions for volume calculations in collection requests

export interface VolumeItem {
  id: string;
  altura: number;
  largura: number;
  profundidade: number;
  peso: number;
  quantidade: number;
}

export interface NotaFiscalVolume {
  numeroNF: string;
  volumes: VolumeItem[];
}

export interface VolumeSubtotals {
  volumeTotal: number;
  pesoTotal: number;
  pesoCubadoTotal: number;
}

export const generateVolumeId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Calculate volume in cubic meters (m³)
export const calcularVolume = (altura: number, largura: number, profundidade: number): number => {
  // Convert cm³ to m³
  return (altura * largura * profundidade) / 1000000;
};

// Calculate cubated weight (peso cubado) using the formula: volume in m³ * 300
export const calcularPesoCubado = (volume: number): number => {
  return volume * 300; // Standard factor is 300 kg/m³
};

// Calculate volume for a single item considering quantity
export const calcularVolumeTotalItem = (item: VolumeItem): number => {
  const volumeUnitario = calcularVolume(item.altura, item.largura, item.profundidade);
  return volumeUnitario * item.quantidade;
};

// Calculate total weight for a single item considering quantity
export const calcularPesoTotalItem = (item: VolumeItem): number => {
  return item.peso * item.quantidade;
};

// Calculate subtotals for a single invoice's volumes
export const calcularSubtotaisNota = (volumes: VolumeItem[]): VolumeSubtotals => {
  let volumeTotal = 0;
  let pesoTotal = 0;
  let pesoCubadoTotal = 0;
  
  volumes.forEach(item => {
    const volumeItem = calcularVolume(item.altura, item.largura, item.profundidade);
    volumeTotal += volumeItem * item.quantidade;
    pesoTotal += item.peso * item.quantidade;
    pesoCubadoTotal += calcularPesoCubado(volumeItem) * item.quantidade;
  });
  
  return {
    volumeTotal,
    pesoTotal,
    pesoCubadoTotal
  };
};

// Calculate total volumes, weight, and cubated weight for the entire collection request
export const calcularTotaisColeta = (notasFiscais: NotaFiscalVolume[]): VolumeSubtotals => {
  const totais = notasFiscais.reduce<VolumeSubtotals>(
    (acc, nf) => {
      const subtotais = calcularSubtotaisNota(nf.volumes);
      return {
        volumeTotal: acc.volumeTotal + subtotais.volumeTotal,
        pesoTotal: acc.pesoTotal + subtotais.pesoTotal,
        pesoCubadoTotal: acc.pesoCubadoTotal + subtotais.pesoCubadoTotal
      };
    },
    { volumeTotal: 0, pesoTotal: 0, pesoCubadoTotal: 0 }
  );
  
  return totais;
};

// Create an empty volume template
export const criarVolumeVazio = (): VolumeItem => {
  return {
    id: generateVolumeId(),
    altura: 0,
    largura: 0,
    profundidade: 0,
    peso: 0,
    quantidade: 1
  };
};
