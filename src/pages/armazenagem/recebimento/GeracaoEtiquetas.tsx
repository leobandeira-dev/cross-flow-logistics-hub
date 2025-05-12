
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '../../../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, Barcode, Printer, Search, Biohazard, QrCode } from 'lucide-react';
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
    cidadeCompleta: 'São Paulo',
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
    cidadeCompleta: 'São Paulo',
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
    cidadeCompleta: 'Rio de Janeiro',
    uf: 'RJ',
    pesoTotal: '12,3 Kg',
    tipoVolume: 'quimico' as 'geral' | 'quimico',
    codigoONU: '1203',
    codigoRisco: '33'
  },
];

// Mock data for master labels
const etiquetasMae = [
  {
    id: 'MASTER-001',
    notaFiscal: '12345',
    quantidadeVolumes: 15,
    remetente: 'Empresa XYZ Ltda',
    destinatario: 'Cross Commerce - CD',
    cidade: 'São Paulo',
    uf: 'SP',
    dataCriacao: '2023-10-25',
    status: 'ativo'
  },
  {
    id: 'MASTER-002',
    notaFiscal: '12346',
    quantidadeVolumes: 20,
    remetente: 'Distribuidora ABC S.A.',
    destinatario: 'Cross Commerce - Filial',
    cidade: 'Rio de Janeiro',
    uf: 'RJ',
    dataCriacao: '2023-10-24',
    status: 'ativo'
  }
];

