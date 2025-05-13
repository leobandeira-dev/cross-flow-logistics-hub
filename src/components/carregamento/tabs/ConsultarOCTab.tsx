
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import SearchFilter from '@/components/common/SearchFilter';
import { FileText, Truck } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { FilterConfig } from '@/components/common/SearchFilter';

// Mock data for the orders
const ordensCarregamento = [
  { 
    id: 'OC-2023-001', 
    destino: 'São Paulo, SP', 
    cliente: 'Distribuidor ABC', 
    volumes: 25, 
    dataCarregamento: '15/05/2023',
    status: 'pending'
  },
  { 
    id: 'OC-2023-002', 
    destino: 'Rio de Janeiro, RJ', 
    cliente: 'Distribuidor XYZ', 
    volumes: 18, 
    dataCarregamento: '15/05/2023',
    status: 'processing'
  },
  { 
    id: 'OC-2023-003', 
    destino: 'Belo Horizonte, MG', 
    cliente: 'Distribuidor DEF', 
    volumes: 32, 
    dataCarregamento: '16/05/2023',
    status: 'completed'
  },
];

const ConsultarOCTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({
    status: 'all',
    periodo: 'all'
  });

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
    <Card>
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
            { header: 'Destino', accessor: 'destino' },
            { header: 'Data', accessor: 'dataCarregamento' },
            { header: 'Volumes', accessor: 'volumes' },
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
                      toast({
                        title: "Detalhes da OC",
                        description: `Visualizando detalhes da OC ${row.id}`,
                      });
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
                      onClick={() => {
                        toast({
                          title: "Iniciar Carregamento",
                          description: `Iniciando carregamento para OC ${row.id}`,
                        });
                      }}
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
                      onClick={() => {
                        toast({
                          title: "Importar para Faturamento",
                          description: `Importando notas fiscais da OC ${row.id} para o faturamento`,
                        });
                      }}
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
    </Card>
  );
};

export default ConsultarOCTab;
