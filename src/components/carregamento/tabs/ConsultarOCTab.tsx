
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import SearchFilter from '@/components/common/SearchFilter';
import { FileText, Truck } from 'lucide-react';
import { FilterConfig } from '@/components/common/SearchFilter';
import { useOrdemCarregamento } from '@/hooks/carregamento';
import { useSearchParams } from 'react-router-dom';
import ImportarNotasDialog from '@/components/carregamento/ImportarNotasDialog';

const ConsultarOCTab: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
    status: 'all',
    periodo: 'all'
  });
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [selectedOrdemId, setSelectedOrdemId] = useState<string | null>(null);

  const { 
    isLoading,
    ordensCarregamento, 
    notasFiscaisDisponiveis, 
    fetchOrdensCarregamento,
    fetchNotasFiscaisDisponiveis,
    importarNotasFiscais,
    iniciarCarregamento
  } = useOrdemCarregamento();

  useEffect(() => {
    // Fetch data when component mounts
    fetchOrdensCarregamento();
  }, [fetchOrdensCarregamento]);

  const handleSearch = (term: string, filters?: Record<string, string[]>) => {
    setSearchTerm(term);
    if (filters) {
      // Update filters if needed
      const newFilters: Record<string, string> = {};
      Object.keys(filters).forEach(key => {
        newFilters[key] = filters[key][0] || 'all';
      });
      setActiveFilters(newFilters);
    }
  };

  const handleImportClick = async (ordemId: string) => {
    setSelectedOrdemId(ordemId);
    await fetchNotasFiscaisDisponiveis();
    setImportModalOpen(true);
  };

  const handleImportNotas = (notasIds: string[]) => {
    if (selectedOrdemId) {
      importarNotasFiscais(selectedOrdemId, notasIds);
      setImportModalOpen(false);
    }
  };

  // Filter configuration for the search component
  const filters: FilterConfig[] = [
    {
      id: "status",
      label: "Status",
      options: [
        { id: "all", label: "Todos" },
        { id: "pending", label: "Pendente" },
        { id: "processing", label: "Em Carregamento" },
        { id: "completed", label: "Concluído" }
      ]
    },
    {
      id: "periodo",
      label: "Período",
      options: [
        { id: "all", label: "Todos" },
        { id: "today", label: "Hoje" },
        { id: "tomorrow", label: "Amanhã" },
        { id: "thisWeek", label: "Esta semana" }
      ]
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Ordens de Carregamento</CardTitle>
      </CardHeader>
      <CardContent>
        <SearchFilter 
          placeholder="Buscar por ID, cliente ou destino..." 
          filters={filters}
          onSearch={handleSearch}
        />
        
        <DataTable
          columns={[
            { header: 'ID', accessor: 'id' },
            { header: 'Cliente', accessor: 'cliente' },
            { header: 'Tipo', accessor: 'tipoCarregamento', 
              cell: (row) => {
                const tipoMap: Record<string, string> = {
                  'entrega': 'Entrega',
                  'transferencia': 'Transferência',
                  'devolucao': 'Devolução'
                };
                return tipoMap[row.tipoCarregamento] || row.tipoCarregamento;
              }
            },
            { header: 'Data', accessor: 'dataCarregamento' },
            { header: 'Motorista', accessor: 'motorista' },
            { 
              header: 'Status', 
              accessor: 'status',
              cell: (row) => {
                const statusMap: any = {
                  'pending': { type: 'warning', text: 'Pendente' },
                  'processing': { type: 'info', text: 'Em Carregamento' },
                  'completed': { type: 'success', text: 'Concluído' },
                };
                const status = statusMap[row.status];
                return <StatusBadge status={status.type} text={status.text} />;
              }
            },
            {
              header: 'Ações',
              accessor: 'actions', 
              cell: (row) => (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      console.log("Visualizando detalhes da OC", row.id);
                    }}
                  >
                    <FileText size={16} className="mr-1" />
                    Detalhes
                  </Button>
                  {row.status !== 'completed' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-cross-blue text-white hover:bg-cross-blue/90"
                      onClick={() => iniciarCarregamento(row.id)}
                    >
                      <Truck size={16} className="mr-1" />
                      Iniciar
                    </Button>
                  )}
                  {row.status === 'pending' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-green-600 text-green-600 hover:bg-green-50"
                      onClick={() => handleImportClick(row.id)}
                    >
                      <FileText size={16} className="mr-1" />
                      Importar NFs
                    </Button>
                  )}
                </div>
              )
            }
          ]}
          data={ordensCarregamento}
        />
      </CardContent>

      <ImportarNotasDialog 
        open={importModalOpen}
        onOpenChange={setImportModalOpen}
        onImport={handleImportNotas}
        notasFiscaisDisponiveis={notasFiscaisDisponiveis}
        isLoading={isLoading}
      />
    </Card>
  );
};

export default ConsultarOCTab;
