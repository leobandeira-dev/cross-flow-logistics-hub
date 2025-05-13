
import { toast } from '@/hooks/use-toast';
import { NotaFiscal } from '../../../Faturamento';
import { TotaisCalculados } from '../types';

/**
 * Handles exporting to PDF functionality
 */
export const createExportToPDFHandler = (
  notas: NotaFiscal[],
  cabecalhoValores: any,
  totaisCalculados: TotaisCalculados
) => {
  return () => {
    if (notas.length === 0) {
      toast({
        title: "Nenhuma nota fiscal disponível",
        description: "Adicione notas fiscais antes de exportar para PDF."
      });
      return;
    }
    
    // Este handler agora apenas mostra o dialog de geração do documento
    // A impressão real será feita pelo componente DocumentPDFGenerator
    document.dispatchEvent(new CustomEvent('openDocumentDialog', {
      detail: {
        notas,
        cabecalhoValores,
        totaisCalculados
      }
    }));
  };
};
