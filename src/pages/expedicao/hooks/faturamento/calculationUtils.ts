
import { NotaFiscal } from '../../Faturamento';
import { CabecalhoValores, TotaisCalculados } from './types';

/**
 * Calcula os totais da viagem com base nos valores do cabeçalho e no peso total real
 */
export const calcularTotaisViagem = (
  cabecalhoValores: CabecalhoValores, 
  pesoTotalReal: number
): TotaisCalculados => {
  // Determine if we need to use minimum weight
  const usarPesoMinimo = pesoTotalReal < cabecalhoValores.pesoMinimo;
  const pesoConsiderado = usarPesoMinimo ? cabecalhoValores.pesoMinimo : pesoTotalReal;
  
  // Calcular frete peso viagem
  const fretePesoViagem = (cabecalhoValores.fretePorTonelada / 1000) * pesoConsiderado;
  
  // Calcular pedagio viagem
  const pedagioViagem = cabecalhoValores.pedagio;
  
  // Calcular expresso viagem
  const expressoViagem = fretePesoViagem * (cabecalhoValores.aliquotaExpresso / 100);
  
  // Calcular ICMS viagem
  const baseCalculo = fretePesoViagem + pedagioViagem + expressoViagem;
  const icmsViagem = cabecalhoValores.aliquotaICMS > 0 
    ? (baseCalculo / (100 - cabecalhoValores.aliquotaICMS) * 100) - baseCalculo 
    : 0;
  
  // Calcular total viagem
  const totalViagem = fretePesoViagem + pedagioViagem + expressoViagem + icmsViagem;
  
  return {
    fretePesoViagem,
    pedagioViagem,
    expressoViagem,
    icmsViagem,
    totalViagem
  };
};

/**
 * Calcula o frete para cada nota fiscal baseado no rateio por peso
 */
export const calculateFreightPerInvoice = (
  notasToCalculate: NotaFiscal[], 
  cabecalhoValores: CabecalhoValores
): NotaFiscal[] => {
  if (notasToCalculate.length === 0) return [];
  
  // Calculate total real weight
  const pesoTotalReal = notasToCalculate.reduce((sum, nota) => sum + nota.pesoNota, 0);
  
  // Calculate totals
  const totaisViagem = calcularTotaisViagem(cabecalhoValores, pesoTotalReal);
  const {
    fretePesoViagem,
    pedagioViagem,
    expressoViagem,
    icmsViagem
  } = totaisViagem;
  
  // Calculate freight for each note
  return notasToCalculate.map(nota => {
    // Calculate weight proportion for current note
    const proporcaoPeso = nota.pesoNota / pesoTotalReal;
    
    // Calculate weight-based freight - rateio por peso
    const fretePeso = fretePesoViagem * proporcaoPeso;
    
    // Calculate express value - rateio por peso
    const valorExpresso = expressoViagem * proporcaoPeso;
    
    // Calculate pedagio - rateio por peso
    const pedagioRateio = pedagioViagem * proporcaoPeso;
    
    // Get additional values from header
    const paletizacao = cabecalhoValores.paletizacao * proporcaoPeso;
    const valorFreteTransferencia = cabecalhoValores.valorFreteTransferencia * proporcaoPeso;
    const valorColeta = cabecalhoValores.valorColeta * proporcaoPeso;
    
    // Calculate ICMS value - rateio por peso
    const icms = icmsViagem * proporcaoPeso;
    
    // Calculate total freight to be allocated
    const freteRatear = fretePeso + valorExpresso;
    
    // Calcular o total da prestação
    const totalPrestacao = fretePeso + valorExpresso + paletizacao + pedagioRateio + icms;
    
    return {
      ...nota,
      fretePorTonelada: cabecalhoValores.fretePorTonelada,
      pesoMinimo: cabecalhoValores.pesoMinimo,
      aliquotaICMS: cabecalhoValores.aliquotaICMS,
      aliquotaExpresso: cabecalhoValores.aliquotaExpresso,
      valorFreteTransferencia,
      valorColeta, 
      paletizacao,
      pedagio: pedagioRateio,
      fretePeso,
      valorExpresso,
      freteRatear,
      icms,
      totalPrestacao
    };
  });
};
