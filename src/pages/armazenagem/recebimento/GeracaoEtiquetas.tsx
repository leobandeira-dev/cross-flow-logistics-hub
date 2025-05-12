
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '../../../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, Barcode, Printer, Search, Biohazard } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import SearchFilter from '@/components/common/SearchFilter';
import { toast } from '@/hooks/use-toast';
import { useEtiquetasGenerator } from '@/hooks/useEtiquetasGenerator';

// Mock data
const volumesParaEtiquetar = [
  { 
    id: 'VOL-2023-001', 
    notaFiscal: '12345', 
    descricao: 'Caixa 30x20x15', 
    quantidade: 10, 
    etiquetado: false,
    remetente: 'Empresa XYZ Ltda',
    destinatario: 'Cross Commerce - CD',
    endereco: 'Rua das Indústrias, 1000 - São Paulo/SP',
    cidade: 'SAO',
    uf: 'SP',
    pesoTotal: '25,5 Kg',
    tipoVolume: 'geral' as 'geral' | 'quimico'
  },
  { 
    id: 'VOL-2023-002', 
    notaFiscal: '12345', 
    descricao: 'Caixa 40x30x25', 
    quantidade: 5, 
    etiquetado: false,
    remetente: 'Empresa XYZ Ltda',
    destinatario: 'Cross Commerce - CD',
    endereco: 'Rua das Indústrias, 1000 - São Paulo/SP',
    cidade: 'SAO',
    uf: 'SP',
    pesoTotal: '25,5 Kg',
    tipoVolume: 'geral' as 'geral' | 'quimico'
  },
  { 
    id: 'VOL-2023-003', 
    notaFiscal: '12346', 
    descricao: 'Pacote 50x40', 
    quantidade: 20, 
    etiquetado: true,
    remetente: 'Distribuidora ABC S.A.',
    destinatario: 'Cross Commerce - Filial',
    endereco: 'Av. Principal, 500 - Rio de Janeiro/RJ',
    cidade: 'RIO',
    uf: 'RJ',
    pesoTotal: '12,3 Kg',
    tipoVolume: 'quimico' as 'geral' | 'quimico',
    codigoONU: '1203',
    codigoRisco: '33'
  },
];

