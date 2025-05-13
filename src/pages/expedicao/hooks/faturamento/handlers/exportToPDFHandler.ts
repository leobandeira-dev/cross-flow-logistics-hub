
import { toast } from '@/hooks/use-toast';

/**
 * Handles exporting to PDF functionality
 */
export const createExportToPDFHandler = () => {
  return () => {
    toast({
      title: "Exportando para PDF",
      description: "Esta funcionalidade será implementada em breve."
    });
  };
};
