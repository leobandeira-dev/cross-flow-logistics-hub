
import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import SearchFilter from '../../components/common/SearchFilter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, FileImage, FileText, MoreHorizontal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data
const ocorrencias = [
  { 
    id: 'OC-2023-001', 
    cliente: 'Indústria ABC Ltda', 
    tipo: 'extravio', 
    dataRegistro: '10/05/2023', 
    dataOcorrencia: '08/05/2023',
    nf: '12345',
    descricao: 'Volume não localizado após entrega.',
    status: 'open',
    prioridade: 'high'
  },
  { 
    id: 'OC-2023-002', 
    cliente: 'Distribuidora XYZ', 
    tipo: 'atraso', 
    dataRegistro: '09/05/2023', 
    dataOcorrencia: '08/05/2023',
    nf: '98765',
    descricao: 'Entrega realizada com 2 dias de atraso.',
    status: 'in_progress',
    prioridade: 'medium'
  },
  { 
    id: 'OC-2023-003', 
    cliente: 'Farmacêutica Beta', 
    tipo: 'avaria', 
    dataRegistro: '08/05/2023', 
    dataOcorrencia: '07/05/2023',
    nf: '54321',
    descricao: 'Caixa danificada. Produto interno intacto.',
    status: 'resolved',
    prioridade: 'low'
  },
  { 
    id: 'OC-2023-004', 
    cliente: 'Eletrônicos Tech', 
    tipo: 'divergencia', 
    dataRegistro: '07/05/2023', 
    dataOcorrencia: '06/05/2023',
    nf: '23456',
    descricao: 'Quantidade recebida divergente da NF.',
    status: 'closed',
    prioridade: 'high'
  },
];

