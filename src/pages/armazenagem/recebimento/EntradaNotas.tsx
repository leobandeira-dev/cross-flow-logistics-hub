import React from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, Upload, Search, Plus } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import SearchFilter from '@/components/common/SearchFilter';

// Mock data
const notasFiscais = [
  { id: 'NF-2023-001', numero: '12345', fornecedor: 'Fornecedor A', data: '10/05/2023', valor: 'R$ 1.250,00', status: 'pending' },
  { id: 'NF-2023-002', numero: '12346', fornecedor: 'Fornecedor B', data: '09/05/2023', valor: 'R$ 2.150,00', status: 'processing' },
  { id: 'NF-2023-003', numero: '12347', fornecedor: 'Fornecedor C', data: '08/05/2023', valor: 'R$ 3.450,00', status: 'completed' },
];

const EntradaNotas: React.FC = () => {
  const form = useForm();
  
  const handleSubmit = (data: any) => {
    console.log('Form data submitted:', data);
  };

  return (
    <MainLayout title="Entrada de Notas Fiscais">
      <div className="mb-6">
        <h2 className="text-2xl font-heading mb-2">Entrada de Notas Fiscais</h2>
        <p className="text-gray-600">Registre e processe notas fiscais de entrada de mercadorias</p>
      </div>
      
      <Tabs defaultValue="cadastrar" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="cadastrar">Cadastrar Nota</TabsTrigger>
          <TabsTrigger value="consultar">Consultar Notas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cadastrar">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <FileText className="mr-2 text-cross-blue" size={20} />
                Cadastro de Nota Fiscal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <FormField
                        control={form.control}
                        name="numeroNF"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número da NF</FormLabel>
                            <FormControl>
                              <Input placeholder="Informe o número" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="fornecedor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fornecedor</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input placeholder="Buscar fornecedor..." {...field} />
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
                        name="dataEmissao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de Emissão</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <FormField
                        control={form.control}
                        name="valorTotal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Valor Total</FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="0,00" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="tipoOperacao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Operação</FormLabel>
                            <FormControl>
                              <select 
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2"
                                {...field}
                              >
                                <option value="">Selecione</option>
                                <option value="compra">Compra</option>
                                <option value="devolucao">Devolução</option>
                                <option value="transferencia">Transferência</option>
                                <option value="conserto">Conserto</option>
                              </select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button type="button" variant="outline" className="w-full">
                        <Upload size={16} className="mr-2" />
                        Anexar XML
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Card className="border-dashed">
                      <CardContent className="p-4">
                        <div className="text-center">
                          <h3 className="font-medium mb-2">Itens da Nota Fiscal</h3>
                          <p className="text-sm text-gray-500 mb-4">Adicione os itens da nota fiscal</p>
                          <Button className="bg-cross-blue hover:bg-cross-blue/90">
                            <Plus size={16} className="mr-2" />
                            Adicionar Item
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline">Cancelar</Button>
                    <Button type="submit" className="bg-cross-blue hover:bg-cross-blue/90">
                      Cadastrar Nota Fiscal
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
              <CardTitle className="text-lg">Notas Fiscais Registradas</CardTitle>
            </CardHeader>
            <CardContent>
              <SearchFilter 
                placeholder="Buscar por número ou fornecedor..." 
                filters={[
                  {
                    name: "Status",
                    options: [
                      { label: "Pendente", value: "pending" },
                      { label: "Em Processamento", value: "processing" },
                      { label: "Concluída", value: "completed" }
                    ]
                  },
                  {
                    name: "Período",
                    options: [
                      { label: "Hoje", value: "today" },
                      { label: "Esta semana", value: "thisWeek" },
                      { label: "Este mês", value: "thisMonth" }
                    ]
                  }
                ]}
              />
              
              <DataTable
                columns={[
                  { header: 'ID', accessor: 'id' },
                  { header: 'Número NF', accessor: 'numero' },
                  { header: 'Fornecedor', accessor: 'fornecedor' },
                  { header: 'Data', accessor: 'data' },
                  { header: 'Valor', accessor: 'valor' },
                  { 
                    header: 'Status', 
                    accessor: 'status',
                    cell: (row) => {
                      const statusMap: any = {
                        'pending': { type: 'warning', text: 'Pendente' },
                        'processing': { type: 'info', text: 'Em Processamento' },
                        'completed': { type: 'success', text: 'Concluída' },
                      };
                      const status = statusMap[row.status];
                      return <StatusBadge status={status.type} text={status.text} />;
                    }
                  },
                  {
                    header: 'Ações',
                    accessor: 'actions', // Add this line
                    cell: () => (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Detalhes</Button>
                        <Button variant="outline" size="sm">Imprimir</Button>
                      </div>
                    )
                  }
                ]}
                data={notasFiscais}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default EntradaNotas;
