
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
  // New optional fields for tracking
  status?: string;
  prioridade?: string;
  dataEmissao?: string;
  chaveNF?: string;
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
    valorTotal: notaFiscal.valorTotal || 0,
    status: notaFiscal.status || 'pendente',
    prioridade: notaFiscal.prioridade || 'normal',
    dataEmissao: notaFiscal.dataEmissao,
    chaveNF: notaFiscal.chaveNF
  };
};

// Helper para converter arrays de Volume para VolumeItem
export const convertVolumesToVolumeItems = (volumes: Volume[]): VolumeItem[] => {
  return volumes.map(vol => ensureVolumeId(vol));
};

// Helper para converter uma nota fiscal parcial para NotaFiscalVolume completa
export const createNotaFiscal = (
  numeroNF: string, 
  volumes: Volume[], 
  remetente: string = '', 
  destinatario: string = '', 
  valorTotal: number = 0,
  status: string = 'pendente',
  prioridade: string = 'normal',
  dataEmissao?: string,
  chaveNF?: string
): NotaFiscalVolume => {
  return {
    numeroNF,
    volumes: convertVolumesToVolumeItems(volumes),
    remetente,
    destinatario,
    valorTotal,
    status,
    prioridade,
    dataEmissao,
    chaveNF
  };
};

// Função para calcular o volume de um item
export const calcularVolume = (volume: VolumeItem | Volume): number => {
  // Medidas são em centímetros, então convertemos para metros ao dividir por 100 para cada dimensão
  // Multiplicamos pela quantidade para obter o volume total de todos os itens iguais
  return (volume.altura / 100) * (volume.largura / 100) * (volume.comprimento / 100) * volume.quantidade;
};

// Função para calcular o peso cubado de um volume
export const calcularPesoCubado = (volumeMetroCubico: number): number => {
  // Fator de conversão padrão de 300kg/m³
  const FATOR_CONVERSAO = 300;
  return volumeMetroCubico * FATOR_CONVERSAO;
};

// Função para formatar número com 3 casas decimais
export const formatarNumero = (numero: number): string => {
  return numero.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
};

// Função para formatar números como moeda
export const formatarMoeda = (valor: number): string => {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// Função para calcular totais de uma nota fiscal
export const calcularTotaisNota = (volumes: VolumeItem[]): { 
  volumeTotal: number; 
  pesoTotal: number; 
  pesoCubadoTotal: number;
  qtdVolumes: number;
} => {
  let volumeTotal = 0;
  let pesoTotal = 0;
  let qtdVolumes = 0;

  volumes.forEach(vol => {
    const volume = calcularVolume(vol);
    volumeTotal += volume;
    pesoTotal += vol.peso * vol.quantidade;
    qtdVolumes += vol.quantidade;
  });

  const pesoCubadoTotal = calcularPesoCubado(volumeTotal);

  return {
    volumeTotal,
    pesoTotal,
    pesoCubadoTotal,
    qtdVolumes
  };
};

// Função para calcular totais de todas as notas fiscais em uma coleta
export const calcularTotaisColeta = (notasFiscais: NotaFiscalVolume[]): { 
  volumeTotal: number; 
  pesoTotal: number; 
  pesoCubadoTotal: number;
  qtdVolumes: number;
} => {
  let volumeTotal = 0;
  let pesoTotal = 0;
  let pesoCubadoTotal = 0;
  let qtdVolumes = 0;

  notasFiscais.forEach(nf => {
    const totaisNota = calcularTotaisNota(nf.volumes);
    volumeTotal += totaisNota.volumeTotal;
    pesoTotal += totaisNota.pesoTotal;
    pesoCubadoTotal += totaisNota.pesoCubadoTotal;
    qtdVolumes += totaisNota.qtdVolumes;
  });

  return {
    volumeTotal,
    pesoTotal,
    pesoCubadoTotal,
    qtdVolumes
  };
};
