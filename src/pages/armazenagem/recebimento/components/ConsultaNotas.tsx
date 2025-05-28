
import React from 'react';
import ModernCard from '@/components/modern/ModernCard';
import DataTable from '@/components/common/DataTable';
import SearchFilter from '@/components/common/SearchFilter';
import { FileText } from 'lucide-react';
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
    <div className="fade-in">
      <ModernCard className="p-6">
        {/* Header com ícone e título */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="text-xl font-heading text-foreground">
              Consulta de Notas Fiscais
            </h2>
            <p className="text-sm text-muted-foreground">
              Gerencie e acompanhe suas notas fiscais
            </p>
          </div>
        </div>

        {/* Filtros de busca com estilo moderno */}
        <div className="mb-6">
          <SearchFilter 
            placeholder="Buscar por número, chave de acesso ou razão social..." 
            filters={notasFilterConfig} 
            onSearch={handleSearch}
          />
        </div>
        
        {/* Tabela com estilo glassmorphism */}
        <div className="glass-card rounded-xl overflow-hidden border border-border/20">
          <DataTable
            columns={columns}
            data={notasFormatadas}
          />
        </div>
        
        <NotasEmptyState isLoading={isLoading} notasCount={notasFormatadas.length} />
      </ModernCard>
    </div>
  );
};

export default ConsultaNotas;
