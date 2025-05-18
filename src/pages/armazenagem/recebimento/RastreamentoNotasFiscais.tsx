
import React, { useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Truck, Check, Box, Flag, FlagOff, Shield, Award, Search, List, Kanban } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import { toast } from '@/hooks/use-toast';
import SearchFilter from '@/components/common/SearchFilter';

// Mock data for demonstration
const notasFiscaisMock = [
  { 
    id: 'NF001', 
    numero: 'NF12345', 
    emitente: 'Empresa ABC', 
    destinatario: 'Indústria XYZ', 
    dataEmissao: '2023-10-15', 
    status: 'coletado', 
    prioridade: 'normal',
    valorTotal: 'R$ 1.250,00',
  },
  { 
    id: 'NF002', 
    numero: 'NF12346', 
    emitente: 'Empresa DEF', 
    destinatario: 'Comércio XYZ', 
    dataEmissao: '2023-10-16', 
    status: 'entregue', 
    prioridade: 'prioridade',
    valorTotal: 'R$ 2.150,00',
  },
  { 
    id: 'NF003', 
    numero: 'NF12347', 
    emitente: 'Empresa GHI', 
    destinatario: 'Varejo ABC', 
    dataEmissao: '2023-10-17', 
    status: 'no_armazem', 
    prioridade: 'normal',
    valorTotal: 'R$ 3.450,00',
  },
  { 
    id: 'NF004', 
    numero: 'NF12348', 
    emitente: 'Empresa JKL', 
    destinatario: 'Distribuição XYZ', 
    dataEmissao: '2023-10-18', 
    status: 'em_transferencia', 
    prioridade: 'expressa',
    valorTotal: 'R$ 4.750,00',
  },
  { 
    id: 'NF005', 
    numero: 'NF12349', 
    emitente: 'Empresa MNO', 
    destinatario: 'Atacado ABC', 
    dataEmissao: '2023-10-19', 
    status: 'em_rota_entrega', 
    prioridade: 'prioridade',
    valorTotal: 'R$ 5.950,00',
  },
  { 
    id: 'NF006', 
    numero: 'NF12350', 
    emitente: 'Empresa PQR', 
    destinatario: 'Loja XYZ', 
    dataEmissao: '2023-10-20', 
    status: 'extraviada', 
    prioridade: 'bloqueada',
    valorTotal: 'R$ 6.250,00',
  },
  { 
    id: 'NF007', 
    numero: 'NF12351', 
    emitente: 'Empresa STU', 
    destinatario: 'Mercado ABC', 
    dataEmissao: '2023-10-21', 
    status: 'avariada', 
    prioridade: 'normal',
    valorTotal: 'R$ 7.550,00',
  },
  { 
    id: 'NF008', 
    numero: 'NF12352', 
    emitente: 'Empresa VWX', 
    destinatario: 'Supermercado XYZ', 
    dataEmissao: '2023-10-22', 
    status: 'indenizada', 
    prioridade: 'normal',
    valorTotal: 'R$ 8.850,00',
  },
  { 
    id: 'NF009', 
    numero: 'NF12353', 
    emitente: 'Empresa YZ', 
    destinatario: 'Farmácia ABC', 
    dataEmissao: '2023-10-23', 
    status: 'coleta_agendada', 
    prioridade: 'normal',
    valorTotal: 'R$ 9.150,00',
  },
  { 
    id: 'NF010', 
    numero: 'NF12354', 
    emitente: 'Empresa AB', 
    destinatario: 'Hospital XYZ', 
    dataEmissao: '2023-10-24', 
    status: 'coletando', 
    prioridade: 'expressa',
    valorTotal: 'R$ 10.450,00',
  }
];

// Status rendering helper
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    'coleta_agendada': { icon: Clock, color: 'bg-blue-100 text-blue-800', text: 'Coleta agendada' },
    'coletando': { icon: Truck, color: 'bg-amber-100 text-amber-800', text: 'Coletando' },
    'coletado': { icon: Check, color: 'bg-green-100 text-green-800', text: 'Coletado' },
    'no_armazem': { icon: Box, color: 'bg-indigo-100 text-indigo-800', text: 'No armazém' },
    'em_transferencia': { icon: Truck, color: 'bg-purple-100 text-purple-800', text: 'Em transferência' },
    'em_rota_entrega': { icon: Truck, color: 'bg-teal-100 text-teal-800', text: 'Em rota de entrega' },
    'entregue': { icon: Flag, color: 'bg-green-100 text-green-800', text: 'Entregue' },
    'extraviada': { icon: FlagOff, color: 'bg-red-100 text-red-800', text: 'Extraviada' },
    'avariada': { icon: Shield, color: 'bg-orange-100 text-orange-800', text: 'Avariada' },
    'sinistrada': { icon: Shield, color: 'bg-red-100 text-red-800', text: 'Sinistrada' },
    'indenizada': { icon: Award, color: 'bg-gray-100 text-gray-800', text: 'Indenizada' }
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['coletado'];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`${config.color} flex items-center gap-1`}>
      <Icon size={14} /> {config.text}
    </Badge>
  );
};

