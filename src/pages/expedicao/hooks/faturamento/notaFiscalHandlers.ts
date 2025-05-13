
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { NotaFiscal } from '../../Faturamento';
import { NotaFiscal as OCNotaFiscal } from '@/components/carregamento/OrderDetailsForm';
import { CabecalhoValores, ImportacaoOCParams } from './types';
import { calculateFreightPerInvoice } from './calculationUtils';

/**
 * Handlers for nota fiscal operations
 */
export const createNotaFiscalHandlers = (
  notas: NotaFiscal[],
  setNotas: React.Dispatch<React.SetStateAction<NotaFiscal[]>>,
  setActiveTab: React.Dispatch<React.SetStateAction<string>>,
  cabecalhoValores: CabecalhoValores,
  setOrdemCarregamentoId: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const handleAddNotaFiscal = (nota: Omit<NotaFiscal, 'id' | 'fretePeso' | 'valorExpresso' | 'freteRatear'>) => {
    const newNota: NotaFiscal = {
      ...nota,
      id: `NF-${Math.random().toString(36).substr(2, 9)}`
    };
    
    const updatedNotas = [...notas, newNota];
    
    // If there are notes, calculate freight
    if (updatedNotas.length > 0) {
      const notasCalculated = calculateFreightPerInvoice(updatedNotas, cabecalhoValores);
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
      const notasCalculated = calculateFreightPerInvoice(updatedNotas, cabecalhoValores);
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
      const notasCalculated = calculateFreightPerInvoice([...notas], cabecalhoValores);
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
    const notasCalculated = calculateFreightPerInvoice(updatedNotas, cabecalhoValores);
    setNotas(notasCalculated);
    
    toast({
      title: "Notas fiscais importadas com sucesso",
      description: `${notasLote.length} notas fiscais foram adicionadas ao sistema.`
    });
    
    // Switch to notes tab to show the imported items
    setActiveTab("notas");
  };

  const handleImportarNotasOrdemCarregamento = ({ notasOC, ocId }: ImportacaoOCParams) => {
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
    const notasCalculated = calculateFreightPerInvoice(updatedNotas, cabecalhoValores);
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

  const handleUpdateCabecalho = (values: CabecalhoValores) => {
    // This function is implemented in the main hook as it needs to update the state
    
    // Recalculate all notes with new header values
    if (notas.length > 0) {
      const notasCalculated = calculateFreightPerInvoice([...notas], values);
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
    handleAddNotaFiscal,
    handleDeleteNotaFiscal,
    handleRecalculate,
    handleImportarLote,
    handleImportarNotasOrdemCarregamento,
    handleUpdateCabecalho,
    handleExportToPDF,
  };
};
