
import { useState, useEffect } from 'react';
import { NotaFiscal } from '../Faturamento';
import { calcularTotaisViagem, calculateFreightPerInvoice } from './faturamento/calculationUtils';
import { createNotaFiscalHandlers } from './faturamento/notaFiscalHandlers';
import { CabecalhoValores, TotaisCalculados } from './faturamento/types';
import { toast } from '@/hooks/use-toast';

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
    // Calculate total real weight, ensuring we have valid numbers
    const pesoTotalReal = notas.reduce((sum, nota) => {
      const peso = isNaN(nota.pesoNota) ? 0 : nota.pesoNota;
      return sum + peso;
    }, 0);
    
    // Calculate totals using the utility function
    const totais = calcularTotaisViagem(cabecalhoValores, pesoTotalReal);
    
    // Update state with calculated totals
    setTotaisCalculados(totais);
  };

  // Handle the rateio of values to each nota fiscal
  const handleRatear = () => {
    if (notas.length > 0) {
      try {
        const notasCalculated = calculateFreightPerInvoice([...notas], cabecalhoValores);
        setNotas(notasCalculated);
        
        toast({
          title: "Valores rateados com sucesso",
          description: "Os valores foram rateados entre todas as notas fiscais."
        });
      } catch (error) {
        console.error("Erro ao ratear valores:", error);
        toast({
          title: "Erro ao ratear valores",
          description: "Ocorreu um erro ao calcular o rateio. Verifique os valores informados.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Nenhuma nota fiscal disponível",
        description: "Adicione notas fiscais antes de ratear valores.",
        variant: "destructive"
      });
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
    // Ensure all numeric values are valid numbers
    const sanitizedValues: CabecalhoValores = {
      fretePorTonelada: isNaN(values.fretePorTonelada) ? 0 : values.fretePorTonelada,
      pesoMinimo: isNaN(values.pesoMinimo) ? 0 : values.pesoMinimo,
      aliquotaICMS: isNaN(values.aliquotaICMS) ? 0 : values.aliquotaICMS,
      aliquotaExpresso: isNaN(values.aliquotaExpresso) ? 0 : values.aliquotaExpresso,
      valorFreteTransferencia: isNaN(values.valorFreteTransferencia) ? 0 : values.valorFreteTransferencia,
      valorColeta: isNaN(values.valorColeta) ? 0 : values.valorColeta,
      paletizacao: isNaN(values.paletizacao) ? 0 : values.paletizacao,
      pedagio: isNaN(values.pedagio) ? 0 : values.pedagio,
    };
    
    setCabecalhoValores(sanitizedValues);
    
    toast({
      title: "Parâmetros atualizados",
      description: "Clique em 'Ratear Valores' para aplicar às notas fiscais."
    });
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
