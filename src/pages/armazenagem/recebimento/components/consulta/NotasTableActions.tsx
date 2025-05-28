
import React from 'react';
import ModernButton from '@/components/modern/ModernButton';
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
      <ModernButton
        size="sm"
        variant="glass"
        onClick={() => onPrintClick(nota.id)}
        icon={<Printer className="h-4 w-4" />}
      >
        DANFE
      </ModernButton>
      <ModernButton
        size="sm"
        variant="outline"
        icon={<FileText className="h-4 w-4" />}
      >
        Detalhes
      </ModernButton>
      <ModernButton
        size="sm"
        variant="ghost"
        onClick={() => onGerarEtiquetasClick(nota)}
        icon={<Tag className="h-4 w-4" />}
      >
        Etiquetas
      </ModernButton>
    </div>
  );
};

export default NotasTableActions;
