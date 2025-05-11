export interface Volume {
  id?: string;
  altura: number;
  largura: number;
  comprimento: number;
  peso: number;
  quantidade: number;
}

export interface NotaFiscalVolume {
  numeroNF: string;
  volumes: {
    id?: string;
    altura: number;
    largura: number;
    comprimento: number;
    peso: number;
    quantidade: number;
  }[];
  remetente?: string;
  destinatario?: string;
  valorTotal?: number;
}

export const calcularVolumeTotal = (volume: Volume): number => {
  return (volume.altura * volume.largura * volume.comprimento * volume.quantidade) / 1000000;
};

export const calcularPesoCubado = (volume: Volume, fatorCubagem: number = 300): number => {
  const volumeTotal = calcularVolumeTotal(volume);
  return volumeTotal * fatorCubagem;
};

export const calcularSubtotaisNota = (volumes: Volume[]) => {
  let volumeTotal = 0;
  let pesoTotal = 0;
  let pesoCubadoTotal = 0;

  volumes.forEach(volume => {
    const volumeUnitario = (volume.altura * volume.largura * volume.comprimento) / 1000000;
    volumeTotal += volumeUnitario * volume.quantidade;
    pesoTotal += volume.peso * volume.quantidade;
    pesoCubadoTotal += calcularPesoCubado(volume)
  });

  return {
    volumeTotal,
    pesoTotal,
    pesoCubadoTotal
  };
};

export const calcularTotaisColeta = (notasFiscais: NotaFiscalVolume[]) => {
  let volumeTotal = 0;
  let pesoTotal = 0;
  let pesoCubadoTotal = 0;

  notasFiscais.forEach(notaFiscal => {
    const subtotais = calcularSubtotaisNota(notaFiscal.volumes);
    volumeTotal += subtotais.volumeTotal;
    pesoTotal += subtotais.pesoTotal;
    pesoCubadoTotal += subtotais.pesoCubadoTotal;
  });

  return {
    volumeTotal,
    pesoTotal,
    pesoCubadoTotal
  };
};
