
import React from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, Barcode, Printer, Search } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import SearchFilter from '@/components/common/SearchFilter';

// Mock data
const volumesParaEtiquetar = [
  { id: 'VOL-2023-001', notaFiscal: '12345', descricao: 'Caixa 30x20x15', quantidade: 10, etiquetado: false },
  { id: 'VOL-2023-002', notaFiscal: '12345', descricao: 'Caixa 40x30x25', quantidade: 5, etiquetado: false },
  { id: 'VOL-2023-003', notaFiscal: '12346', descricao: 'Pacote 50x40', quantidade: 20, etiquetado: true },
];

const GeracaoEtiquetas: React.FC = () => {
  const form = useForm();
  
  const handleSubmit = (data: any) => {
    console.log('Form data submitted:', data);
  };

  return (
    <MainLayout title="Geração de Etiquetas">
      <div className="mb-6">
        <h2 className="text-2xl font-heading mb-2">Geração de Etiquetas por Volume</h2>
        <p className="text-gray-600">Gere etiquetas de identificação única para cada volume</p>
      </div>
      
      <Tabs defaultValue="gerar" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="gerar">Gerar Etiquetas</TabsTrigger>
          <TabsTrigger value="consultar">Consultar Etiquetas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="gerar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Barcode className="mr-2 text-cross-blue" size={20} />
                    Geração de Etiquetas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <FormField
                            control={form.control}
                            name="notaFiscal"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nota Fiscal</FormLabel>
                                <div className="relative">
                                  <FormControl>
                                    <Input placeholder="Buscar nota fiscal..." {...field} />
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
                            name="tipoEtiqueta"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tipo de Etiqueta</FormLabel>
                                <FormControl>
                                  <select 
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2"
                                    {...field}
                                  >
                                    <option value="">Selecione</option>
                                    <option value="volume">Etiqueta de Volume</option>
                                    <option value="palete">Etiqueta de Palete</option>
                                    <option value="mae">Etiqueta Mãe</option>
                                  </select>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <FormField
                            control={form.control}
                            name="volumesTotal"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Quantidade de Volumes</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="0" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div>
                          <FormField
                            control={form.control}
                            name="formatoImpressao"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Formato de Impressão</FormLabel>
                                <FormControl>
                                  <select 
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2"
                                    {...field}
                                  >
                                    <option value="">Selecione</option>
                                    <option value="10x15">10x15 cm</option>
                                    <option value="15x20">15x20 cm</option>
                                    <option value="a4">Folha A4</option>
                                  </select>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline">Cancelar</Button>
                        <Button type="submit" className="bg-cross-blue hover:bg-cross-blue/90">
                          <Barcode size={16} className="mr-2" />
                          Gerar Etiquetas
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Volumes para Etiquetar</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable
                    columns={[
                      { header: 'ID', accessor: 'id' },
                      { header: 'Nota Fiscal', accessor: 'notaFiscal' },
                      { header: 'Descrição', accessor: 'descricao' },
                      { header: 'Quantidade', accessor: 'quantidade' },
                      { 
                        header: 'Status', 
                        accessor: 'etiquetado',
                        cell: (row) => {
                          return row.etiquetado ? 
                            <StatusBadge status="success" text="Etiquetado" /> : 
                            <StatusBadge status="warning" text="Pendente" />;
                        }
                      },
                      {
                        header: 'Ações',
                        cell: (row) => (
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={row.etiquetado}
                              className={`${!row.etiquetado ? 'bg-cross-blue text-white hover:bg-cross-blue/90' : ''}`}
                            >
                              <Printer size={16} className="mr-1" />
                              Imprimir
                            </Button>
                          </div>
                        )
                      }
                    ]}
                    data={volumesParaEtiquetar}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Modelo de Etiqueta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md p-4 h-48 flex items-center justify-center">
                    <div className="text-center">
                      <Barcode size={40} className="mx-auto mb-2 text-cross-blue" />
                      <p className="text-sm text-gray-500">Selecione um tipo de etiqueta para visualizar o modelo</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Informações na Etiqueta</h3>
                    <ul className="text-sm space-y-1">
                      <li>• ID único do volume</li>
                      <li>• Número da nota fiscal</li>
                      <li>• Código de barras</li>
                      <li>• Origem/Destino</li>
                      <li>• Data de recebimento</li>
                    </ul>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Impressoras Disponíveis</h3>
                    <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2">
                      <option value="">Selecionar impressora</option>
                      <option value="zebra">Zebra ZT410</option>
                      <option value="datamax">Datamax E-4205</option>
                      <option value="brother">Brother QL-820NWB</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="consultar">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Etiquetas Geradas</CardTitle>
            </CardHeader>
            <CardContent>
              <SearchFilter 
                placeholder="Buscar por ID, nota fiscal ou descrição..." 
                filters={[
                  {
                    name: "Status",
                    options: [
                      { label: "Etiquetado", value: "true" },
                      { label: "Pendente", value: "false" }
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
                  { header: 'Nota Fiscal', accessor: 'notaFiscal' },
                  { header: 'Descrição', accessor: 'descricao' },
                  { header: 'Quantidade', accessor: 'quantidade' },
                  { 
                    header: 'Status', 
                    accessor: 'etiquetado',
                    cell: (row) => {
                      return row.etiquetado ? 
                        <StatusBadge status="success" text="Etiquetado" /> : 
                        <StatusBadge status="warning" text="Pendente" />;
                    }
                  },
                  {
                    header: 'Ações',
                    cell: () => (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <FileText size={16} className="mr-1" />
                          Detalhes
                        </Button>
                        <Button variant="outline" size="sm">
                          <Printer size={16} className="mr-1" />
                          Reimprimir
                        </Button>
                      </div>
                    )
                  }
                ]}
                data={volumesParaEtiquetar}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default GeracaoEtiquetas;
