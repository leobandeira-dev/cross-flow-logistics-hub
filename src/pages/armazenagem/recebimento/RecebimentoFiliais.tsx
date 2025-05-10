import React from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Archive, FileText } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import SearchFilter from '@/components/common/SearchFilter';

// Mock data
const transferenciasFiliais = [
  { id: 'TF-2023-001', filialOrigem: 'São Paulo', filialDestino: 'Rio de Janeiro', notaFiscal: '12345', data: '10/05/2023', volumes: 10, status: 'transit' },
  { id: 'TF-2023-002', filialOrigem: 'Rio de Janeiro', filialDestino: 'São Paulo', notaFiscal: '12346', data: '09/05/2023', volumes: 15, status: 'pending' },
  { id: 'TF-2023-003', filialOrigem: 'Belo Horizonte', filialDestino: 'São Paulo', notaFiscal: '12347', data: '08/05/2023', volumes: 8, status: 'completed' },
];

const RecebimentoFiliais: React.FC = () => {
  return (
    <MainLayout title="Recebimento Entre Filiais">
      <div className="mb-6">
        <h2 className="text-2xl font-heading mb-2">Recebimento Entre Filiais</h2>
        <p className="text-gray-600">Gerencie transferências e recebimentos entre filiais da empresa</p>
      </div>
      
      <Tabs defaultValue="receber" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="receber">A Receber</TabsTrigger>
          <TabsTrigger value="enviar">A Enviar</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>
        
        <TabsContent value="receber">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Archive className="mr-2 text-cross-blue" size={20} />
                Transferências para Recebimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SearchFilter 
                placeholder="Buscar por ID ou nota fiscal..." 
                filters={[
                  {
                    name: "Status",
                    options: [
                      { label: "Em Trânsito", value: "transit" },
                      { label: "Aguardando", value: "pending" }
                    ]
                  },
                  {
                    name: "Filial de Origem",
                    options: [
                      { label: "São Paulo", value: "São Paulo" },
                      { label: "Rio de Janeiro", value: "Rio de Janeiro" },
                      { label: "Belo Horizonte", value: "Belo Horizonte" }
                    ]
                  }
                ]}
              />
              
              <DataTable
                columns={[
                  { header: 'ID', accessor: 'id' },
                  { header: 'Filial de Origem', accessor: 'filialOrigem' },
                  { header: 'Filial de Destino', accessor: 'filialDestino' },
                  { header: 'Nota Fiscal', accessor: 'notaFiscal' },
                  { header: 'Data', accessor: 'data' },
                  { header: 'Volumes', accessor: 'volumes' },
                  { 
                    header: 'Status', 
                    accessor: 'status',
                    cell: (row) => {
                      const statusMap: any = {
                        'transit': { type: 'info', text: 'Em Trânsito' },
                        'pending': { type: 'warning', text: 'Aguardando' },
                        'completed': { type: 'success', text: 'Concluído' },
                      };
                      const status = statusMap[row.status];
                      return <StatusBadge status={status.type} text={status.text} />;
                    }
                  },
                  {
                    header: 'Ações',
                    accessor: 'actions', // Add this line
                    cell: (row) => (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Detalhes</Button>
                        {row.status !== 'completed' && (
                          <Button variant="outline" size="sm" className="bg-cross-blue text-white hover:bg-cross-blue/90">
                            Receber
                          </Button>
                        )}
                      </div>
                    )
                  }
                ]}
                data={transferenciasFiliais.filter(t => t.status !== 'completed')}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="enviar">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileText className="mr-2 text-cross-blue" size={20} />
                Iniciar Nova Transferência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Use este formulário para iniciar uma transferência de mercadoria para outra filial.
              </p>
              <Button className="bg-cross-blue hover:bg-cross-blue/90">
                Nova Transferência
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="historico">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Histórico de Transferências</CardTitle>
            </CardHeader>
            <CardContent>
              <SearchFilter 
                placeholder="Buscar por ID ou nota fiscal..." 
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
                  { header: 'Filial de Origem', accessor: 'filialOrigem' },
                  { header: 'Filial de Destino', accessor: 'filialDestino' },
                  { header: 'Nota Fiscal', accessor: 'notaFiscal' },
                  { header: 'Data', accessor: 'data' },
                  { header: 'Volumes', accessor: 'volumes' },
                  { 
                    header: 'Status', 
                    accessor: 'status',
                    cell: (row) => {
                      const statusMap: any = {
                        'transit': { type: 'info', text: 'Em Trânsito' },
                        'pending': { type: 'warning', text: 'Aguardando' },
                        'completed': { type: 'success', text: 'Concluído' },
                      };
                      const status = statusMap[row.status];
                      return <StatusBadge status={status.type} text={status.text} />;
                    }
                  },
                  {
                    header: 'Ações',
                    accessor: 'actions', // Add this line
                    cell: () => (
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    )
                  }
                ]}
                data={transferenciasFiliais}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default RecebimentoFiliais;
