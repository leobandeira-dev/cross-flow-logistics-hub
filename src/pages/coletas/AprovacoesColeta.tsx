import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import SearchFilter from '../../components/common/SearchFilter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from '@/components/ui/form';
import DocumentPDFGenerator from '@/components/common/DocumentPDFGenerator';

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

// Schema para validação do formulário de aprovação/rejeição
const formSchema = z.object({
  observacoes: z.string().optional(),
  motivoRecusa: z.string().min(10, {
    message: "O motivo da recusa deve ter pelo menos 10 caracteres",
  }).optional().refine(value => {
    // Se estamos no modo de rejeição, o motivo é obrigatório
    if (global.isRejecting && (!value || value.length < 10)) {
      return false;
    }
    return true;
  }, {
    message: "O motivo da recusa é obrigatório para rejeições",
  }),
});

const AprovacoesColeta = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('pendentes');
  const [isRejecting, setIsRejecting] = useState(false);
  
  // Inicializando o formulário com react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      observacoes: '',
      motivoRecusa: '',
    },
  });

  // Definição global para que o refine do schema funcione
  global.isRejecting = isRejecting;
  
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
    setIsRejecting(false);
    form.reset({
      observacoes: '',
      motivoRecusa: '',
    });
  };
  
  const handleApprove = (data: z.infer<typeof formSchema>) => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString()} às ${currentDate.toLocaleTimeString()}`;
    const approverName = "Maria Oliveira"; // Normalmente viria da sessão do usuário
    
    // Aqui seria feita a integração com a API para registrar a aprovação
    console.log('Aprovado:', {
      ...selectedRequest,
      observacoes: data.observacoes,
      dataAprovacao: formattedDate,
      aprovador: approverName,
      status: 'approved'
    });
    
    toast({
      title: "Coleta aprovada com sucesso!",
      description: `A coleta ${selectedRequest.id} foi aprovada em ${formattedDate} por ${approverName}.`,
    });
    
    setIsDialogOpen(false);
    form.reset();
  };
  
  const handleReject = (data: z.infer<typeof formSchema>) => {
    if (!data.motivoRecusa || data.motivoRecusa.length < 10) {
      form.setError('motivoRecusa', {
        type: 'manual',
        message: 'O motivo da recusa é obrigatório e deve ter pelo menos 10 caracteres',
      });
      return;
    }
    
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString()} às ${currentDate.toLocaleTimeString()}`;
    const approverName = "Maria Oliveira"; // Normalmente viria da sessão do usuário
    
    // Aqui seria feita a integração com a API para registrar a recusa
    console.log('Recusado:', {
      ...selectedRequest,
      motivoRecusa: data.motivoRecusa,
      dataAprovacao: formattedDate,
      aprovador: approverName,
      status: 'rejected'
    });
    
    toast({
      title: "Coleta recusada",
      description: `A coleta ${selectedRequest.id} foi recusada em ${formattedDate} por ${approverName}.`,
      variant: "destructive",
    });
    
    setIsDialogOpen(false);
    form.reset();
  };

  // Renderiza o conteúdo do documento para impressão
  const renderAprovacaoDocument = (documentId: string) => {
    const documento = [...solicitacoesPendentes, ...historicoAprovacoes].find(doc => doc.id === documentId);
    
    if (!documento) return <div>Documento não encontrado</div>;
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Detalhes da Solicitação</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Cliente</p>
            <p>{documento.cliente}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Solicitante</p>
            <p>{documento.solicitante}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Data Solicitação</p>
            <p>{documento.data}</p>
          </div>
          {documento.dataAprovacao && (
            <div>
              <p className="text-sm font-medium text-gray-500">Data Aprovação</p>
              <p>{documento.dataAprovacao}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <p>{documento.status === 'approved' ? 'Aprovado' : documento.status === 'rejected' ? 'Recusado' : 'Pendente'}</p>
          </div>
          {documento.aprovador && (
            <div>
              <p className="text-sm font-medium text-gray-500">Aprovador</p>
              <p>{documento.aprovador}</p>
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Notas Fiscais</p>
          <p>{documento.notas.join(', ')}</p>
        </div>
        {documento.motivoRecusa && (
          <div>
            <p className="text-sm font-medium text-gray-500">Motivo da Recusa</p>
            <p className="text-red-600">{documento.motivoRecusa}</p>
          </div>
        )}
      </div>
    );
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
                        <DocumentPDFGenerator
                          documentId={row.id}
                          documentType="Solicitação de Coleta"
                          renderDocument={renderAprovacaoDocument}
                          buttonText="Imprimir"
                        />
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
                    header: 'Ações', 
                    accessor: '',
                    cell: (row) => (
                      <div className="flex space-x-2 justify-end">
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
                        <DocumentPDFGenerator
                          documentId={row.id}
                          documentType="Solicitação de Coleta"
                          renderDocument={renderAprovacaoDocument}
                          buttonText="Imprimir"
                        />
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
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(isRejecting ? handleReject : handleApprove)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="observacoes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações (opcional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Adicione observações sobre esta aprovação" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {isRejecting && (
                      <FormField
                        control={form.control}
                        name="motivoRecusa"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-destructive font-bold">Motivo da Recusa (obrigatório)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Informe o motivo detalhado da recusa" 
                                {...field}
                                className="border-destructive focus:border-destructive"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <DialogFooter className="mt-4">
                      <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>Fechar</Button>
                      {!isRejecting && (
                        <Button 
                          variant="destructive" 
                          type="button" 
                          onClick={() => {
                            setIsRejecting(true);
                            global.isRejecting = true;
                          }}
                        >
                          <XCircle className="mr-2 h-4 w-4" /> Recusar
                        </Button>
                      )}
                      <Button 
                        type="submit" 
                        className={isRejecting ? "bg-destructive hover:bg-destructive/90" : "bg-cross-success hover:bg-green-700"}
                      >
                        {isRejecting ? (
                          <>
                            <XCircle className="mr-2 h-4 w-4" /> Confirmar Recusa
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" /> Aprovar
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              )}
            </div>
            
            {selectedRequest.status !== 'pending' && (
              <DialogFooter>
                <Button onClick={() => setIsDialogOpen(false)}>Fechar</Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  );
};

export default AprovacoesColeta;

// Adicionar esta definição ao escopo global para o TypeScript
declare global {
  var isRejecting: boolean;
}
