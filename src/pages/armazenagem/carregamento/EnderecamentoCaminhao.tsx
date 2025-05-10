
import React, { useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Truck, Search, Box, PackageOpen } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DataTable from '@/components/common/DataTable';

// Mock data for drag-and-drop items
const volumesPorCarregar = [
  { id: 'VOL-001', descricao: 'Caixa 30x20x15', peso: '5kg', fragil: false, posicionado: false },
  { id: 'VOL-002', descricao: 'Caixa 50x40x30', peso: '12kg', fragil: false, posicionado: false },
  { id: 'VOL-003', descricao: 'Caixa 20x15x10', peso: '2kg', fragil: true, posicionado: false },
  { id: 'VOL-004', descricao: 'Caixa 60x40x40', peso: '18kg', fragil: false, posicionado: false },
  { id: 'VOL-005', descricao: 'Caixa 25x20x15', peso: '4kg', fragil: true, posicionado: false },
];

const EnderecamentoCaminhao: React.FC = () => {
  const form = useForm();
  const [ordemSelecionada, setOrdemSelecionada] = useState<string | null>(null);
  const [volumes, setVolumes] = useState(volumesPorCarregar);
  const [carrinhoZonas, setCarrinhoZonas] = useState<any[]>([
    { id: 'zona1', nome: 'Frente', volumes: [] },
    { id: 'zona2', nome: 'Meio', volumes: [] },
    { id: 'zona3', nome: 'Fundo', volumes: [] },
  ]);
  
  const handleSubmit = (data: any) => {
    console.log('Form data submitted:', data);
    setOrdemSelecionada(data.numeroOC || 'OC-2023-001');
  };

  const moverVolume = (volumeId: string, zonaId: string) => {
    const volume = volumes.find(v => v.id === volumeId);
    if (!volume) return;

    // Atualizar o status do volume
    setVolumes(volumes.map(v => 
      v.id === volumeId ? { ...v, posicionado: true } : v
    ));

    // Adicionar o volume à zona
    setCarrinhoZonas(carrinhoZonas.map(zona => 
      zona.id === zonaId ? { ...zona, volumes: [...zona.volumes, volume] } : zona
    ));
  };

  const removerVolume = (volumeId: string, zonaId: string) => {
    // Remover o volume da zona
    setCarrinhoZonas(carrinhoZonas.map(zona => 
      zona.id === zonaId ? { 
        ...zona, 
        volumes: zona.volumes.filter((v: any) => v.id !== volumeId) 
      } : zona
    ));

    // Atualizar o status do volume
    setVolumes(volumes.map(v => 
      v.id === volumeId ? { ...v, posicionado: false } : v
    ));
  };

  return (
    <MainLayout title="Endereçamento no Caminhão">
      <div className="mb-6">
        <h2 className="text-2xl font-heading mb-2">Endereçamento no Caminhão</h2>
        <p className="text-gray-600">Organize o layout e posicionamento da carga no veículo</p>
      </div>
      
      <Tabs defaultValue="layout" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="layout">Layout do Carregamento</TabsTrigger>
          <TabsTrigger value="historico">Histórico de Layouts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="layout">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Truck className="mr-2 text-cross-blue" size={20} />
                  Selecionar Ordem de Carregamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <FormField
                          control={form.control}
                          name="numeroOC"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número da OC</FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input placeholder="Digite o número da OC" {...field} />
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
                          name="tipoVeiculo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo de Veículo</FormLabel>
                              <FormControl>
                                <select 
                                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2"
                                  {...field}
                                >
                                  <option value="">Selecione</option>
                                  <option value="truck">Caminhão Truck</option>
                                  <option value="toco">Caminhão Toco</option>
                                  <option value="carreta">Carreta</option>
                                  <option value="van">Van</option>
                                </select>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex items-end">
                        <Button type="submit" className="w-full bg-cross-blue hover:bg-cross-blue/90">
                          Carregar Informações
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
            
            {ordemSelecionada && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <Box className="mr-2 text-cross-blue" size={20} />
                          Volumes para Carregamento
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {volumes.map(volume => (
                            <div 
                              key={volume.id}
                              className={`p-3 border rounded-md ${volume.posicionado ? 'bg-gray-100' : 'hover:bg-gray-50'} ${volume.fragil ? 'border-amber-200' : ''}`}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center">
                                    <span className="font-medium">{volume.id}</span>
                                    {volume.fragil && (
                                      <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Frágil</span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600">{volume.descricao}</p>
                                  <p className="text-xs text-gray-500">Peso: {volume.peso}</p>
                                </div>
                                {!volume.posicionado && (
                                  <div className="flex">
                                    {carrinhoZonas.map(zona => (
                                      <Button 
                                        key={zona.id} 
                                        variant="ghost" 
                                        size="sm"
                                        className="text-xs"
                                        onClick={() => moverVolume(volume.id, zona.id)}
                                      >
                                        → {zona.nome}
                                      </Button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <Truck className="mr-2 text-cross-blue" size={20} />
                          Layout do Caminhão
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="border rounded-md p-4 bg-gray-50">
                          <div className="flex justify-between mb-4">
                            <div>
                              <span className="text-sm font-medium">OC: {ordemSelecionada}</span>
                            </div>
                            <div>
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {volumes.filter(v => v.posicionado).length} / {volumes.length} volumes posicionados
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-4">
                            <div className="relative border-2 border-gray-300 rounded-md h-[300px] flex">
                              <div className="absolute top-3 left-3 text-sm font-medium text-gray-500">Cabine</div>
                              
                              {carrinhoZonas.map(zona => (
                                <div 
                                  key={zona.id} 
                                  className={`flex-1 border-r last:border-r-0 border-gray-300 p-3 relative`}
                                >
                                  <div className="absolute top-0 right-2 text-xs text-gray-500">{zona.nome}</div>
                                  
                                  <div className="mt-6 flex flex-wrap gap-2 content-start min-h-[200px]">
                                    {zona.volumes.map((volume: any) => (
                                      <div 
                                        key={volume.id}
                                        className={`p-2 border text-xs rounded-md w-20 ${volume.fragil ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200'}`}
                                      >
                                        <div className="flex justify-between mb-1">
                                          <span className="font-medium">{volume.id}</span>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-4 w-4 p-0 text-gray-400 hover:text-red-500"
                                            onClick={() => removerVolume(volume.id, zona.id)}
                                          >
                                            ×
                                          </Button>
                                        </div>
                                        <p className="truncate">{volume.peso}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button 
                            className="bg-cross-blue hover:bg-cross-blue/90"
                            disabled={volumes.some(v => !v.posicionado)}
                          >
                            Salvar Layout
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="mt-4">
                      <CardHeader>
                        <CardTitle className="text-sm">Instruções de Carregamento</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-1 text-gray-600">
                          <li>• Volumes frágeis devem ser posicionados por último e no topo</li>
                          <li>• Volumes mais pesados devem ficar na parte inferior</li>
                          <li>• Volumes maiores devem ser carregados primeiro</li>
                          <li>• Verificar a distribuição de peso entre os eixos</li>
                          <li>• Respeitar a capacidade máxima de peso por zona</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="historico">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Histórico de Layouts</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={[
                  { header: 'OC', accessor: 'id' },
                  { header: 'Data', accessor: 'data' },
                  { header: 'Veículo', accessor: 'veiculo' },
                  { header: 'Volumes', accessor: 'volumes' },
                  { header: 'Responsável', accessor: 'responsavel' },
                  {
                    header: 'Ações',
                    cell: () => (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Visualizar</Button>
                        <Button variant="outline" size="sm">Imprimir</Button>
                      </div>
                    )
                  }
                ]}
                data={[
                  { id: 'OC-2023-001', data: '10/05/2023', veiculo: 'Caminhão Truck', volumes: 25, responsavel: 'João Silva' },
                  { id: 'OC-2023-002', data: '11/05/2023', veiculo: 'Van', volumes: 12, responsavel: 'Maria Oliveira' },
                  { id: 'OC-2023-003', data: '12/05/2023', veiculo: 'Carreta', volumes: 48, responsavel: 'Carlos Santos' },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default EnderecamentoCaminhao;