const GeracaoEtiquetas: React.FC = () => {
  const location = useLocation();
  const notaFiscalData = location.state;
  const [activeTab, setActiveTab] = useState('gerar');
  const [tipoEtiqueta, setTipoEtiqueta] = useState<'volume' | 'mae'>('volume');
  
  const form = useForm({
    defaultValues: {
      notaFiscal: '',
      tipoEtiqueta: 'volume',
      volumesTotal: '',
      formatoImpressao: '50x100',
      tipoVolume: 'geral',
      codigoONU: '',
      codigoRisco: '',
      etiquetaMaeId: ''
    }
  });
  
  const { generateEtiquetasPDF, generateEtiquetaMaePDF, isGenerating } = useEtiquetasGenerator();
  
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
      cidadeCompleta: volume.cidadeCompleta,
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
      cidadeCompleta: volume.cidadeCompleta,
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
  
  // Function to handle printing master etiqueta
  const handlePrintEtiquetaMae = (etiquetaMae: any) => {
    // Get volumes with the same nota fiscal
    const volumesNota = volumesParaEtiquetar.filter(vol => vol.notaFiscal === etiquetaMae.notaFiscal);
    
    if (volumesNota.length === 0) {
      toast({
        title: "Erro",
        description: "Nenhum volume encontrado para esta etiqueta mãe.",
        variant: "destructive"
      });
      return;
    }
    
    // Prepare nota data
    const notaData = {
      fornecedor: volumesNota[0].remetente,
      destinatario: volumesNota[0].destinatario,
      endereco: volumesNota[0].endereco,
      cidade: volumesNota[0].cidade,
      cidadeCompleta: volumesNota[0].cidadeCompleta,
      uf: volumesNota[0].uf,
      pesoTotal: volumesNota[0].pesoTotal
    };
    
    // Get formato de impressão from form
    const formatoImpressao = form.getValues('formatoImpressao');
    
    // Generate master etiqueta
    generateEtiquetaMaePDF(volumesNota, notaData, formatoImpressao, etiquetaMae.id);
    
    toast({
      title: "Etiqueta Mãe Gerada",
      description: `Etiqueta mãe para NF ${etiquetaMae.notaFiscal} gerada com sucesso.`,
    });
  };
  
  // Function to create a new master etiqueta
  const handleCreateEtiquetaMae = () => {
    const notaFiscal = form.getValues('notaFiscal');
    const etiquetaMaeId = form.getValues('etiquetaMaeId') || `MASTER-${notaFiscal}-${Date.now()}`;
    
    const volumesNota = volumesParaEtiquetar.filter(vol => vol.notaFiscal === notaFiscal);
    
    if (volumesNota.length === 0) {
      toast({
        title: "Erro",
        description: "Nenhum volume encontrado para esta nota fiscal.",
        variant: "destructive"
      });
      return;
    }
    
    // Prepare nota data
    const notaData = {
      fornecedor: volumesNota[0].remetente,
      destinatario: volumesNota[0].destinatario,
      endereco: volumesNota[0].endereco,
      cidade: volumesNota[0].cidade,
      cidadeCompleta: volumesNota[0].cidadeCompleta,
      uf: volumesNota[0].uf,
      pesoTotal: volumesNota[0].pesoTotal
    };
    
    // Get formato de impressão from form
    const formatoImpressao = form.getValues('formatoImpressao');
    
    // Generate master etiqueta
    generateEtiquetaMaePDF(volumesNota, notaData, formatoImpressao, etiquetaMaeId);
    
    // Here you would normally save the new master etiqueta to the database
    
    toast({
      title: "Etiqueta Mãe Criada",
      description: `Nova etiqueta mãe para NF ${notaFiscal} criada com sucesso.`,
    });
  };

  // Show/hide chemical product fields based on type selection
  const watchTipoVolume = form.watch('tipoVolume');
  const isQuimico = watchTipoVolume === 'quimico';

  return (
    <MainLayout title="Geração de Etiquetas">
      <div className="mb-6">
        <h2 className="text-2xl font-heading mb-2">Geração de Etiquetas por Volume</h2>
        <p className="text-gray-600">Gere etiquetas de identificação única para cada volume ou etiquetas mãe para agrupamento</p>
      </div>
      
      <Tabs defaultValue="gerar" className="mb-6" onValueChange={(value) => setActiveTab(value)}>
        <TabsList className="mb-4">
          <TabsTrigger value="gerar">Gerar Etiquetas</TabsTrigger>
          <TabsTrigger value="consultar">Consultar Etiquetas</TabsTrigger>
          <TabsTrigger value="etiquetasMae">Etiquetas Mãe</TabsTrigger>
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
                                    onChange={(e) => {
                                      field.onChange(e);
                                      setTipoEtiqueta(e.target.value as 'volume' | 'mae');
                                    }}
                                  >
                                    <option value="volume">Etiqueta de Volume</option>
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
                      
                      {tipoEtiqueta === 'mae' && (
                        <div>
                          <FormField
                            control={form.control}
                            name="etiquetaMaeId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>ID Etiqueta Mãe (opcional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="ID personalizado ou deixe em branco para gerar automaticamente" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                      
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline">Cancelar</Button>
                        <Button 
                          type="button" 
                          className="bg-cross-blue hover:bg-cross-blue/90"
                          onClick={tipoEtiqueta === 'mae' ? handleCreateEtiquetaMae : undefined}
                        >
                          {tipoEtiqueta === 'mae' ? (
                            <>
                              <QrCode size={16} className="mr-2" />
                              Gerar Etiqueta Mãe
                            </>
                          ) : (
                            <>
                              <Barcode size={16} className="mr-2" />
                              Gerar Etiquetas de Volume
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              {activeTab === 'gerar' && (
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
              )}
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Modelo de Etiqueta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md p-4 h-auto flex items-center justify-center">
                    <div className="text-center">
                      {tipoEtiqueta === 'mae' ? (
                        <div className="p-3 border-2 border-red-500 rounded-md bg-red-50">
                          <QrCode size={40} className="mx-auto mb-2 text-red-600" />
                          <p className="font-bold text-red-600">ETIQUETA MÃE</p>
                          <p className="text-sm mt-2">Agrupa múltiplos volumes</p>
                        </div>
                      ) : isQuimico ? (
                        <div className="p-3 border-2 border-yellow-500 rounded-md bg-yellow-50">
                          <Biohazard size={40} className="mx-auto mb-2 text-red-500" />
                          <p className="font-bold text-red-500">PRODUTO QUÍMICO</p>
                          <p className="text-sm mt-2">ONU / Risco exibido na etiqueta</p>
                        </div>
                      ) : (
                        <div className="p-3 border-2 border-blue-500 rounded-md bg-blue-50">
                          <QrCode size={40} className="mx-auto mb-2 text-blue-600" />
                          <p className="font-bold text-blue-600">ETIQUETA DE VOLUME</p>
                          <p className="text-sm mt-2">Com QR code e ID único</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Informações na Etiqueta</h3>
                    <ul className="text-sm space-y-1">
                      {tipoEtiqueta === 'mae' ? (
                        <>
                          <li>• ID único da etiqueta mãe</li>
                          <li>• QR Code de identificação</li>
                          <li>• Número da nota fiscal</li>
                          <li>• Quantidade total de volumes</li>
                          <li>• Remetente / Destinatário</li>
                          <li>• Cidade completa / UF</li>
                        </>
                      ) : (
                        <>
                          <li>• ID único do volume com QR Code</li>
                          <li>• Número da nota fiscal</li>
                          <li>• Numeração sequencial (X/Y)</li>
                          <li>• Remetente / Destinatário</li>
                          <li>• Cidade completa / UF</li>
                          <li>• Tipo de volume (Geral / Químico)</li>
                          {isQuimico && (
                            <>
                              <li>• Código ONU</li>
                              <li>• Código de Risco</li>
                              <li>• Simbologia de Perigo</li>
                            </>
                          )}
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
        
        <TabsContent value="etiquetasMae">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Etiquetas Mãe</CardTitle>
            </CardHeader>
            <CardContent>
              <SearchFilter 
                placeholder="Buscar por ID, nota fiscal ou remetente..." 
                filters={[
                  {
                    name: "Status",
                    options: [
                      { label: "Ativo", value: "ativo" },
                      { label: "Inativo", value: "inativo" }
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
                  { header: 'Volumes', accessor: 'quantidadeVolumes' },
                  { header: 'Remetente', accessor: 'remetente' },
                  { header: 'Destinatário', accessor: 'destinatario' },
                  { header: 'Cidade/UF', accessor: 'cidade',
                    cell: (row) => (
                      <div>
                        {row.cidade} - <span className="font-bold">{row.uf}</span>
                      </div>
                    )
                  },
                  { header: 'Data Criação', accessor: 'dataCriacao' },
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
                          onClick={() => handlePrintEtiquetaMae(row)}
                        >
                          <Printer size={16} className="mr-1" />
                          Imprimir
                        </Button>
                      </div>
                    )
                  }
                ]}
                data={etiquetasMae}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default GeracaoEtiquetas;
