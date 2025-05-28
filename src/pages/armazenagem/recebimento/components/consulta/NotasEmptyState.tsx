
import React from 'react';
import { FileX } from 'lucide-react';

interface NotasEmptyStateProps {
  isLoading: boolean;
  notasCount: number;
}

const NotasEmptyState: React.FC<NotasEmptyStateProps> = ({ isLoading, notasCount }) => {
  if (notasCount > 0 || isLoading) return null;

  return (
    <div className="text-center py-12 fade-in">
      <div className="flex flex-col items-center space-y-4">
        <div className="p-4 rounded-full bg-muted/20 text-muted-foreground">
          <FileX size={48} />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Nenhuma nota fiscal encontrada
          </h3>
          <p className="text-muted-foreground max-w-md">
            Não foram encontradas notas fiscais com os critérios de busca selecionados. 
            Tente ajustar os filtros ou termos de busca.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotasEmptyState;
