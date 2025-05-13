
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { NotaFiscal } from '../Faturamento';
import { NotaFiscal as OCNotaFiscal } from '@/components/carregamento/OrderDetailsForm';

// Interface para os totais calculados
interface TotaisCalculados {
  fretePesoViagem: number;
  pedagioViagem: number;
  expressoViagem: number;
  icmsViagem: number;
  totalViagem: number;
}

export const useFaturamento = () => {
  const [notas, setNotas] = useState<NotaFiscal[]>([]);
  const [activeTab, setActiveTab] = useState("notas");
  const [ordemCarregamentoId, setOrdemCarregamentoId] = useState<string | null>(null);
  const [cabecalhoValores, setCabecalhoValores] = useState({
    fretePorTonelada: 0,
    pesoMinimo: 0,
    aliquotaICMS: 0,
    aliquotaExpresso: 0,
    valorFreteTransferencia: 0,
    valorColeta: 0,
    paletizacao: 0,
    pedagio: 0,
  });
  const [totaisCalculados, setTotaisCalculados] = useState<TotaisCalculados>({
    fretePesoViagem: 0,
    pedagioViagem: 0,
    expressoViagem: 0,
    icmsViagem: 0,
    totalViagem: 0
  });

  // Calcular totais sempre que o cabeçalho ou as notas mudam
  useEffect(() => {
    if (notas.length > 0) {
      calcularTotais();
    }
  }, [cabecalhoValores, notas]);

  const calcularTotais = () => {
    // Calculate total real weight
    const pesoTotalReal = notas.reduce((sum, nota) => sum + nota.pesoNota, 0);
    
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
    
    setTotaisCalculados({
      fretePesoViagem,
      pedagioViagem,
      expressoViagem,
      icmsViagem,
      totalViagem
    });
  };

  const calculateFreight = (notasToCalculate: NotaFiscal[]): NotaFiscal[] => {
    if (notasToCalculate.length === 0) return [];
    
    // Calculate total real weight
    const pesoTotalReal = notasToCalculate.reduce((sum, nota) => sum + nota.pesoNota, 0);
    
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

  const handleAddNotaFiscal = (nota: Omit<NotaFiscal, 'id' | 'fretePeso' | 'valorExpresso' | 'freteRatear'>) => {
    const newNota: NotaFiscal = {
      ...nota,
      id: `NF-${Math.random().toString(36).substr(2, 9)}`
    };
    
    const updatedNotas = [...notas, newNota];
    
    // If there are notes, calculate freight
    if (updatedNotas.length > 0) {
      const notasCalculated = calculateFreight(updatedNotas);
      setNotas(notasCalculated);
      
      toast({
        title: "Nota fiscal adicionada com sucesso",
        description: `Nota para ${nota.cliente} em ${format(nota.data, 'dd/MM/yyyy')} adicionada.`
      });
    }
  };

  const handleDeleteNotaFiscal = (id: string) => {
    const updatedNotas = notas.filter(nota => nota.id !== id);
    
    // If there are still notes, recalculate
    if (updatedNotas.length > 0) {
      const notasCalculated = calculateFreight(updatedNotas);
      setNotas(notasCalculated);
    } else {
      setNotas([]);
    }
    
    toast({
      title: "Nota fiscal removida",
      description: "A nota fiscal foi removida com sucesso."
    });
  };

  const handleRecalculate = () => {
    if (notas.length > 0) {
      const notasCalculated = calculateFreight([...notas]);
      setNotas(notasCalculated);
      
      toast({
        title: "Frete recalculado",
        description: "Valores de frete foram recalculados com sucesso."
      });
    }
  };

  const handleImportarLote = (notasLote: Omit<NotaFiscal, 'id' | 'fretePeso' | 'valorExpresso' | 'freteRatear'>[]) => {
    if (notasLote.length === 0) return;
    
    // Generate IDs for new notes
    const notasComId = notasLote.map(nota => ({
      ...nota,
      id: `NF-${Math.random().toString(36).substr(2, 9)}`
    }));
    
    // Combine with existing notes
    const updatedNotas = [...notas, ...notasComId];
    
    // Calculate freight
    const notasCalculated = calculateFreight(updatedNotas);
    setNotas(notasCalculated);
    
    toast({
      title: "Notas fiscais importadas com sucesso",
      description: `${notasLote.length} notas fiscais foram adicionadas ao sistema.`
    });
    
    // Switch to notes tab to show the imported items
    setActiveTab("notas");
  };

  const handleImportarNotasOrdemCarregamento = (notasOC: OCNotaFiscal[], ocId: string) => {
    if (notasOC.length === 0) return;
    
    // Map OC invoices to our invoice format
    const notasParaImportar = notasOC.map(notaOC => {
      const dataEmissao = new Date(notaOC.dataEmissao);
      
      return {
        id: `NF-${Math.random().toString(36).substr(2, 9)}`,
        data: new Date(),
        cliente: notaOC.cliente,
        remetente: notaOC.remetente,
        notaFiscal: notaOC.numero,
        pedido: notaOC.pedido || '',
        dataEmissao: dataEmissao,
        pesoNota: notaOC.pesoBruto,
        valorNF: notaOC.valor,
        fretePorTonelada: cabecalhoValores.fretePorTonelada,
        pesoMinimo: cabecalhoValores.pesoMinimo,
        valorFreteTransferencia: 0,
        cteColeta: '',
        valorColeta: 0,
        cteTransferencia: '',
        paletizacao: 0,
        pedagio: 0,
        aliquotaICMS: cabecalhoValores.aliquotaICMS,
        aliquotaExpresso: cabecalhoValores.aliquotaExpresso,
      } as NotaFiscal;
    });
    
    // Combine with existing notes
    const updatedNotas = [...notas, ...notasParaImportar];
    
    // Calculate freight with header values
    const notasCalculated = calculateFreight(updatedNotas);
    setNotas(notasCalculated);
    
    // Set the load order ID
    setOrdemCarregamentoId(ocId);
    
    toast({
      title: "Notas fiscais importadas da OC",
      description: `${notasParaImportar.length} notas fiscais foram importadas da OC ${ocId}.`
    });
    
    // Switch to notes tab to show the imported items
    setActiveTab("notas");
  };

  const handleUpdateCabecalho = (values: typeof cabecalhoValores) => {
    setCabecalhoValores(values);
    
    // Recalculate all notes with new header values
    if (notas.length > 0) {
      const notasCalculated = calculateFreight([...notas]);
      setNotas(notasCalculated);
      
      toast({
        title: "Valores do cabeçalho atualizados",
        description: "Todos os cálculos foram atualizados com os novos valores."
      });
    }
  };

  const handleExportToPDF = () => {
    toast({
      title: "Exportando para PDF",
      description: "Esta funcionalidade será implementada em breve."
    });
  };

  return {
    notas,
    activeTab,
    cabecalhoValores,
    totaisCalculados,
    ordemCarregamentoId,
    setActiveTab,
    handleAddNotaFiscal,
    handleDeleteNotaFiscal,
    handleRecalculate,
    handleImportarLote,
    handleImportarNotasOrdemCarregamento,
    handleUpdateCabecalho,
    handleExportToPDF,
  };
};
