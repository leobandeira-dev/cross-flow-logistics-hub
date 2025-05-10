
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DataTable from '../../../components/common/DataTable';
import { Button } from '@/components/ui/button';
import { FileText, UserPlus } from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';
import SearchFilter from '../../../components/common/SearchFilter';
import { toast } from '@/hooks/use-toast';
import AlocacaoModal from './AlocacaoModal';

interface CargasPendentesProps {
  cargas: any[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const CargasPendentes: React.FC<CargasPendentesProps> = ({ cargas, currentPage, setCurrentPage }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCarga, setSelectedCarga] = useState<any>(null);
  
  const filters = [
    {
      name: 'Status',
      options: [
        { label: 'Todos', value: 'all' },
        { label: 'Pendentes', value: 'pending' },
        { label: 'Agendadas', value: 'scheduled' },
      ]
    },
    {
      name: 'Destino',
      options: [
        { label: 'Todos', value: 'all' },
        { label: 'São Paulo', value: 'sp' },
        { label: 'Rio de Janeiro', value: 'rj' },
        { label: 'Belo Horizonte', value: 'bh' },
        { label: 'Curitiba', value: 'curitiba' },
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

  const handleAlocarMotorista = (carga: any) => {
    setSelectedCarga(carga);
    setIsModalOpen(true);
  };

  const handleAlocacaoConfirmada = (cargaId: string, motorista: string, veiculo: string) => {
    // Implementar lógica para alocar motorista e veículo
    toast({
      title: "Motorista alocado com sucesso",
      description: `A carga ${cargaId} foi alocada para ${motorista} com o veículo ${veiculo}.`,
    });
    setIsModalOpen(false);
    console.log('Carga alocada:', cargaId, 'Motorista:', motorista, 'Veículo:', veiculo);
  };

  return (
    <>
      <SearchFilter 
        placeholder="Buscar por ID ou destino..."
        filters={filters}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Cargas Pendentes de Alocação</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { header: 'ID', accessor: 'id' },
              { header: 'Destino', accessor: 'destino' },
              { header: 'Data Prevista', accessor: 'dataPrevisao' },
              { header: 'Volumes', accessor: 'volumes' },
              { header: 'Peso', accessor: 'peso' },
              { 
                header: 'Status', 
                accessor: 'status',
                cell: (row) => {
                  const statusMap: any = {
                    'pending': { type: 'default', text: 'Pendente de Alocação' },
                    'scheduled': { type: 'default', text: 'Agendada' },
                  };
                  const status = statusMap[row.status] || { type: 'default', text: 'Pendente' };
                  return <StatusBadge status={status.type} text={status.text} />;
                }
              },
              { 
                header: 'Ações', 
                accessor: 'actions',
                cell: (row) => (
                  <div className="flex space-x-2 justify-end">
                    <Button 
                      variant="outline"
                      size="sm"
                    >
                      <FileText className="h-4 w-4 mr-1" /> Detalhes
                    </Button>
                    
                    <Button 
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      onClick={() => handleAlocarMotorista(row)}
                    >
                      <UserPlus className="h-4 w-4 mr-1" /> Alocar Motorista
                    </Button>
                  </div>
                )
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
      
      {isModalOpen && selectedCarga && (
        <AlocacaoModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          carga={selectedCarga}
          onConfirm={handleAlocacaoConfirmada}
        />
      )}
    </>
  );
};

export default CargasPendentes;
