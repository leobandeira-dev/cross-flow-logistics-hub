
import React from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Package, FileText } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import SearchFilter from '@/components/common/SearchFilter';

// Mock data
const recebimentosColeta = [
  { id: 'COL-2023-001', cliente: 'Cliente ABC', numColeta: 'C12345', data: '10/05/2023', status: 'pending' },
  { id: 'COL-2023-002', cliente: 'Cliente XYZ', numColeta: 'C12346', data: '11/05/2023', status: 'processing' },
  { id: 'COL-2023-003', cliente: 'Cliente DEF', numColeta: 'C12347', data: '12/05/2023', status: 'completed' },
];

const RecebimentoColeta: React.FC = () => {
  return (
    <MainLayout title="Recebimento de Coleta">
      <div className="mb-6">
        <h2 className="text-2xl font-heading mb-2">Recebimento de Coleta</h2>
        <p className="text-gray-600">Processe recebimentos de mercadorias provenientes de coletas</p>
      </div>
      
      <Tabs defaultValue="pendentes" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="pendentes">Coletas Pendentes</TabsTrigger>
          <TabsTrigger value="processadas">Coletas Processadas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pendentes">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Package className="mr-2 text-cross-blue" size={20} />
                Coletas Aguardando Recebimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SearchFilter 
                placeholder="Buscar por cliente ou número de coleta..." 
                filters={[
                  {
                    name: "Status",
                    options: [
                      { label: "Pendente", value: "pending" },
                      { label: "Em Processamento", value: "processing" }
                    ]
                  }
                ]}
              />
              
              <DataTable
                columns={[
                  { header: 'ID', accessor: 'id' },
                  { header: 'Cliente', accessor: 'cliente' },
                  { header: 'Nº Coleta', accessor: 'numColeta' },
                  { header: 'Data', accessor: 'data' },
                  { 
                    header: 'Status', 
                    accessor: 'status',
                    cell: (row) => {
                      const statusMap: any = {
                        'pending': { type: 'warning', text: 'Pendente' },
                        'processing': { type: 'info', text: 'Em Processamento' },
                        'completed': { type: 'success', text: 'Concluído' },
                      };
                      const status = statusMap[row.status];
                      return <StatusBadge status={status.type} text={status.text} />;
                    }
                  },
                  {
                    header: 'Ações',
                    cell: () => (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Detalhes</Button>
                        <Button variant="outline" size="sm" className="bg-cross-blue text-white hover:bg-cross-blue/90">
                          Receber
                        </Button>
                      </div>
                    )
                  }
                ]}
                data={recebimentosColeta.filter(r => r.status !== 'completed')}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="processadas">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileText className="mr-2 text-cross-blue" size={20} />
                Coletas Recebidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SearchFilter 
                placeholder="Buscar por cliente ou número de coleta..." 
                filters={[
                  {
                    name: "Data",
                    options: [
                      { label: "Esta semana", value: "thisWeek" },
                      { label: "Este mês", value: "thisMonth" },
                      { label: "Último mês", value: "lastMonth" }
                    ]
                  }
                ]}
              />
              
              <DataTable
                columns={[
                  { header: 'ID', accessor: 'id' },
                  { header: 'Cliente', accessor: 'cliente' },
                  { header: 'Nº Coleta', accessor: 'numColeta' },
                  { header: 'Data', accessor: 'data' },
                  { 
                    header: 'Status', 
                    accessor: 'status',
                    cell: (row) => {
                      const statusMap: any = {
                        'pending': { type: 'warning', text: 'Pendente' },
                        'processing': { type: 'info', text: 'Em Processamento' },
                        'completed': { type: 'success', text: 'Concluído' },
                      };
                      const status = statusMap[row.status];
                      return <StatusBadge status={status.type} text={status.text} />;
                    }
                  },
                  {
                    header: 'Ações',
                    cell: () => (
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    )
                  }
                ]}
                data={recebimentosColeta.filter(r => r.status === 'completed')}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default RecebimentoColeta;