const GeracaoEtiquetas: React.FC = () => {
  const location = useLocation();
  const notaFiscalData = location.state;
  
  const form = useForm({
    defaultValues: {
      notaFiscal: '',
      tipoEtiqueta: '',
      volumesTotal: '',
      formatoImpressao: '50x100',
      tipoVolume: 'geral',
      codigoONU: '',
      codigoRisco: ''
    }
  });
  
  const { generateEtiquetasPDF, isGenerating } = useEtiquetasGenerator();
  
  useEffect(() => {
    // If nota fiscal data is provided, pre-fill the form
    if (notaFiscalData?.notaFiscal) {
      form.setValue('notaFiscal', notaFiscalData.notaFiscal);
    }
  }, [notaFiscalData, form]);
  
  const handleSubmit = (data: any) => {
    console.log('Form data submitted:', data);
  };

  // Function to handle printing etiquetas for selected volumes
  const handlePrintEtiquetas = (volume: any) => {
    // Get volumes with the same nota fiscal
    const volumesNota = volumesParaEtiquetar.filter(vol => vol.notaFiscal === volume.notaFiscal);
    
    // Prepare nota data for the etiquetas
    const notaData = {
      fornecedor: volume.remetente,
      destinatario: volume.destinatario,
      endereco: volume.endereco,
      cidade: volume.cidade,
      uf: volume.uf,
      pesoTotal: volume.pesoTotal
    };
    
    // Get formato de impressão from form
    const formatoImpressao = form.getValues('formatoImpressao');
    
    // Generate etiquetas for all volumes of this nota fiscal
    generateEtiquetasPDF(volumesNota, notaData, formatoImpressao);
    
    // Mark the volume as etiquetado in our UI (for demonstration purposes)
    // In a real application, you would update this in the database
    toast({
      title: "Etiquetas Geradas",
      description: `Etiquetas para NF ${volume.notaFiscal} geradas com sucesso.`,
    });
  };

  // Function to handle printing etiquetas for all volumes
  const handleReimprimirEtiquetas = (volume: any) => {
    // For reimprimir, we generate etiquetas regardless of etiquetado status
    const volumesNota = volumesParaEtiquetar.filter(vol => vol.notaFiscal === volume.notaFiscal);
    
    const notaData = {
      fornecedor: volume.remetente,
      destinatario: volume.destinatario,
      endereco: volume.endereco,
      cidade: volume.cidade,
      uf: volume.uf,
      pesoTotal: volume.pesoTotal
    };
    
    // Get formato de impressão from form
    const formatoImpressao = form.getValues('formatoImpressao');
    
    generateEtiquetasPDF(volumesNota, notaData, formatoImpressao);
    
    toast({
      title: "Etiquetas Reimpressas",
      description: `Etiquetas para NF ${volume.notaFiscal} reimpressas com sucesso.`,
    });
  };

  // Show/hide chemical product fields based on type selection
  const watchTipoVolume = form.watch('tipoVolume');
  const isQuimico = watchTipoVolume === 'quimico';

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
                                    <option value="50x100">50x100 mm (Padrão)</option>
                                    <option value="a4">A4 Horizontal</option>
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
                            name="tipoVolume"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tipo de Volume</FormLabel>
                                <FormControl>
                                  <select 
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2"
                                    {...field}
                                  >
                                    <option value="geral">Carga Geral</option>
                                    <option value="quimico">Produto Químico</option>
                                  </select>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        {isQuimico && (
                          <div className="md:col-span-1 flex items-center gap-2">
                            <div className="flex-1">
                              <FormField
                                control={form.control}
                                name="codigoONU"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Código ONU</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Ex: 1203" {...field} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="flex-1">
                              <FormField
                                control={form.control}
                                name="codigoRisco"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Código de Risco</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Ex: 33" {...field} />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        )}
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
                      { 
                        header: 'Tipo', 
                        accessor: 'tipoVolume',
                        cell: (row) => {
                          return row.tipoVolume === 'quimico' ? 
                            <div className="flex items-center">
                              <Biohazard size={16} className="text-red-500 mr-1" />
                              <span>Químico</span>
                            </div> : 
                            <span>Carga Geral</span>;
                        }
                      },
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
                        accessor: 'actions',
                        cell: (row) => (
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={row.etiquetado}
                              onClick={() => handlePrintEtiquetas(row)}
                              className={`${!row.etiquetado ? 'bg-cross-blue text-white hover:bg-cross-blue/90' : ''}`}
                            >
                              <Printer size={16} className="mr-1" />
                              Imprimir
                            </Button>
                          </div>
                        )
                      }
                    ]}
                    // Filter the volumes based on the nota fiscal if one is provided
                    data={notaFiscalData?.notaFiscal 
                      ? volumesParaEtiquetar.filter(vol => vol.notaFiscal === notaFiscalData.notaFiscal)
                      : volumesParaEtiquetar
                    }
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
                  <div className="border rounded-md p-4 h-auto flex items-center justify-center">
                    <div className="text-center">
                      {isQuimico ? (
                        <div className="p-3 border-2 border-yellow-500 rounded-md bg-yellow-50">
                          <Biohazard size={40} className="mx-auto mb-2 text-red-500" />
                          <p className="font-bold text-red-500">PRODUTO QUÍMICO</p>
                          <p className="text-sm mt-2">ONU / Risco exibido na etiqueta</p>
                        </div>
                      ) : (
                        <>
                          <Barcode size={40} className="mx-auto mb-2 text-cross-blue" />
                          <p className="text-sm text-gray-500">Etiqueta para carga geral</p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Informações na Etiqueta</h3>
                    <ul className="text-sm space-y-1">
                      <li>• ID único do volume</li>
                      <li>• Número da nota fiscal</li>
                      <li>• Remetente / Destinatário</li>
                      <li>• Cidade (abreviada) / UF</li>
                      <li>• Tipo de volume (Geral / Químico)</li>
                      {isQuimico && (
                        <>
                          <li>• Código ONU</li>
                          <li>• Código de Risco</li>
                          <li>• Simbologia de Perigo</li>
                        </>
                      )}
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
                    name: "Tipo",
                    options: [
                      { label: "Carga Geral", value: "geral" },
                      { label: "Produto Químico", value: "quimico" }
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
                  { 
                    header: 'Tipo', 
                    accessor: 'tipoVolume',
                    cell: (row) => {
                      return row.tipoVolume === 'quimico' ? 
                        <div className="flex items-center">
                          <Biohazard size={16} className="text-red-500 mr-1" />
                          <span>Químico</span>
                        </div> : 
                        <span>Carga Geral</span>;
                    }
                  },
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
                    accessor: 'actions',
                    cell: (row) => (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <FileText size={16} className="mr-1" />
                          Detalhes
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReimprimirEtiquetas(row)}
                        >
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
