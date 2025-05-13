
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { NotaFiscal } from '../../Faturamento';
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
    try {
      // Ensure pesoNota is a valid number
      const pesoNota = isNaN(Number(nota.pesoNota)) ? 0 : Number(nota.pesoNota);
      
      const newNota: NotaFiscal = {
        ...nota,
        id: `NF-${Math.random().toString(36).substr(2, 9)}`,
        pesoNota: pesoNota
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
    } catch (error) {
      console.error("Erro ao adicionar nota fiscal:", error);
      toast({
        title: "Erro ao adicionar nota fiscal",
        description: "Verifique se todos os campos estão preenchidos corretamente.",
        variant: "destructive"
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
      try {
        // Ensure all notes have valid numeric values
        const sanitizedNotas = notas.map(nota => ({
          ...nota,
          pesoNota: isNaN(Number(nota.pesoNota)) ? 0 : Number(nota.pesoNota)
        }));
        
        const notasCalculated = calculateFreightPerInvoice(sanitizedNotas, cabecalhoValores);
        setNotas(notasCalculated);
        
        toast({
          title: "Frete recalculado",
          description: "Valores de frete foram recalculados e rateados com sucesso."
        });
      } catch (error) {
        console.error("Erro ao recalcular frete:", error);
        toast({
          title: "Erro ao recalcular frete",
          description: "Verifique se todos os parâmetros foram preenchidos corretamente.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Nenhuma nota fiscal disponível",
        description: "Adicione notas fiscais antes de recalcular o frete.",
        variant: "destructive"
      });
    }
  };

  const handleImportarLote = (notasLote: Omit<NotaFiscal, 'id' | 'fretePeso' | 'valorExpresso' | 'freteRatear'>[]) => {
    if (notasLote.length === 0) return;
    
    try {
      // Generate IDs for new notes and ensure numeric values are valid
      const notasComId = notasLote.map(nota => ({
        ...nota,
        id: `NF-${Math.random().toString(36).substr(2, 9)}`,
        pesoNota: isNaN(Number(nota.pesoNota)) ? 0 : Number(nota.pesoNota)
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
    } catch (error) {
      console.error("Erro ao importar lote:", error);
      toast({
        title: "Erro ao importar lote",
        description: "Verifique os dados das notas fiscais e tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleImportarNotasOrdemCarregamento = ({ notasOC, ocId }: ImportacaoOCParams) => {
    if (notasOC.length === 0) return;
    
    try {
      // Map OC invoices to our invoice format
      const notasParaImportar = notasOC.map(notaOC => {
        const dataEmissao = new Date(notaOC.dataEmissao);
        const pesoBruto = isNaN(Number(notaOC.pesoBruto)) ? 0 : Number(notaOC.pesoBruto);
        const valor = isNaN(Number(notaOC.valor)) ? 0 : Number(notaOC.valor);
        
        return {
          id: `NF-${Math.random().toString(36).substr(2, 9)}`,
          data: new Date(),
          cliente: notaOC.cliente || '',
          remetente: notaOC.remetente || '',
          notaFiscal: notaOC.numero || '',
          pedido: notaOC.pedido || '',
          dataEmissao: dataEmissao,
          pesoNota: pesoBruto,
          valorNF: valor,
          fretePorTonelada: Number(cabecalhoValores.fretePorTonelada) || 0,
          pesoMinimo: Number(cabecalhoValores.pesoMinimo) || 0,
          valorFreteTransferencia: 0,
          cteColeta: '',
          valorColeta: 0,
          cteTransferencia: '',
          paletizacao: 0,
          pedagio: 0,
          aliquotaICMS: Number(cabecalhoValores.aliquotaICMS) || 0,
          aliquotaExpresso: Number(cabecalhoValores.aliquotaExpresso) || 0,
          fretePeso: 0,
          valorExpresso: 0,
          freteRatear: 0,
          icms: 0,
          totalPrestacao: 0
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
    } catch (error) {
      console.error("Erro ao importar notas da OC:", error);
      toast({
        title: "Erro ao importar notas da OC",
        description: "Verifique os dados das notas fiscais da OC e tente novamente.",
        variant: "destructive"
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
    handleExportToPDF,
  };
};
