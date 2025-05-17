
import React from 'react';
import { Button } from '@/components/ui/button';
import { Route, Tag, Map } from 'lucide-react';
import SearchFilter from '@/components/common/SearchFilter';
import { filterConfig } from './filterConfig';

interface TableHeaderProps {
  onSearch: (value: string) => void;
  selectedCargasIds: string[];
  setIsRoteirizacaoModalOpen: (isOpen: boolean) => void;
  setIsAlocacaoModalOpen: (isOpen: boolean) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  onSearch,
  selectedCargasIds,
  setIsRoteirizacaoModalOpen,
  setIsAlocacaoModalOpen
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <SearchFilter
        placeholder="Buscar por destino, origem ou número da coleta..."
        onSearch={onSearch}
        filters={filterConfig}
      />
      
      <div className="flex gap-2 w-full sm:w-auto">
        <Button 
          variant="outline" 
          className="flex-1 sm:flex-none"
          onClick={() => setIsRoteirizacaoModalOpen(true)}
          disabled={selectedCargasIds.length === 0}
        >
          <Route className="mr-2 h-4 w-4" /> Roteirizar
        </Button>
        
        <Button 
          className="flex-1 sm:flex-none"
          onClick={() => setIsAlocacaoModalOpen(true)}
          disabled={selectedCargasIds.length === 0}
        >
          <Tag className="mr-2 h-4 w-4" /> Alocar Selecionados
        </Button>

        <Button 
          variant="outline"
          className="flex-1 sm:flex-none"
          onClick={() => setIsRoteirizacaoModalOpen(true)}
        >
          <Map className="mr-2 h-4 w-4" /> Ver Mapa
        </Button>
      </div>
    </div>
  );
};

export default TableHeader;
