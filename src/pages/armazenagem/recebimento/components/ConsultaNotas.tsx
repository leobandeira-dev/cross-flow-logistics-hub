
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DataTable from '@/components/common/DataTable';
import SearchFilter from '@/components/common/SearchFilter';
import { notasFilterConfig } from './consulta/NotasFilterConfig';
import { createNotasTableColumns } from './consulta/NotasTableColumns';
import { useNotasData } from './consulta/useNotasData';
import { useNotasNavigation } from './consulta/useNotasNavigation';
import { formatarNotasParaTabela } from './consulta/NotasDataFormatter';
import NotasLoadingState from './consulta/NotasLoadingState';
import NotasEmptyState from './consulta/NotasEmptyState';

interface ConsultaNotasProps {
  onPrintClick: (notaId: string) => void;
}

const ConsultaNotas: React.FC<ConsultaNotasProps> = ({ onPrintClick }) => {
  const { notasFiscais, isLoading, handleSearch } = useNotasData();
  const { handleGerarEtiquetasClick } = useNotasNavigation();

  const notasFormatadas = formatarNotasParaTabela(notasFiscais);
  const columns = createNotasTableColumns({ onPrintClick, onGerarEtiquetasClick: handleGerarEtiquetasClick });

  if (isLoading) {
    return <NotasLoadingState />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consulta de Notas Fiscais</CardTitle>
      </CardHeader>
      <CardContent>
        <SearchFilter 
          placeholder="Buscar por número, chave de acesso ou razão social..." 
          filters={notasFilterConfig} 
          onSearch={handleSearch}
        />
        
        <div className="rounded-md border">
          <DataTable
            columns={columns}
            data={notasFormatadas}
          />
        </div>
        
        <NotasEmptyState isLoading={isLoading} notasCount={notasFormatadas.length} />
      </CardContent>
    </Card>
  );
};

export default ConsultaNotas;
