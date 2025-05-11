
// Utility functions for calculating volumes and weights

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

// Calculate the volume in cubic meters (m³)
export const calcularVolumeCubico = (altura: number, largura: number, profundidade: number): number => {
  // Convert cm to m and calculate volume
  return (altura / 100) * (largura / 100) * (profundidade / 100);
};

// Calculate the total volume for an item considering quantity
export const calcularVolumeTotalItem = (item: VolumeItem): number => {
  const volumeUnitario = calcularVolumeCubico(item.altura, item.largura, item.profundidade);
  return volumeUnitario * item.quantidade;
};

// Calculate the total weight for an item considering quantity
export const calcularPesoTotalItem = (item: VolumeItem): number => {
  return item.peso * item.quantidade;
};

// Calculate subtotals for a nota fiscal
export const calcularSubtotaisNota = (volumes: VolumeItem[]): { volumeTotal: number; pesoTotal: number } => {
  let volumeTotal = 0;
  let pesoTotal = 0;
  
  volumes.forEach(item => {
    volumeTotal += calcularVolumeTotalItem(item);
    pesoTotal += calcularPesoTotalItem(item);
  });
  
  return { volumeTotal, pesoTotal };
};

// Calculate totals for all notas fiscais
export const calcularTotaisColeta = (notasFiscais: NotaFiscalVolume[]): { volumeTotal: number; pesoTotal: number } => {
  let volumeTotal = 0;
  let pesoTotal = 0;
  
  notasFiscais.forEach(nf => {
    const { volumeTotal: volumeNF, pesoTotal: pesoNF } = calcularSubtotaisNota(nf.volumes);
    volumeTotal += volumeNF;
    pesoTotal += pesoNF;
  });
  
  return { volumeTotal, pesoTotal };
};

// Generate a unique ID for new volume items
export const generateVolumeId = (): string => {
  return `vol-${Math.random().toString(36).substring(2, 9)}`;
};
