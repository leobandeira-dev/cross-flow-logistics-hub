import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import SearchFilter from '../../components/common/SearchFilter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DataTable from '../../components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Map, AlertCircle, CheckCircle } from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';

// Mock data for cargas (loads)
const cargas = [
  { 
    id: 'OC-2023001', 
    destino: 'São Paulo, SP', 
    motorista: 'José da Silva',
    veiculo: 'ABC-1234',
    dataPrevisao: '15/05/2023',
    volumes: 24,
    peso: '1.200 kg',
    status: 'transit'
  },
  { 
    id: 'OC-2023002', 
    destino: 'Rio de Janeiro, RJ', 
    motorista: 'Carlos Santos',
    veiculo: 'DEF-5678',
    dataPrevisao: '17/05/2023',
    volumes: 18,
    peso: '980 kg',
    status: 'loading'
  },
  { 
    id: 'OC-2023003', 
    destino: 'Belo Horizonte, MG', 
    motorista: 'Pedro Oliveira',
    veiculo: 'GHI-9012',
    dataPrevisao: '20/05/2023',
    volumes: 32,
    peso: '1.580 kg',
    status: 'delivered'
  },
  { 
    id: 'OC-2023004', 
    destino: 'Salvador, BA', 
    motorista: 'Antônio Ferreira',
    veiculo: 'JKL-3456',
    dataPrevisao: '22/05/2023',
    volumes: 15,
    peso: '760 kg',
    status: 'scheduled'
  },
  { 
    id: 'OC-2023005', 
    destino: 'Curitiba, PR', 
    motorista: 'Manuel Costa',
    veiculo: 'MNO-7890',
    dataPrevisao: '18/05/2023',
    volumes: 27,
    peso: '1.350 kg',
    status: 'problem'
  }
];

// Mock data for historical loads
const historicoCargas = [
  { 
    id: 'OC-2023001', 
    destino: 'São Paulo, SP', 
    motorista: 'José da Silva',
    veiculo: 'ABC-1234',
    dataEntrega: '12/05/2023',
    volumes: 24,
    peso: '1.200 kg',
    status: 'delivered'
  },
  { 
    id: 'OC-2022098', 
    destino: 'Campinas, SP', 
    motorista: 'José da Silva',
    veiculo: 'ABC-1234',
    dataEntrega: '28/04/2023',
    volumes: 16,
    peso: '850 kg',
    status: 'delivered'
  },
  { 
    id: 'OC-2022087', 
    destino: 'Brasília, DF', 
    motorista: 'José da Silva',
    veiculo: 'ABC-1234',
    dataEntrega: '15/04/2023',
    volumes: 22,
    peso: '1.100 kg',
    status: 'problem'
  },
];

const CargasMotoristas = () => {
  const [activeTab, setActiveTab] = useState('ativas');
  const [currentPage, setCurrentPage] = useState(1);
  
  const filters = [
    {
      name: 'Status',
      options: [
        { label: 'Todos', value: 'all' },
        { label: 'Em trânsito', value: 'transit' },
        { label: 'Em carregamento', value: 'loading' },
        { label: 'Agendadas', value: 'scheduled' },
        { label: 'Entregues', value: 'delivered' },
        { label: 'Com problemas', value: 'problem' },
      ]
    },
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

  return (
    <MainLayout title="Cargas dos Motoristas">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-heading">Gestão de Cargas</h2>
          <p className="text-gray-500">Acompanhe as cargas atribuídas aos motoristas</p>
        </div>
      </div>
      
      <Tabs defaultValue="ativas" className="w-full mb-6" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="ativas" className="flex items-center">
            <Map className="mr-2 h-4 w-4" /> Cargas Ativas
          </TabsTrigger>
          <TabsTrigger value="historico" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" /> Histórico de Cargas
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ativas">
          <SearchFilter 
            placeholder="Buscar por ID, motorista ou destino..."
            filters={filters}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Cargas Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={[
                  { header: 'ID', accessor: 'id' },
                  { header: 'Destino', accessor: 'destino' },
                  { header: 'Motorista', accessor: 'motorista' },
                  { header: 'Veículo', accessor: 'veiculo' },
                  { header: 'Data Prevista', accessor: 'dataPrevisao' },
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
                    accessor: 'actions',  // Add this line
                    cell: (row) => (
                      <div className="flex space-x-2 justify-end">
                        <Button 
                          variant="outline"
                          size="sm"
                        >
                          <FileText className="h-4 w-4 mr-1" /> Detalhes
                        </Button>
                        {row.status === 'transit' && (
                          <Button 
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" /> Confirmar Entrega
                          </Button>
                        )}
                        {row.status !== 'delivered' && row.status !== 'problem' && (
                          <Button 
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <AlertCircle className="h-4 w-4 mr-1" /> Reportar Problema
                          </Button>
                        )}
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
        </TabsContent>
        
        <TabsContent value="historico">
          <SearchFilter 
            placeholder="Buscar por ID, motorista ou destino..."
            filters={[
              filters[1],
              {
                name: 'Status',
                options: [
                  { label: 'Todos', value: 'all' },
                  { label: 'Entregues', value: 'delivered' },
                  { label: 'Com Problemas', value: 'problem' },
                ]
              }
            ]}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Cargas</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={[
                  { header: 'ID', accessor: 'id' },
                  { header: 'Destino', accessor: 'destino' },
                  { header: 'Motorista', accessor: 'motorista' },
                  { header: 'Veículo', accessor: 'veiculo' },
                  { header: 'Data Entrega', accessor: 'dataEntrega' },
                  { header: 'Volumes', accessor: 'volumes' },
                  { header: 'Peso', accessor: 'peso' },
                  { 
                    header: 'Status', 
                    accessor: 'status',
                    cell: (row) => {
                      const statusMap: any = {
                        'delivered': { type: 'success', text: 'Entregue' },
                        'problem': { type: 'error', text: 'Problema' }
                      };
                      const status = statusMap[row.status];
                      return <StatusBadge status={status.type} text={status.text} />;
                    }
                  },
                  { 
                    header: 'Ações', 
                    accessor: '',
                    cell: () => (
                      <div className="flex space-x-2 justify-end">
                        <Button 
                          variant="outline"
                          size="sm"
                        >
                          <FileText className="h-4 w-4 mr-1" /> Detalhes
                        </Button>
                      </div>
                    )
                  }
                ]}
                data={historicoCargas}
                pagination={{
                  totalPages: Math.ceil(historicoCargas.length / 10),
                  currentPage: currentPage,
                  onPageChange: setCurrentPage
                }}
                onRowClick={(row) => console.log('Row clicked:', row)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default CargasMotoristas;