// Priority badge
const PriorityBadge = ({ priority }: { priority: string }) => {
  const priorityConfig = {
    'normal': { color: 'bg-gray-100 text-gray-800', text: 'Normal' },
    'prioridade': { color: 'bg-yellow-100 text-yellow-800', text: 'Prioridade' },
    'expressa': { color: 'bg-red-100 text-red-800', text: 'Expressa' },
    'bloqueada': { color: 'bg-gray-100 text-gray-800 line-through', text: 'Bloqueada' }
  };

  const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig['normal'];

  return (
    <Badge variant="outline" className={`${config.color}`}>{config.text}</Badge>
  );
};

const RastreamentoNotasFiscais: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('todas');
  const [filteredNotas, setFilteredNotas] = useState(notasFiscaisMock);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('todos');
  const [selectedPriority, setSelectedPriority] = useState('todas');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  // Filter functions
  const filterByTab = (tab: string, notasFiscais: typeof notasFiscaisMock) => {
    if (tab === 'todas') return notasFiscais;
    
    const statusMap: Record<string, string[]> = {
      'em_transito': ['coletando', 'em_transferencia', 'em_rota_entrega'],
      'finalizadas': ['entregue', 'indenizada'],
      'pendentes': ['coleta_agendada', 'no_armazem'],
      'problemas': ['extraviada', 'avariada', 'sinistrada', 'bloqueada'],
    };
    
    return notasFiscais.filter(nf => 
      statusMap[tab]?.includes(nf.status)
    );
  };

  const applyFilters = () => {
    let filtered = [...notasFiscaisMock];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(nf => 
        nf.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nf.emitente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        nf.destinatario.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (selectedStatus !== 'todos') {
      filtered = filtered.filter(nf => nf.status === selectedStatus);
    }
    
    // Filter by priority
    if (selectedPriority !== 'todas') {
      filtered = filtered.filter(nf => nf.prioridade === selectedPriority);
    }
    
    // Apply tab filter
    filtered = filterByTab(selectedTab, filtered);
    
    setFilteredNotas(filtered);
  };

  React.useEffect(() => {
    applyFilters();
  }, [selectedTab, searchTerm, selectedStatus, selectedPriority]);

  // Kanban column rendering function
  const renderKanbanColumn = (title: string, status: string[], notas: typeof filteredNotas) => {
    const columnNotas = notas.filter(nota => status.includes(nota.status));
    
    return (
      <div className="min-w-[300px] flex-1">
        <div className="bg-muted rounded-t-md p-2 font-medium text-sm">{title} ({columnNotas.length})</div>
        <div className="flex flex-col gap-2 p-2 bg-muted/30 rounded-b-md h-[calc(100%-2.5rem)] overflow-auto">
          {columnNotas.length > 0 ? (
            columnNotas.map(nota => (
              <Card key={nota.id} className="shadow-sm hover:shadow transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">{nota.numero}</div>
                    <PriorityBadge priority={nota.prioridade} />
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">{nota.emitente} → {nota.destinatario}</div>
                  <div className="text-sm mb-2">{nota.valorTotal}</div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground">{nota.dataEmissao}</div>
                    <StatusBadge status={nota.status} />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex items-center justify-center h-20 text-sm text-muted-foreground">
              Nenhuma nota fiscal
            </div>
          )}
        </div>
      </div>
    );
  };

  // Handle status update
  const handleUpdateStatus = (notaId: string, newStatus: string) => {
    // In a real app, this would call an API to update the status
    toast({
      title: "Status atualizado",
      description: `Status da nota fiscal ${notaId} alterado para ${newStatus}`,
    });
  };

  // Handle priority update
  const handleUpdatePriority = (notaId: string, newPriority: string) => {
    // In a real app, this would call an API to update the priority
    toast({
      title: "Prioridade atualizada",
      description: `Prioridade da nota fiscal ${notaId} alterada para ${newPriority}`,
    });
  };

  const filterConfig = [
    {
      name: 'Status',
      options: [
        { label: 'Todos', value: 'todos' },
        { label: 'Coleta agendada', value: 'coleta_agendada' },
        { label: 'Coletando', value: 'coletando' },
        { label: 'Coletado', value: 'coletado' },
        { label: 'No armazém', value: 'no_armazem' },
        { label: 'Em transferência', value: 'em_transferencia' },
        { label: 'Em rota de entrega', value: 'em_rota_entrega' },
        { label: 'Entregue', value: 'entregue' },
        { label: 'Extraviada', value: 'extraviada' },
        { label: 'Avariada', value: 'avariada' },
        { label: 'Sinistrada', value: 'sinistrada' },
        { label: 'Indenizada', value: 'indenizada' },
      ]
    },
    {
      name: 'Prioridade',
      options: [
        { label: 'Todas', value: 'todas' },
        { label: 'Normal', value: 'normal' },
        { label: 'Prioridade', value: 'prioridade' },
        { label: 'Expressa', value: 'expressa' },
        { label: 'Bloqueada', value: 'bloqueada' },
      ]
    }
  ];

  return (
    <MainLayout title="Rastreamento de Notas Fiscais">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Rastreamento de Notas Fiscais</h1>
            <p className="text-muted-foreground">Acompanhe o status atual de cada nota fiscal</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('list')}
              className="flex items-center gap-1"
            >
              <List className="h-4 w-4" />
              Lista
            </Button>
            <Button 
              variant={viewMode === 'kanban' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setViewMode('kanban')}
              className="flex items-center gap-1"
            >
              <Kanban className="h-4 w-4" />
              Kanban
            </Button>
          </div>
        </div>

        {/* Search and filters */}
        <Card>
          <CardContent className="pt-6">
            <SearchFilter 
              placeholder="Buscar por número da NF, emitente ou destinatário..."
              filters={filterConfig}
              onSearch={(value) => setSearchTerm(value)}
              onFilterChange={(filter, value) => {
                if (filter === 'Status') setSelectedStatus(value);
                if (filter === 'Prioridade') setSelectedPriority(value);
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notas Fiscais</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="todas" value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="todas">Todas</TabsTrigger>
                <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
                <TabsTrigger value="em_transito">Em Trânsito</TabsTrigger>
                <TabsTrigger value="finalizadas">Finalizadas</TabsTrigger>
                <TabsTrigger value="problemas">Problemas</TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab}>
                {viewMode === 'list' ? (
                  <DataTable
                    columns={[
                      { header: 'NF', accessor: 'numero' },
                      { header: 'Emitente', accessor: 'emitente' },
                      { header: 'Destinatário', accessor: 'destinatario' },
                      { header: 'Data Emissão', accessor: 'dataEmissao' },
                      { header: 'Valor', accessor: 'valorTotal' },
                      { 
                        header: 'Status', 
                        accessor: 'status',
                        cell: (row) => <StatusBadge status={row.status} />
                      },
                      { 
                        header: 'Prioridade', 
                        accessor: 'prioridade',
                        cell: (row) => <PriorityBadge priority={row.prioridade} />
                      },
                      {
                        header: 'Ações',
                        accessor: 'acoes',
                        cell: (row) => (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Search className="h-4 w-4" />
                            </Button>
                            <Select 
                              onValueChange={(value) => handleUpdateStatus(row.id, value)}
                              defaultValue={row.status}
                            >
                              <SelectTrigger className="h-8 w-[180px]">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="coleta_agendada">Coleta agendada</SelectItem>
                                <SelectItem value="coletando">Coletando</SelectItem>
                                <SelectItem value="coletado">Coletado</SelectItem>
                                <SelectItem value="no_armazem">No armazém</SelectItem>
                                <SelectItem value="em_transferencia">Em transferência</SelectItem>
                                <SelectItem value="em_rota_entrega">Em rota de entrega</SelectItem>
                                <SelectItem value="entregue">Entregue</SelectItem>
                                <SelectItem value="extraviada">Extraviada</SelectItem>
                                <SelectItem value="avariada">Avariada</SelectItem>
                                <SelectItem value="sinistrada">Sinistrada</SelectItem>
                                <SelectItem value="indenizada">Indenizada</SelectItem>
                              </SelectContent>
                            </Select>
                            <Select
                              onValueChange={(value) => handleUpdatePriority(row.id, value)}
                              defaultValue={row.prioridade}
                            >
                              <SelectTrigger className="h-8 w-[130px]">
                                <SelectValue placeholder="Prioridade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="prioridade">Prioridade</SelectItem>
                                <SelectItem value="expressa">Expressa</SelectItem>
                                <SelectItem value="bloqueada">Bloqueada</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )
                      }
                    ]}
                    data={filteredNotas}
                  />
                ) : (
                  <div className="flex gap-4 overflow-auto pb-4" style={{ minHeight: "calc(100vh - 400px)" }}>
                    {renderKanbanColumn("Pendentes", ["coleta_agendada", "no_armazem"], filteredNotas)}
                    {renderKanbanColumn("Em Coleta", ["coletando", "coletado"], filteredNotas)}
                    {renderKanbanColumn("Em Trânsito", ["em_transferencia", "em_rota_entrega"], filteredNotas)}
                    {renderKanbanColumn("Finalizadas", ["entregue", "indenizada"], filteredNotas)}
                    {renderKanbanColumn("Problemas", ["extraviada", "avariada", "sinistrada", "bloqueada"], filteredNotas)}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default RastreamentoNotasFiscais;
