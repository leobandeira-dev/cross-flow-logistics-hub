
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

// For backward compatibility with older code
export interface Volume extends Omit<VolumeItem, "id"> {
  id?: string;
}

// Função para gerar ID único para volumes
export const generateVolumeId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Função para garantir que um Volume sempre tenha um ID válido
export const ensureVolumeId = (volume: Volume | VolumeItem): VolumeItem => {
  if (volume.id) {
    return volume as VolumeItem;
  }
  return { ...volume, id: generateVolumeId() } as VolumeItem;
};

// Função para calcular o volume de um item
export const calcularVolume = (volume: VolumeItem | Volume): number => {
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

// Helper para converter arrays de Volume para VolumeItem
export const convertVolumesToVolumeItems = (volumes: Volume[]): VolumeItem[] => {
  return volumes.map(vol => ensureVolumeId(vol));
};

// Helper para converter uma nota fiscal parcial para NotaFiscalVolume completa
export const createNotaFiscal = (numeroNF: string, volumes: Volume[], remetente: string = '', destinatario: string = '', valorTotal: number = 0): NotaFiscalVolume => {
  return {
    numeroNF,
    volumes: convertVolumesToVolumeItems(volumes),
    remetente,
    destinatario,
    valorTotal
  };
};

// Helper to ensure a partial NotaFiscal has all required fields
export const ensureCompleteNotaFiscal = (
  notaFiscal: Partial<NotaFiscalVolume>, 
  defaultRemetente: string = '', 
  defaultDestinatario: string = ''
): NotaFiscalVolume => {
  return {
    numeroNF: notaFiscal.numeroNF || '',
    volumes: Array.isArray(notaFiscal.volumes) 
      ? convertVolumesToVolumeItems(notaFiscal.volumes) 
      : [],
    remetente: notaFiscal.remetente || defaultRemetente,
    destinatario: notaFiscal.destinatario || defaultDestinatario,
    valorTotal: notaFiscal.valorTotal || 0
  };
};
