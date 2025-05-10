import React, { useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Archive, Package, Search, MapPin, Save } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import StatusBadge from '@/components/common/StatusBadge';

// Mock data
const volumesParaEnderecar = [
  { id: 'VOL-2023-001', tipo: 'Volume', descricao: 'Caixa 30x20x15', notaFiscal: '12345', endereco: null },
  { id: 'VOL-2023-002', tipo: 'Volume', descricao: 'Caixa 40x30x25', notaFiscal: '12345', endereco: null },
  { id: 'PAL-2023-001', tipo: 'Palete', descricao: 'Palete Standard', notaFiscal: 'Múltiplas', endereco: 'A-01-02-03' },
];

const enderecosDisponiveis = [
  { endereco: 'A-01-01-01', tipo: 'Prateleira', capacidade: 'Média', disponivel: true },
  { endereco: 'A-01-01-02', tipo: 'Prateleira', capacidade: 'Média', disponivel: true },
  { endereco: 'A-01-01-03', tipo: 'Prateleira', capacidade: 'Média', disponivel: false },
  { endereco: 'A-01-02-01', tipo: 'Piso', capacidade: 'Alta', disponivel: true },
  { endereco: 'A-01-02-02', tipo: 'Piso', capacidade: 'Alta', disponivel: true },
  { endereco: 'A-01-02-03', tipo: 'Piso', capacidade: 'Alta', disponivel: false },
];

const Enderecamento: React.FC = () => {
  const form = useForm();
  const [selectedVolume, setSelectedVolume] = useState<any>(null);
  const [selectedEndereco, setSelectedEndereco] = useState<string | null>(null);
  
  const handleSubmit = (data: any) => {
    console.log('Form data submitted:', data);
  };

  return (
    <MainLayout title="Endereçamento de Volumes">
      <div className="mb-6">
        <h2 className="text-2xl font-heading mb-2">Endereçamento de Volumes</h2>
        <p className="text-gray-600">Defina a localização dos volumes no armazém</p>
      </div>
      
      <Tabs defaultValue="enderecar" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="enderecar">Endereçar Volumes</TabsTrigger>
          <TabsTrigger value="consultar">Consultar Endereços</TabsTrigger>
        </TabsList>
        
        <TabsContent value="enderecar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Package className="mr-2 text-cross-blue" size={20} />
                    Buscar Volume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                      <div>
                        <FormField
                          control={form.control}
                          name="idVolume"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ID do Volume ou Etiqueta</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input placeholder="Digite o código do volume" {...field} />
                                </FormControl>
                                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-cross-blue hover:bg-cross-blue/90"
                        onClick={() => setSelectedVolume(volumesParaEnderecar[0])}
                      >
                        Buscar
                      </Button>
                    </form>
                  </Form>
                  
                  {selectedVolume && (
                    <div className="mt-4 border rounded-md p-4">
                      <h3 className="font-medium mb-2">Detalhes do Volume</h3>
                      <dl className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-gray-500">ID:</dt>
                          <dd>{selectedVolume.id}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Tipo:</dt>
                          <dd>{selectedVolume.tipo}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Descrição:</dt>
                          <dd>{selectedVolume.descricao}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Nota Fiscal:</dt>
                          <dd>{selectedVolume.notaFiscal}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Endereço Atual:</dt>
                          <dd>
                            {selectedVolume.endereco ? 
                              selectedVolume.endereco : 
                              <span className="text-amber-600">Não endereçado</span>
                            }
                          </dd>
                        </div>
                      </dl>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="novoEndereco"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Novo Endereço</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input 
                                placeholder="Digite ou selecione endereço" 
                                value={selectedEndereco || ''}
                                onChange={(e) => setSelectedEndereco(e.target.value)}
                              />
                            </FormControl>
                            <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      className="w-full mt-4 bg-cross-blue hover:bg-cross-blue/90"
                      disabled={!selectedVolume || !selectedEndereco}
                    >
                      <Save size={16} className="mr-2" />
                      Salvar Endereçamento
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Archive className="mr-2 text-cross-blue" size={20} />
                    Endereços Disponíveis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                    {enderecosDisponiveis.map((endereco) => (
                      <div 
                        key={endereco.endereco}
                        className={`
                          border p-3 rounded-md cursor-pointer transition-colors
                          ${endereco.disponivel ? 'hover:border-cross-blue hover:bg-blue-50' : 'bg-gray-100 opacity-60 cursor-not-allowed'}
                          ${selectedEndereco === endereco.endereco ? 'border-cross-blue bg-blue-50' : ''}
                        `}
                        onClick={() => {
                          if (endereco.disponivel) {
                            setSelectedEndereco(endereco.endereco);
                          }
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <span className="font-medium">{endereco.endereco}</span>
                          {endereco.disponivel ? 
                            <StatusBadge status="success" text="Livre" /> : 
                            <StatusBadge status="error" text="Ocupado" />
                          }
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{endereco.tipo}</p>
                        <p className="text-xs text-gray-500">Cap: {endereco.capacidade}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Volumes Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable
                    columns={[
                      { header: 'ID', accessor: 'id' },
                      { header: 'Tipo', accessor: 'tipo' },
                      { header: 'Descrição', accessor: 'descricao' },
                      { header: 'Nota Fiscal', accessor: 'notaFiscal' },
                      { 
                        header: 'Endereço', 
                        accessor: 'endereco',
                        cell: (row) => {
                          return row.endereco ? 
                            <span>{row.endereco}</span> : 
                            <StatusBadge status="warning" text="Não endereçado" />;
                        }
                      },
                      {
                        header: 'Ações',
                        accessor: 'actions', // Add this line
                        cell: (row) => (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedVolume(row)}
                          >
                            Selecionar
                          </Button>
                        )
                      }
                    ]}
                    data={volumesParaEnderecar}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="consultar">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mapa de Endereçamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-64 border rounded-md bg-gray-50">
                <div className="text-center">
                  <Archive size={40} className="mx-auto mb-2 text-cross-blue" />
                  <p className="text-gray-600">Visualização do mapa de endereçamento do armazém</p>
                  <p className="text-sm text-gray-500">(Funcionalidade em desenvolvimento)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Enderecamento;
