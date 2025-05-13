
import { useState, useEffect } from 'react';
import { NotaFiscal } from '../Faturamento';
import { calcularTotaisViagem, calculateFreightPerInvoice } from './faturamento/calculationUtils';
import { createNotaFiscalHandlers } from './faturamento/notaFiscalHandlers';
import { CabecalhoValores, TotaisCalculados } from './faturamento/types';

export const useFaturamento = () => {
  const [notas, setNotas] = useState<NotaFiscal[]>([]);
  const [activeTab, setActiveTab] = useState("notas");
  const [ordemCarregamentoId, setOrdemCarregamentoId] = useState<string | null>(null);
  
  // Estado para os valores de cabeçalho
  const [cabecalhoValores, setCabecalhoValores] = useState<CabecalhoValores>({
    fretePorTonelada: 0,
    pesoMinimo: 0,
    aliquotaICMS: 0,
    aliquotaExpresso: 0,
    valorFreteTransferencia: 0,
    valorColeta: 0,
    paletizacao: 0,
    pedagio: 0,
  });
  
  // Estado para os totais calculados
  const [totaisCalculados, setTotaisCalculados] = useState<TotaisCalculados>({
    fretePesoViagem: 0,
    pedagioViagem: 0,
    expressoViagem: 0,
    icmsViagem: 0,
    totalViagem: 0
  });

  // Calcular totais sempre que o cabeçalho ou as notas mudam
  useEffect(() => {
    calcularTotais();
  }, [cabecalhoValores, notas]);

  const calcularTotais = () => {
    // Calculate total real weight
    const pesoTotalReal = notas.reduce((sum, nota) => sum + nota.pesoNota, 0);
    
    // Calculate totals using the utility function
    const totais = calcularTotaisViagem(cabecalhoValores, pesoTotalReal);
    
    // Update state with calculated totals
    setTotaisCalculados(totais);
  };

  // Handle the rateio of values to each nota fiscal
  const handleRatear = () => {
    if (notas.length > 0) {
      const notasCalculated = calculateFreightPerInvoice([...notas], cabecalhoValores);
      setNotas(notasCalculated);
    }
  };

  // Create all nota fiscal handlers using the handlers utility
  const handlers = createNotaFiscalHandlers(
    notas,
    setNotas,
    setActiveTab,
    cabecalhoValores,
    setOrdemCarregamentoId
  );

  // Implement the handleUpdateCabecalho handler here since it needs to update state
  const handleUpdateCabecalho = (values: CabecalhoValores) => {
    setCabecalhoValores(values);
    
    // Recalculate all notes with new header values if there are notes
    if (notas.length > 0) {
      const notasCalculated = calculateFreightPerInvoice([...notas], values);
      setNotas(notasCalculated);
    }
  };

  return {
    notas,
    activeTab,
    cabecalhoValores,
    totaisCalculados,
    ordemCarregamentoId,
    setActiveTab,
    handleAddNotaFiscal: handlers.handleAddNotaFiscal,
    handleDeleteNotaFiscal: handlers.handleDeleteNotaFiscal,
    handleRecalculate: handlers.handleRecalculate,
    handleImportarLote: handlers.handleImportarLote,
    handleImportarNotasOrdemCarregamento: handlers.handleImportarNotasOrdemCarregamento,
    handleUpdateCabecalho,
    handleExportToPDF: handlers.handleExportToPDF,
    handleRatear,
  };
};
