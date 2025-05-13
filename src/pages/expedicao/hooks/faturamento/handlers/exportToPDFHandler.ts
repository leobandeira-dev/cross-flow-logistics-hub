
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { NotaFiscal } from '../../../Faturamento';
import { CabecalhoValores, TotaisCalculados } from '../types';

/**
 * Handles exporting to PDF functionality
 */
export const createExportToPDFHandler = (
  notas: NotaFiscal[],
  cabecalhoValores: CabecalhoValores,
  totaisCalculados: TotaisCalculados
) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return () => {
    if (notas.length === 0) {
      toast({
        title: "Nenhuma nota fiscal disponível",
        description: "Adicione notas fiscais antes de exportar para PDF.",
        variant: "destructive"
      });
      return;
    }

    // Open the document generation dialog
    setIsDialogOpen(true);
    
    // Return an object with the dialog state
    return {
      isDialogOpen,
      setIsDialogOpen
    };
  };
};
