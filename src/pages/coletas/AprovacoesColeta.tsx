
import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import SearchFilter from '../../components/common/SearchFilter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle } from 'lucide-react';

// Mock data
const solicitacoesPendentes = [
  { 
    id: 'COL-2023-001', 
    cliente: 'Indústria ABC Ltda', 
    data: '10/05/2023', 
    origem: 'São Paulo, SP', 
    destino: 'Campinas, SP', 
    status: 'pending',
    notas: ['12345', '12346'],
    volumes: 12,
    peso: '350kg', 
    solicitante: 'João Silva',
    prioridade: 'Alta'
  },
  { 
    id: 'COL-2023-008', 
    cliente: 'Farmacêutica Beta', 
    data: '12/05/2023', 
    origem: 'Campinas, SP', 
    destino: 'São Paulo, SP', 
    status: 'pending',
    notas: ['87654'],
    volumes: 8,
    peso: '120kg', 
    solicitante: 'Carlos Mendes',
    prioridade: 'Média'
  },
  { 
    id: 'COL-2023-012', 
    cliente: 'Eletrônicos Tech', 
    data: '13/05/2023', 
    origem: 'São José dos Campos, SP', 
    destino: 'São Paulo, SP', 
    status: 'pending',
    notas: ['54345', '54346'],
    volumes: 15,
    peso: '280kg', 
    solicitante: 'Ana Costa',
    prioridade: 'Baixa'
  },
];

const historicoAprovacoes = [
  { 
    id: 'COL-2023-002', 
    cliente: 'Distribuidora XYZ', 
    data: '10/05/2023', 
    origem: 'Rio de Janeiro, RJ', 
    destino: 'Niterói, RJ', 
    status: 'approved',
    notas: ['98765'],
    volumes: 5,
    peso: '120kg',
    solicitante: 'Pedro Santos',
    aprovador: 'Maria Oliveira',
    dataAprovacao: '11/05/2023'
  },
  { 
    id: 'COL-2023-003', 
    cliente: 'Transportes Rápidos', 
    data: '09/05/2023', 
    origem: 'Belo Horizonte, MG', 
    destino: 'São Paulo, SP', 
    status: 'rejected',
    notas: ['54321', '54322', '54323'],
    volumes: 18,
    peso: '490kg',
    solicitante: 'Roberto Alves',
    aprovador: 'Maria Oliveira',
    dataAprovacao: '10/05/2023',
    motivoRecusa: 'Documentação incompleta'
  },
  { 
    id: 'COL-2023-004', 
    cliente: 'Logística Expressa', 
    data: '09/05/2023', 
    origem: 'Curitiba, PR', 
    destino: 'Florianópolis, SC', 
    status: 'approved',
    notas: ['23456'],
    volumes: 3,
    peso: '80kg',
    solicitante: 'Juliana Lima',
    aprovador: 'Carlos Ferreira',
    dataAprovacao: '09/05/2023'
  },
];

