
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { NotaFiscal } from '../Faturamento';
import { NotaFiscal as OCNotaFiscal } from '@/components/carregamento/OrderDetailsForm';

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

  const calculateFreight = (notasToCalculate: NotaFiscal[]): NotaFiscal[] => {
    if (notasToCalculate.length === 0) return [];
    
    // Calculate total real weight
    const pesoTotalReal = notasToCalculate.reduce((sum, nota) => sum + nota.pesoNota, 0);
    
    // Determine if we need to use minimum weight
    const usarPesoMinimo = pesoTotalReal < cabecalhoValores.pesoMinimo;
    const pesoConsiderado = usarPesoMinimo ? cabecalhoValores.pesoMinimo : pesoTotalReal;
    
    // Calculate freight for each note
    return notasToCalculate.map(nota => {
      // Calculate weight proportion for current note
      const proporcaoPeso = nota.pesoNota / pesoTotalReal;
      
      // Calculate weight-based freight - use cabecalho values for all notes
      const fretePeso = (cabecalhoValores.fretePorTonelada / 1000) * nota.pesoNota;
      
      // Calculate express value
      const valorExpresso = fretePeso * (cabecalhoValores.aliquotaExpresso / 100);
      
      // Get additional values from header
      const paletizacao = cabecalhoValores.paletizacao * proporcaoPeso;
      const pedagio = cabecalhoValores.pedagio * proporcaoPeso;
      const valorFreteTransferencia = cabecalhoValores.valorFreteTransferencia * proporcaoPeso;
      const valorColeta = cabecalhoValores.valorColeta * proporcaoPeso;
      
      // Calculate ICMS value
      const valorBaseIcms = fretePeso + valorExpresso + paletizacao + pedagio;
      const icms = valorBaseIcms * (cabecalhoValores.aliquotaICMS / 100);
      
      // Calculate total freight to be allocated
      const freteRatear = fretePeso + valorExpresso;
      
      // Calcular o total da prestação
      const totalPrestacao = fretePeso + paletizacao + pedagio + icms;
      
      return {
        ...nota,
        fretePorTonelada: cabecalhoValores.fretePorTonelada,
        pesoMinimo: cabecalhoValores.pesoMinimo,
        aliquotaICMS: cabecalhoValores.aliquotaICMS,
        aliquotaExpresso: cabecalhoValores.aliquotaExpresso,
        valorFreteTransferencia,
        valorColeta, 
        paletizacao,
        pedagio,
        fretePeso,
        valorExpresso,
        freteRatear,
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