const Ocorrencias = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedOcorrencia, setSelectedOcorrencia] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('pendentes');
  const [currentPage, setCurrentPage] = useState(1);
  
  const filters = [
    {
      name: 'Status',
      options: [
        { label: 'Todos', value: 'all' },
        { label: 'Aberto', value: 'open' },
        { label: 'Em Andamento', value: 'in_progress' },
        { label: 'Resolvido', value: 'resolved' },
        { label: 'Fechado', value: 'closed' },
      ]
    },
    {
      name: 'Tipo',
      options: [
        { label: 'Todos', value: 'all' },
        { label: 'Extravio', value: 'extravio' },
        { label: 'Avaria', value: 'avaria' },
        { label: 'Atraso', value: 'atraso' },
        { label: 'Divergência', value: 'divergencia' },
      ]
    },
    {
      name: 'Prioridade',
      options: [
        { label: 'Todas', value: 'all' },
        { label: 'Alta', value: 'high' },
        { label: 'Média', value: 'medium' },
        { label: 'Baixa', value: 'low' },
      ]
    },
  ];
  
  const handleSearch = (value: string) => {
    console.log('Search:', value);
    // Implementar lógica de busca
  };
  
  const handleFilterChange = (filter: string, value: string) => {
    console.log(`Filter ${filter} changed to ${value}`);
    // Implementar lógica de filtro
  };
  
  const showDetail = (ocorrencia: any) => {
    setSelectedOcorrencia(ocorrencia);
    setIsDetailDialogOpen(true);
  };
  
  const getStatusBadge = (status: string) => {
    const statusMap: any = {
      'open': { type: 'error', text: 'Aberto' },
      'in_progress': { type: 'warning', text: 'Em Andamento' },
      'resolved': { type: 'info', text: 'Resolvido' },
      'closed': { type: 'success', text: 'Fechado' },
    };
    const statusData = statusMap[status];
    return <StatusBadge status={statusData.type} text={statusData.text} />;
  };
  
  const getPrioridadeBadge = (prioridade: string) => {
    const prioridadeMap: any = {
      'high': { type: 'error', text: 'Alta' },
      'medium': { type: 'warning', text: 'Média' },
      'low': { type: 'info', text: 'Baixa' },
    };
    const prioridadeData = prioridadeMap[prioridade];
    return <StatusBadge status={prioridadeData.type} text={prioridadeData.text} />;
  };

  return (
    <MainLayout title="Gestão de Ocorrências">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-heading">SAC - Gestão de Ocorrências</h2>
          <p className="text-gray-500">Acompanhe e gerencie ocorrências logísticas</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cross-blue hover:bg-cross-blueDark">
              <Plus className="mr-2 h-4 w-4" /> Nova Ocorrência
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Registrar Nova Ocorrência</DialogTitle>
              <DialogDescription>
                Preencha os dados para registrar uma nova ocorrência de SAC.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente *</Label>
                <Select>
                  <SelectTrigger id="cliente">
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="abc">Indústria ABC Ltda</SelectItem>
                    <SelectItem value="xyz">Distribuidora XYZ</SelectItem>
                    <SelectItem value="beta">Farmacêutica Beta</SelectItem>
                    <SelectItem value="tech">Eletrônicos Tech</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nf">Nota Fiscal *</Label>
                  <Input id="nf" placeholder="Número da NF" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Ocorrência *</Label>
                  <Select>
                    <SelectTrigger id="tipo">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="extravio">Extravio</SelectItem>
                      <SelectItem value="avaria">Avaria</SelectItem>
                      <SelectItem value="atraso">Atraso</SelectItem>
                      <SelectItem value="divergencia">Divergência</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data-ocorrencia">Data da Ocorrência *</Label>
                  <Input id="data-ocorrencia" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prioridade">Prioridade *</Label>
                  <Select>
                    <SelectTrigger id="prioridade">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="low">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição Detalhada *</Label>
                <Textarea 
                  id="descricao" 
                  placeholder="Descreva a ocorrência com detalhes" 
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="evidencias">Evidências (Fotos/Documentos)</Label>
                <Input id="evidencias" type="file" multiple accept="image/*,application/pdf" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contato-cliente">Contato para Retorno</Label>
                <Input id="contato-cliente" placeholder="Nome e telefone/email para retorno" />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button className="bg-cross-blue hover:bg-cross-blueDark">Registrar Ocorrência</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="pendentes" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
          <TabsTrigger value="andamento">Em Andamento</TabsTrigger>
          <TabsTrigger value="finalizadas">Finalizadas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pendentes">
          <SearchFilter 
            placeholder="Buscar por ID, cliente ou NF..."
            filters={filters}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Ocorrências Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={[
                  { header: 'ID', accessor: 'id' },
                  { header: 'Cliente', accessor: 'cliente' },
                  { header: 'NF', accessor: 'nf' },
                  { 
                    header: 'Tipo', 
                    accessor: 'tipo',
                    cell: (row) => {
                      const tipoMap: any = {
                        'extravio': 'Extravio',
                        'avaria': 'Avaria',
                        'atraso': 'Atraso',
                        'divergencia': 'Divergência',
                      };
                      return tipoMap[row.tipo] || row.tipo;
                    }
                  },
                  { header: 'Data Registro', accessor: 'dataRegistro' },
                  { 
                    header: 'Prioridade', 
                    accessor: 'prioridade',
                    cell: (row) => getPrioridadeBadge(row.prioridade)
                  },
                  { 
                    header: 'Status', 
                    accessor: 'status',
                    cell: (row) => getStatusBadge(row.status)
                  },
                  { 
                    header: 'Ações', 
                    accessor: '',
                    cell: (row) => (
                      <div className="flex space-x-2 justify-end">
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            showDetail(row);
                          }}
                          size="sm"
                          className="bg-cross-blue hover:bg-cross-blueDark"
                        >
                          Detalhes
                        </Button>
                      </div>
                    )
                  }
                ]}
                data={ocorrencias.filter(o => o.status === 'open')}
                pagination={{
                  totalPages: Math.ceil(ocorrencias.filter(o => o.status === 'open').length / 10),
                  currentPage: currentPage,
                  onPageChange: setCurrentPage
                }}
                onRowClick={showDetail}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="andamento">
          <SearchFilter 
            placeholder="Buscar por ID, cliente ou NF..."
            filters={filters}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Ocorrências em Andamento</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={[
                  { header: 'ID', accessor: 'id' },
                  { header: 'Cliente', accessor: 'cliente' },
                  { header: 'NF', accessor: 'nf' },
                  { 
                    header: 'Tipo', 
                    accessor: 'tipo',
                    cell: (row) => {
                      const tipoMap: any = {
                        'extravio': 'Extravio',
                        'avaria': 'Avaria',
                        'atraso': 'Atraso',
                        'divergencia': 'Divergência',
                      };
                      return tipoMap[row.tipo] || row.tipo;
                    }
                  },
                  { header: 'Data Registro', accessor: 'dataRegistro' },
                  { 
                    header: 'Prioridade', 
                    accessor: 'prioridade',
                    cell: (row) => getPrioridadeBadge(row.prioridade)
                  },
                  { 
                    header: 'Status', 
                    accessor: 'status',
                    cell: (row) => getStatusBadge(row.status)
                  },
                  { 
                    header: 'Ações', 
                    accessor: '',
                    cell: (row) => (
                      <div className="flex space-x-2 justify-end">
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            showDetail(row);
                          }}
                          size="sm"
                          className="bg-cross-blue hover:bg-cross-blueDark"
                        >
                          Detalhes
                        </Button>
                      </div>
                    )
                  }
                ]}
                data={ocorrencias.filter(o => o.status === 'in_progress')}
                pagination={{
                  totalPages: Math.ceil(ocorrencias.filter(o => o.status === 'in_progress').length / 10),
                  currentPage: currentPage,
                  onPageChange: setCurrentPage
                }}
                onRowClick={showDetail}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="finalizadas">
          <SearchFilter 
            placeholder="Buscar por ID, cliente ou NF..."
            filters={filters}
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
          />
          
          <Card>
            <CardHeader>
              <CardTitle>Ocorrências Finalizadas</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={[
                  { header: 'ID', accessor: 'id' },
                  { header: 'Cliente', accessor: 'cliente' },
                  { header: 'NF', accessor: 'nf' },
                  { 
                    header: 'Tipo', 
                    accessor: 'tipo',
                    cell: (row) => {
                      const tipoMap: any = {
                        'extravio': 'Extravio',
                        'avaria': 'Avaria',
                        'atraso': 'Atraso',
                        'divergencia': 'Divergência',
                      };
                      return tipoMap[row.tipo] || row.tipo;
                    }
                  },
                  { header: 'Data Registro', accessor: 'dataRegistro' },
                  { 
                    header: 'Status', 
                    accessor: 'status',
                    cell: (row) => getStatusBadge(row.status)
                  },
                  { 
                    header: 'Ações', 
                    accessor: '',
                    cell: (row) => (
                      <div className="flex space-x-2 justify-end">
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            showDetail(row);
                          }}
                          size="sm"
                          variant="outline"
                        >
                          Detalhes
                        </Button>
                      </div>
                    )
                  }
                ]}
                data={ocorrencias.filter(o => o.status === 'resolved' || o.status === 'closed')}
                pagination={{
                  totalPages: Math.ceil(ocorrencias.filter(o => o.status === 'resolved' || o.status === 'closed').length / 10),
                  currentPage: currentPage,
                  onPageChange: setCurrentPage
                }}
                onRowClick={showDetail}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {selectedOcorrencia && (
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Detalhes da Ocorrência #{selectedOcorrencia.id}</DialogTitle>
              <DialogDescription>
                Visualize todos os detalhes e atualize o status da ocorrência.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">Cliente</p>
                  <p className="font-medium">{selectedOcorrencia.cliente}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedOcorrencia.status)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nota Fiscal</p>
                  <p className="font-medium">{selectedOcorrencia.nf}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tipo</p>
                  <p className="font-medium">
                    {selectedOcorrencia.tipo === 'extravio' ? 'Extravio' : 
                     selectedOcorrencia.tipo === 'avaria' ? 'Avaria' :
                     selectedOcorrencia.tipo === 'atraso' ? 'Atraso' :
                     selectedOcorrencia.tipo === 'divergencia' ? 'Divergência' : 
                     selectedOcorrencia.tipo}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Prioridade</p>
                  <div className="mt-1">{getPrioridadeBadge(selectedOcorrencia.prioridade)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Data do Registro</p>
                  <p className="font-medium">{selectedOcorrencia.dataRegistro}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data da Ocorrência</p>
                  <p className="font-medium">{selectedOcorrencia.dataOcorrencia}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Descrição</p>
                <p className="mt-1 p-3 bg-gray-50 rounded-md">{selectedOcorrencia.descricao}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Evidências</p>
                <div className="flex space-x-2">
                  <div className="p-4 border border-dashed rounded-lg w-24 h-24 flex items-center justify-center">
                    <FileImage className="text-gray-400" size={32} />
                  </div>
                  <div className="p-4 border border-dashed rounded-lg w-24 h-24 flex items-center justify-center">
                    <FileText className="text-gray-400" size={32} />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Atualizar Status</p>
                <div className="flex space-x-4 items-center">
                  <Select>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Selecione um novo status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_progress">Em Andamento</SelectItem>
                      <SelectItem value="resolved">Resolvido</SelectItem>
                      <SelectItem value="closed">Fechado</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button className="bg-cross-blue hover:bg-cross-blueDark">Atualizar</Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Adicionar Comentário</p>
                <Textarea placeholder="Digite um comentário ou observação" />
                <div className="flex justify-end">
                  <Button variant="outline" className="mr-2">
                    Anexar Arquivo
                  </Button>
                  <Button className="bg-cross-gray hover:bg-cross-grayDark">
                    Adicionar
                  </Button>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline"
                className="mr-auto"
                onClick={() => setIsDetailDialogOpen(false)}
              >
                Fechar
              </Button>
              
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" /> Gerar Relatório
              </Button>
              
              {selectedOcorrencia.status !== 'closed' && (
                <Button className="bg-cross-blue hover:bg-cross-blueDark">
                  Salvar Alterações
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  );
};

export default Ocorrencias;
