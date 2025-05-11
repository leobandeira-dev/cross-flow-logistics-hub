export interface VolumeItem {
  id: string;
  altura: number;
  largura: number;
  comprimento: number;
  peso: number;
  quantidade: number;
}

export interface NotaFiscalVolume {
  numeroNF: string;
  volumes: VolumeItem[];
  remetente: string;
  destinatario: string;
  valorTotal: number;
}

// Função para gerar ID único para volumes
export const generateVolumeId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Função para calcular o volume de um item
export const calcularVolume = (volume: VolumeItem): number => {
  return volume.altura * volume.largura * volume.comprimento * volume.quantidade;
};

// Função para calcular o peso cubado de um volume
export const calcularPesoCubado = (volumeMetroCubico: number): number => {
  // Fator de conversão padrão de 300kg/m³
  const FATOR_CONVERSAO = 300;
  return volumeMetroCubico * FATOR_CONVERSAO;
};

// Função para calcular totais de uma nota fiscal
export const calcularTotaisNota = (volumes: VolumeItem[]): { volumeTotal: number; pesoTotal: number; pesoCubadoTotal: number } => {
  let volumeTotal = 0;
  let pesoTotal = 0;

  volumes.forEach(vol => {
    const volume = calcularVolume(vol);
    volumeTotal += volume;
    pesoTotal += vol.peso * vol.quantidade;
  });

  const pesoCubadoTotal = calcularPesoCubado(volumeTotal);

  return {
    volumeTotal,
    pesoTotal,
    pesoCubadoTotal
  };
};

// Função para calcular totais de todas as notas fiscais em uma coleta
export const calcularTotaisColeta = (notasFiscais: NotaFiscalVolume[]): { volumeTotal: number; pesoTotal: number; pesoCubadoTotal: number } => {
  let volumeTotal = 0;
  let pesoTotal = 0;
  let pesoCubadoTotal = 0;

  notasFiscais.forEach(nf => {
    const totaisNota = calcularTotaisNota(nf.volumes);
    volumeTotal += totaisNota.volumeTotal;
    pesoTotal += totaisNota.pesoTotal;
    pesoCubadoTotal += totaisNota.pesoCubadoTotal;
  });

  return {
    volumeTotal,
    pesoTotal,
    pesoCubadoTotal
  };
};