const AprovacoesColeta = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('pendentes');
  
  const filters = [
    {
      name: 'Prioridade',
      options: [
        { label: 'Todas', value: 'all' },
        { label: 'Alta', value: 'high' },
        { label: 'Média', value: 'medium' },
        { label: 'Baixa', value: 'low' },
      ]
    },
    {
      name: 'Data',
      options: [
        { label: 'Hoje', value: 'today' },
        { label: 'Últimos 7 dias', value: '7days' },
        { label: 'Últimos 30 dias', value: '30days' },
        { label: 'Personalizado', value: 'custom' },
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
  
  const openDetailDialog = (row: any) => {
    setSelectedRequest(row);
    setIsDialogOpen(true);
  };
  
  const handleApprove = () => {
    console.log('Aprovado:', selectedRequest);
    setIsDialogOpen(false);
    // Implementar lógica de aprovação
  };
  
  const handleReject = () => {
    console.log('Recusado:', selectedRequest);
    setIsDialogOpen(false);
    // Implementar lógica de recusa
  };

  return (
    <MainLayout title="Aprovações de Coleta">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-heading">Gestão de Aprovações</h2>
          <p className="text-gray-500">Aprove ou recuse solicitações de coleta pendentes</p>
        </div>
      </div>
      
      <Tabs defaultValue="pendentes" className="w-full mb-6" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="pendentes">Pendentes de Aprovação</TabsTrigger>
          <TabsTrigger value="historico">Histórico de Aprovações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pendentes">
          <SearchFilter 
            placeholder="Buscar por ID, cliente ou notas fiscais..."
            filters={filters}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Solicitações Pendentes</CardTitle>
              <CardDescription>
                {solicitacoesPendentes.length} solicitações aguardando aprovação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={[
                  { header: 'ID', accessor: 'id' },
                  { header: 'Cliente', accessor: 'cliente' },
                  { 
                    header: 'Notas Fiscais', 
                    accessor: 'notas', 
                    cell: (row) => row.notas.join(', ') 
                  },
                  { header: 'Volumes', accessor: 'volumes', className: 'text-center' },
                  { header: 'Peso', accessor: 'peso' },
                  { header: 'Data', accessor: 'data' },
                  { header: 'Solicitante', accessor: 'solicitante' },
                  { 
                    header: 'Prioridade', 
                    accessor: 'prioridade',
                    cell: (row) => {
                      const priorityMap: any = {
                        'Alta': { type: 'error', text: 'Alta' },
                        'Média': { type: 'warning', text: 'Média' },
                        'Baixa': { type: 'info', text: 'Baixa' },
                      };
                      const priority = priorityMap[row.prioridade];
                      return <StatusBadge status={priority.type} text={priority.text} />;
                    }
                  },
                  { 
                    header: 'Ações', 
                    accessor: '',
                    cell: (row) => (
                      <div className="flex space-x-2 justify-end">
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetailDialog(row);
                          }}
                          size="sm"
                        >
                          Revisar
                        </Button>
                      </div>
                    )
                  }
                ]}
                data={solicitacoesPendentes}
                onRowClick={openDetailDialog}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="historico">
          <SearchFilter 
            placeholder="Buscar por ID, cliente ou notas fiscais..."
            filters={[
              {
                name: 'Status',
                options: [
                  { label: 'Todos', value: 'all' },
                  { label: 'Aprovados', value: 'approved' },
                  { label: 'Recusados', value: 'rejected' },
                ]
              },
              {
                name: 'Data',
                options: [
                  { label: 'Hoje', value: 'today' },
                  { label: 'Últimos 7 dias', value: '7days' },
                  { label: 'Últimos 30 dias', value: '30days' },
                  { label: 'Personalizado', value: 'custom' },
                ]
              }
            ]}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Aprovações</CardTitle>
              <CardDescription>
                Solicitações previamente avaliadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={[
                  { header: 'ID', accessor: 'id' },
                  { header: 'Cliente', accessor: 'cliente' },
                  { header: 'Solicitante', accessor: 'solicitante' },
                  { header: 'Aprovador', accessor: 'aprovador' },
                  { header: 'Data Solicitação', accessor: 'data' },
                  { header: 'Data Aprovação', accessor: 'dataAprovacao' },
                  { 
                    header: 'Status', 
                    accessor: 'status',
                    cell: (row) => {
                      const statusMap: any = {
                        'approved': { type: 'success', text: 'Aprovado' },
                        'rejected': { type: 'error', text: 'Recusado' },
                      };
                      const status = statusMap[row.status];
                      return <StatusBadge status={status.type} text={status.text} />;
                    }
                  },
                  { 
                    header: 'Detalhes', 
                    accessor: '',
                    cell: (row) => (
                      <div className="flex justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetailDialog(row);
                          }}
                        >
                          Ver
                        </Button>
                      </div>
                    )
                  }
                ]}
                data={historicoAprovacoes}
                pagination={{
                  totalPages: Math.ceil(historicoAprovacoes.length / 10),
                  currentPage: currentPage,
                  onPageChange: setCurrentPage
                }}
                onRowClick={openDetailDialog}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {selectedRequest && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Detalhes da Solicitação {selectedRequest.id}</DialogTitle>
              <DialogDescription>
                {selectedRequest.status === 'pending' 
                  ? 'Revise os detalhes da solicitação para aprovar ou recusar.'
                  : 'Detalhes da solicitação processada.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Cliente</p>
                  <p className="font-medium">{selectedRequest.cliente}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Solicitante</p>
                  <p>{selectedRequest.solicitante}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Data Solicitação</p>
                  <p>{selectedRequest.data}</p>
                </div>
                {selectedRequest.dataAprovacao && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Data Aprovação</p>
                    <p>{selectedRequest.dataAprovacao}</p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Origem</p>
                  <p>{selectedRequest.origem}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Destino</p>
                  <p>{selectedRequest.destino}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Volumes</p>
                  <p>{selectedRequest.volumes}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Peso</p>
                  <p>{selectedRequest.peso}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Notas Fiscais</p>
                <p>{selectedRequest.notas.join(', ')}</p>
              </div>
              
              {selectedRequest.motivoRecusa && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Motivo da Recusa</p>
                  <p className="text-red-600">{selectedRequest.motivoRecusa}</p>
                </div>
              )}
              
              {selectedRequest.status === 'pending' && (
                <div className="pt-4">
                  <p className="text-sm font-medium text-gray-500 mb-2">Observações (opcional)</p>
                  <Textarea placeholder="Adicione observações ou motivo para recusa" />
                </div>
              )}
            </div>
            
            <DialogFooter>
              {selectedRequest.status === 'pending' ? (
                <>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Fechar</Button>
                  <Button variant="destructive" onClick={handleReject}>
                    <XCircle className="mr-2 h-4 w-4" /> Recusar
                  </Button>
                  <Button className="bg-cross-success hover:bg-green-700" onClick={handleApprove}>
                    <CheckCircle className="mr-2 h-4 w-4" /> Aprovar
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsDialogOpen(false)}>Fechar</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  );
};

export default AprovacoesColeta;
