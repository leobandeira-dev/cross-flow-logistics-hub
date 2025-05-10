
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DataTable from '../../../components/common/DataTable';
import { Button } from '@/components/ui/button';
import { FileText, UserX } from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import SearchFilter from '../../../components/common/SearchFilter';
import { toast } from '@/hooks/use-toast';

interface CargasAlocadasProps {
  cargas: any[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const CargasAlocadas: React.FC<CargasAlocadasProps> = ({ 
  cargas, 
  currentPage, 
  setCurrentPage 
}) => {
  const filters = [
    {
      name: 'Motorista',
      options: [
        { label: 'Todos', value: 'all' },
        { label: 'José da Silva', value: 'jose' },
        { label: 'Carlos Santos', value: 'carlos' },
        { label: 'Pedro Oliveira', value: 'pedro' },
        { label: 'Antônio Ferreira', value: 'antonio' },
        { label: 'Manuel Costa', value: 'manuel' },
      ]
    },
    {
      name: 'Status',
      options: [
        { label: 'Todos', value: 'all' },
        { label: 'Em trânsito', value: 'transit' },
        { label: 'Em carregamento', value: 'loading' },
        { label: 'Entregues', value: 'delivered' },
        { label: 'Com problemas', value: 'problem' },
      ]
    }
  ];

  const handleSearch = (value: string) => {
    console.log('Search:', value);
    // Implementar lógica de busca
  };
  
  const handleFilterChange = (filter: string, value: string) => {
    console.log(`Filter ${filter} changed to ${value}`);
    // Implementar lógica de filtro
  };

  const handleDesalocarMotorista = (cargaId: string, motorista: string) => {
    // Implementar lógica para desalocar motorista
    toast({
      title: "Motorista desalocado com sucesso",
      description: `O motorista ${motorista} foi removido da carga ${cargaId}.`,
    });
    console.log('Motorista desalocado:', motorista, 'da carga:', cargaId);
  };

  return (
    <>
      <SearchFilter 
        placeholder="Buscar por ID, motorista ou destino..."
        filters={filters}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Cargas Alocadas</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { header: 'ID', accessor: 'id' },
              { header: 'Destino', accessor: 'destino' },
              { header: 'Motorista', accessor: 'motorista' },
              { header: 'Veículo', accessor: 'veiculo' },
              { header: 'Data Prevista', accessor: 'dataPrevisao', cell: (row) => row.dataPrevisao || row.dataEntrega },
              { header: 'Volumes', accessor: 'volumes' },
              { header: 'Peso', accessor: 'peso' },
              { 
                header: 'Status', 
                accessor: 'status',
                cell: (row) => {
                  const statusMap: any = {
                    'transit': { type: 'info', text: 'Em Trânsito' },
                    'loading': { type: 'warning', text: 'Em Carregamento' },
                    'scheduled': { type: 'default', text: 'Agendada' },
                    'delivered': { type: 'success', text: 'Entregue' },
                    'problem': { type: 'error', text: 'Problema' }
                  };
                  const status = statusMap[row.status];
                  return <StatusBadge status={status.type} text={status.text} />;
                }
              },
              { 
                header: 'Ações', 
                accessor: 'actions',
                cell: (row) => {
                  const finalizado = row.status === 'delivered' || row.status === 'problem';
                  
                  return (
                    <div className="flex space-x-2 justify-end">
                      <Button 
                        variant="outline"
                        size="sm"
                      >
                        <FileText className="h-4 w-4 mr-1" /> Detalhes
                      </Button>
                      
                      {!finalizado && (
                        <Button 
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleDesalocarMotorista(row.id, row.motorista)}
                        >
                          <UserX className="h-4 w-4 mr-1" /> Desalocar
                        </Button>
                      )}
                    </div>
                  );
                }
              }
            ]}
            data={cargas}
            pagination={{
              totalPages: Math.ceil(cargas.length / 10),
              currentPage: currentPage,
              onPageChange: setCurrentPage
            }}
            onRowClick={(row) => console.log('Row clicked:', row)}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default CargasAlocadas;
