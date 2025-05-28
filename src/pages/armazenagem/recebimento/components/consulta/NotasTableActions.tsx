
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Printer, Tag } from 'lucide-react';
import { NotaFiscal } from '@/types/supabase.types';

interface NotasTableActionsProps {
  nota: NotaFiscal;
  onPrintClick: (notaId: string) => void;
  onGerarEtiquetasClick: (nota: NotaFiscal) => void;
}

const NotasTableActions: React.FC<NotasTableActionsProps> = ({
  nota,
  onPrintClick,
  onGerarEtiquetasClick
}) => {
  return (
    <div className="flex space-x-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => onPrintClick(nota.id)}
      >
        <Printer className="h-4 w-4 mr-1" />
        DANFE
      </Button>
      <Button
        size="sm"
        variant="outline"
      >
        <FileText className="h-4 w-4 mr-1" />
        Detalhes
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onGerarEtiquetasClick(nota)}
      >
        <Tag className="h-4 w-4 mr-1" />
        Etiquetas
      </Button>
    </div>
  );
};

export default NotasTableActions;
