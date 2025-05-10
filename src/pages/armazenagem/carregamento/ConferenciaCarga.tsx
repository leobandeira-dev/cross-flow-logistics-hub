import React, { useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { FileText, Barcode, CheckCircle, Search, Eye } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';

// Mock data
const itensParaConferencia = [
  { id: 'ITEM-001', produto: 'Produto A', quantidade: 5, verificado: false },
  { id: 'ITEM-002', produto: 'Produto B', quantidade: 10, verificado: false },
  { id: 'ITEM-003', produto: 'Produto C', quantidade: 3, verificado: false },
  { id: 'ITEM-004', produto: 'Produto D', quantidade: 8, verificado: false },
];

interface OrdemCarregamento {
  id: string;
  cliente: string;
  destinatario: string;
  dataCarregamento: string;
  volumesTotal: number;
  volumesVerificados: number;
  status: 'pending' | 'processing' | 'completed';
}

const ConferenciaCarga: React.FC = () => {
  const form = useForm();
  const [ordemSelecionada, setOrdemSelecionada] = useState<OrdemCarregamento | null>(null);
  const [itens, setItens] = useState(itensParaConferencia);
  
  const handleSubmit = (data: any) => {
    console.log('Form data submitted:', data);
    // Simulando busca de OC
    setOrdemSelecionada({
      id: data.numeroOC || 'OC-2023-001',
      cliente: 'Distribuidor ABC',
      destinatario: 'São Paulo, SP',
      dataCarregamento: '15/05/2023',
      volumesTotal: 26,
      volumesVerificados: 0,
      status: 'processing'
    });
  };

  const handleVerificarItem = (id: string) => {
    setItens(itens.map(item => 
      item.id === id ? { ...item, verificado: true } : item
    ));
  };

  const handleDigitarCodigo = () => {
    // Simula leitura de código de barras
    const naoVerificados = itens.filter(item => !item.verificado);
    if (naoVerificados.length > 0) {
      handleVerificarItem(naoVerificados[0].id);
    }
  };

  return (
    <MainLayout title="Conferência de Carga">
      <div className="mb-6">
        <h2 className="text-2xl font-heading mb-2">Conferência de Carga</h2>
        <p className="text-gray-600">Realize a conferência de itens para carregamento por volume, nota fiscal ou etiqueta mãe</p>
      </div>
      
      <Tabs defaultValue="porVolume" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="porVolume">Por Volume</TabsTrigger>
          <TabsTrigger value="porNF">Por Nota Fiscal</TabsTrigger>
          <TabsTrigger value="porEtiqueta">Por Etiqueta Mãe</TabsTrigger>
        </TabsList>
        
        <TabsContent value="porVolume">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="mr-2 text-cross-blue" size={20} />
                    Ordem de Carregamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                      
                      <Button type="submit" className="w-full bg-cross-blue hover:bg-cross-blue/90">
                        Buscar
                      </Button>
                    </form>
                  </Form>
                  
                  {ordemSelecionada && (
                    <div className="mt-4 border rounded-md p-4">
                      <h3 className="font-medium mb-2">Detalhes da Ordem</h3>
                      <dl className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-gray-500">OC:</dt>
                          <dd>{ordemSelecionada.id}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Cliente:</dt>
                          <dd>{ordemSelecionada.cliente}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Destinatário:</dt>
                          <dd>{ordemSelecionada.destinatario}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Data:</dt>
                          <dd>{ordemSelecionada.dataCarregamento}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Volumes:</dt>
                          <dd>{ordemSelecionada.volumesVerificados} / {ordemSelecionada.volumesTotal}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-500">Status:</dt>
                          <dd>
                            <StatusBadge 
                              status={
                                ordemSelecionada.status === 'pending' ? 'warning' : 
                                ordemSelecionada.status === 'processing' ? 'info' : 'success'
                              } 
                              text={
                                ordemSelecionada.status === 'pending' ? 'Pendente' : 
                                ordemSelecionada.status === 'processing' ? 'Em Conferência' : 'Concluído'
                              } 
                            />
                          </dd>
                        </div>
                      </dl>
                      
                      <div className="mt-4 pt-4 border-t">
                        <h3 className="font-medium mb-2">Leitura de Código</h3>
                        <div className="flex gap-2">
                          <Input placeholder="Escaneie ou digite o código" className="flex-1" />
                          <Button 
                            variant="outline" 
                            onClick={handleDigitarCodigo}
                            className="bg-cross-blue text-white hover:bg-cross-blue/90"
                          >
                            <Barcode size={16} className="mr-2" />
                            Ler
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">Progresso</h3>
                          <span className="text-sm">
                            {itens.filter(i => i.verificado).length} / {itens.length}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-cross-blue h-2.5 rounded-full" 
                            style={{ width: `${(itens.filter(i => i.verificado).length / itens.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <CheckCircle className="mr-2 text-cross-blue" size={20} />
                    Volumes para Conferência
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {ordemSelecionada ? (
                    <DataTable
                      columns={[
                        { header: 'ID', accessor: 'id' },
                        { header: 'Produto', accessor: 'produto' },
                        { header: 'Qtd', accessor: 'quantidade' },
                        { 
                          header: 'Status', 
                          accessor: 'verificado',
                          cell: (row) => {
                            return row.verificado ? 
                              <StatusBadge status="success" text="Verificado" /> : 
                              <StatusBadge status="warning" text="Pendente" />;
                          }
                        },
                        {
                          header: 'Ações',
                          accessor: 'actions', // Add this line
                          cell: (row) => (
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye size={16} className="mr-1" />
                                Detalhes
                              </Button>
                              {!row.verificado && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="bg-cross-blue text-white hover:bg-cross-blue/90"
                                  onClick={() => handleVerificarItem(row.id)}
                                >
                                  <CheckCircle size={16} className="mr-1" />
                                  Verificar
                                </Button>
                              )}
                            </div>
                          )
                        }
                      ]}
                      data={itens}
                    />
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText size={40} className="mx-auto mb-4 opacity-30" />
                      <p>Selecione uma ordem de carregamento para iniciar a conferência</p>
                    </div>
                  )}
                  
                  {ordemSelecionada && (
                    <div className="flex justify-end mt-4">
                      <Button 
                        className="bg-cross-blue hover:bg-cross-blue/90"
                        disabled={itens.some(item => !item.verificado)}
                      >
                        Finalizar Conferência
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="porNF">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conferência por Nota Fiscal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-gray-500">
                A conferência por nota fiscal permite verificar todos os volumes associados a uma mesma nota.
                <br />
                Selecione o modo de conferência acima para continuar.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="porEtiqueta">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conferência por Etiqueta Mãe</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-gray-500">
                A conferência por etiqueta mãe permite verificar grupos de volumes que foram unitizados.
                <br />
                Selecione o modo de conferência acima para continuar.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default ConferenciaCarga;
