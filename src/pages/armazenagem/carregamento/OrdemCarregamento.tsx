
import React from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, Truck, Calendar, Search } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import SearchFilter from '@/components/common/SearchFilter';

// Mock data
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

const OrdemCarregamento: React.FC = () => {
  const form = useForm();
  
  const handleSubmit = (data: any) => {
    console.log('Form data submitted:', data);
  };

  return (
    <MainLayout title="Ordem de Carregamento">
      <div className="mb-6">
        <h2 className="text-2xl font-heading mb-2">Ordem de Carregamento (OC)</h2>
        <p className="text-gray-600">Crie e gerencie ordens de carregamento para expedição</p>
      </div>
      
      <Tabs defaultValue="criar" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="criar">Criar OC</TabsTrigger>
          <TabsTrigger value="consultar">Consultar OC</TabsTrigger>
        </TabsList>
        
        <TabsContent value="criar">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileText className="mr-2 text-cross-blue" size={20} />
                Nova Ordem de Carregamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <FormField
                        control={form.control}
                        name="cliente"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cliente</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input placeholder="Buscar cliente..." {...field} />
                              </FormControl>
                              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="tipoCarregamento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Carregamento</FormLabel>
                            <FormControl>
                              <select 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2"
                                {...field}
                              >
                                <option value="">Selecione</option>
                                <option value="entrega">Entrega</option>
                                <option value="transferencia">Transferência</option>
                                <option value="devolucao">Devolução</option>
                              </select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="dataCarregamento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de Carregamento</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <FormField
                        control={form.control}
                        name="transportadora"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Transportadora</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input placeholder="Buscar transportadora..." {...field} />
                              </FormControl>
                              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="placaVeiculo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Placa do Veículo</FormLabel>
                            <FormControl>
                              <Input placeholder="AAA-0000" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="motorista"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Motorista</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome do motorista" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <FormField
                      control={form.control}
                      name="observacoes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações</FormLabel>
                          <FormControl>
                            <textarea 
                              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              placeholder="Observações sobre o carregamento..."
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div>
                    <Card className="border-dashed">
                      <CardContent className="p-4">
                        <div className="text-center">
                          <h3 className="font-medium mb-2">Selecionar Itens para Carregamento</h3>
                          <p className="text-sm text-gray-500 mb-4">Adicione itens a serem carregados para esta OC</p>
                          <Button className="bg-cross-blue hover:bg-cross-blue/90">
                            Adicionar Itens
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline">Cancelar</Button>
                    <Button type="submit" className="bg-cross-blue hover:bg-cross-blue/90">
                      Criar Ordem de Carregamento
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="consultar">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ordens de Carregamento</CardTitle>
            </CardHeader>
            <CardContent>
              <SearchFilter 
                placeholder="Buscar por ID, cliente ou destino..." 
                filters={[
                  {
                    name: "Status",
                    options: [
                      { label: "Pendente", value: "pending" },
                      { label: "Em Carregamento", value: "processing" },
                      { label: "Concluído", value: "completed" }
                    ]
                  },
                  {
                    name: "Período",
                    options: [
                      { label: "Hoje", value: "today" },
                      { label: "Amanhã", value: "tomorrow" },
                      { label: "Esta semana", value: "thisWeek" }
                    ]
                  }
                ]}
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
                    cell: (row) => (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <FileText size={16} className="mr-1" />
                          Detalhes
                        </Button>
                        {row.status !== 'completed' && (
                          <Button variant="outline" size="sm" className="bg-cross-blue text-white hover:bg-cross-blue/90">
                            <Truck size={16} className="mr-1" />
                            Iniciar
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
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default OrdemCarregamento;
