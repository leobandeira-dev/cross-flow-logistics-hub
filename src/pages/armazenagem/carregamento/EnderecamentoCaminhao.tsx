
import React, { useState, useEffect } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Truck, Search, Box, Filter, PackageOpen, FileCog } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import SearchFilter from '@/components/common/SearchFilter';
import DataTable from '@/components/common/DataTable';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from "@/hooks/use-toast";

// Mock data for volumes
const volumesPorCarregar = [
  { id: 'VOL-001', descricao: 'Caixa 30x20x15', peso: '5kg', fragil: false, posicionado: false, etiquetaMae: 'ETQ-001', notaFiscal: 'NF-5522', fornecedor: 'Fornecedor A' },
  { id: 'VOL-002', descricao: 'Caixa 50x40x30', peso: '12kg', fragil: false, posicionado: false, etiquetaMae: 'ETQ-001', notaFiscal: 'NF-5522', fornecedor: 'Fornecedor A' },
  { id: 'VOL-003', descricao: 'Caixa 20x15x10', peso: '2kg', fragil: true, posicionado: false, etiquetaMae: 'ETQ-002', notaFiscal: 'NF-5523', fornecedor: 'Fornecedor B' },
  { id: 'VOL-004', descricao: 'Caixa 60x40x40', peso: '18kg', fragil: false, posicionado: false, etiquetaMae: 'ETQ-003', notaFiscal: 'NF-5524', fornecedor: 'Fornecedor C' },
  { id: 'VOL-005', descricao: 'Caixa 25x20x15', peso: '4kg', fragil: true, posicionado: false, etiquetaMae: 'ETQ-003', notaFiscal: 'NF-5524', fornecedor: 'Fornecedor C' },
  { id: 'VOL-006', descricao: 'Caixa 30x25x20', peso: '7kg', fragil: false, posicionado: false, etiquetaMae: 'ETQ-004', notaFiscal: 'NF-5525', fornecedor: 'Fornecedor D' },
  { id: 'VOL-007', descricao: 'Caixa 45x35x25', peso: '10kg', fragil: false, posicionado: false, etiquetaMae: 'ETQ-004', notaFiscal: 'NF-5525', fornecedor: 'Fornecedor D' },
  { id: 'VOL-008', descricao: 'Caixa 15x10x10', peso: '1kg', fragil: true, posicionado: false, etiquetaMae: 'ETQ-005', notaFiscal: 'NF-5526', fornecedor: 'Fornecedor E' },
];

// Tipos de pesquisa
type SearchType = 'volume' | 'etiquetaMae' | 'notaFiscal';

const EnderecamentoCaminhao: React.FC = () => {
  const form = useForm();
  const [ordemSelecionada, setOrdemSelecionada] = useState<string | null>(null);
  const [volumes, setVolumes] = useState(volumesPorCarregar);
  const [volumesFiltrados, setVolumesFiltrados] = useState(volumesPorCarregar);
  const [searchValue, setSearchValue] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('volume');
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  
  // Layout do caminhão - 3 colunas e até 20 linhas
  const [caminhaoLayout, setCaminhaoLayout] = useState<Array<{
    id: string;
    coluna: 'esquerda' | 'centro' | 'direita';
    linha: number;
    volumes: any[];
  }>>([]);

  // Inicializar layout do caminhão
  useEffect(() => {
    const novoLayout: any[] = [];
    const colunas: Array<'esquerda' | 'centro' | 'direita'> = ['esquerda', 'centro', 'direita'];
    
    for (let linha = 1; linha <= 20; linha++) {
      for (const coluna of colunas) {
        novoLayout.push({
          id: `${coluna}-${linha}`,
          coluna,
          linha,
          volumes: []
        });
      }
    }
    
    setCaminhaoLayout(novoLayout);
  }, []);

  const handleSubmit = (data: any) => {
    console.log('Form data submitted:', data);
    setOrdemSelecionada(data.numeroOC || 'OC-2023-001');
  };

  const filtrarVolumes = () => {
    if (!searchValue.trim()) {
      setVolumesFiltrados(volumes);
      return;
    }

    let filtrados;
    const searchTerm = searchValue.toLowerCase().trim();

    switch (searchType) {
      case 'volume':
        filtrados = volumes.filter(v => v.id.toLowerCase().includes(searchTerm));
        break;
      case 'etiquetaMae':
        filtrados = volumes.filter(v => v.etiquetaMae.toLowerCase().includes(searchTerm));
        break;
      case 'notaFiscal':
        filtrados = volumes.filter(v => v.notaFiscal.toLowerCase().includes(searchTerm));
        break;
      default:
        filtrados = volumes;
    }

    setVolumesFiltrados(filtrados);
    
    // Se encontramos volumes e estamos pesquisando por etiqueta mãe ou nota fiscal,
    // pré-selecione todos os volumes encontrados
    if (filtrados.length > 0 && searchType !== 'volume') {
      setSelecionados(filtrados.map(v => v.id));
    }
  };

  const toggleSelecao = (id: string) => {
    setSelecionados(prev => 
      prev.includes(id) 
        ? prev.filter(v => v !== id) 
        : [...prev, id]
    );
  };

  const selecionarTodos = () => {
    if (selecionados.length === volumesFiltrados.length) {
      setSelecionados([]);
    } else {
      setSelecionados(volumesFiltrados.map(v => v.id));
    }
  };

  const moverVolumesSelecionados = (celulaId: string) => {
    if (selecionados.length === 0) {
      toast({
        title: "Nenhum volume selecionado",
        description: "Selecione pelo menos um volume para alocar.",
      });
      return;
    }

    // Encontrar a célula
    const celula = caminhaoLayout.find(c => c.id === celulaId);
    if (!celula) return;

    // Volumes selecionados
    const volumesSelecionados = volumes.filter(v => selecionados.includes(v.id));

    // Atualizar o status dos volumes
    setVolumes(volumes.map(v => 
      selecionados.includes(v.id) ? { ...v, posicionado: true } : v
    ));

    // Adicionar volumes à célula
    setCaminhaoLayout(caminhaoLayout.map(c => 
      c.id === celulaId ? { ...c, volumes: [...c.volumes, ...volumesSelecionados] } : c
    ));

    // Limpar seleção
    setSelecionados([]);
    toast({
      title: "Volumes alocados",
      description: `${volumesSelecionados.length} volumes foram alocados com sucesso.`,
    });
  };

  const removerVolume = (volumeId: string, celulaId: string) => {
    // Remover o volume da célula
    setCaminhaoLayout(caminhaoLayout.map(c => 
      c.id === celulaId ? { 
        ...c, 
        volumes: c.volumes.filter((v: any) => v.id !== volumeId) 
      } : c
    ));

    // Atualizar o status do volume
    setVolumes(volumes.map(v => 
      v.id === volumeId ? { ...v, posicionado: false } : v
    ));

    toast({
      title: "Volume removido",
      description: `O volume ${volumeId} foi removido da célula ${celulaId}.`,
    });
  };

  // Agrupar o layout por linhas para exibição
  const layoutPorLinhas = Array.from({ length: 20 }, (_, i) => {
    const linha = i + 1;
    return {
      linha,
      celulas: caminhaoLayout.filter(c => c.linha === linha)
    };
  });

  // Contar volumes por nota fiscal
  const contarVolumesPorNF = (volumes: any[]) => {
    const notasCount: Record<string, { fornecedor: string, count: number }> = {};
    
    volumes.forEach(v => {
      if (!notasCount[v.notaFiscal]) {
        notasCount[v.notaFiscal] = { fornecedor: v.fornecedor, count: 0 };
      }
      notasCount[v.notaFiscal].count += 1;
    });

    return Object.entries(notasCount).map(([nf, info]) => ({
      nf,
      fornecedor: info.fornecedor,
      count: info.count
    }));
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
                    <Card className="mb-4">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <Filter className="mr-2 text-cross-blue" size={20} />
                          Filtrar Volumes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <FormLabel>Tipo de Pesquisa</FormLabel>
                            <div className="flex gap-2 mb-4">
                              <Button 
                                variant={searchType === 'volume' ? 'default' : 'outline'} 
                                size="sm"
                                onClick={() => setSearchType('volume')}
                                className={searchType === 'volume' ? 'bg-cross-blue hover:bg-cross-blue/90' : ''}
                              >
                                Volume
                              </Button>
                              <Button 
                                variant={searchType === 'etiquetaMae' ? 'default' : 'outline'} 
                                size="sm"
                                onClick={() => setSearchType('etiquetaMae')}
                                className={searchType === 'etiquetaMae' ? 'bg-cross-blue hover:bg-cross-blue/90' : ''}
                              >
                                Etiqueta Mãe
                              </Button>
                              <Button 
                                variant={searchType === 'notaFiscal' ? 'default' : 'outline'} 
                                size="sm"
                                onClick={() => setSearchType('notaFiscal')}
                                className={searchType === 'notaFiscal' ? 'bg-cross-blue hover:bg-cross-blue/90' : ''}
                              >
                                Nota Fiscal
                              </Button>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Input
                              placeholder={`Pesquisar por ${searchType === 'volume' ? 'volume' : searchType === 'etiquetaMae' ? 'etiqueta mãe' : 'nota fiscal'}`}
                              value={searchValue}
                              onChange={(e) => setSearchValue(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && filtrarVolumes()}
                            />
                            <Button 
                              onClick={filtrarVolumes}
                              className="bg-cross-blue hover:bg-cross-blue/90"
                            >
                              <Search size={18} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <Box className="mr-2 text-cross-blue" size={20} />
                          Volumes para Carregamento
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between mb-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={selecionarTodos}
                          >
                            {selecionados.length === volumesFiltrados.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                          </Button>
                          <span className="text-sm text-gray-500">
                            {selecionados.length} volumes selecionados
                          </span>
                        </div>

                        <div className="space-y-2 max-h-[400px] overflow-y-auto">
                          {volumesFiltrados.filter(v => !v.posicionado).map(volume => (
                            <div 
                              key={volume.id}
                              className={`p-3 border rounded-md cursor-pointer ${
                                selecionados.includes(volume.id) ? 'bg-blue-50 border-cross-blue' : 'hover:bg-gray-50'
                              } ${volume.fragil ? 'border-amber-200' : ''}`}
                              onClick={() => toggleSelecao(volume.id)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center">
                                    <input 
                                      type="checkbox" 
                                      checked={selecionados.includes(volume.id)} 
                                      onChange={() => toggleSelecao(volume.id)}
                                      className="mr-2" 
                                    />
                                    <span className="font-medium">{volume.id}</span>
                                    {volume.fragil && (
                                      <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Frágil</span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600">{volume.descricao}</p>
                                  <p className="text-xs text-gray-500">Peso: {volume.peso}</p>
                                  <div className="mt-1 text-xs flex flex-col">
                                    <span className="text-gray-600">Etiqueta: {volume.etiquetaMae}</span>
                                    <span className="text-gray-600">NF: {volume.notaFiscal}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}

                          {volumesFiltrados.filter(v => !v.posicionado).length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                              <p>Não há volumes disponíveis para carregamento.</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <Truck className="mr-2 text-cross-blue" size={20} />
                          Layout do Caminhão (Visão por Células)
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
                          
                          <div className="mb-2 overflow-x-auto">
                            {/* Cabeçalho */}
                            <div className="flex w-full min-w-[600px] mb-2 text-center font-medium border-b pb-2">
                              <div className="w-[50px]">Linha</div>
                              <div className="flex-1">Esquerda</div>
                              <div className="flex-1">Centro</div>
                              <div className="flex-1">Direita</div>
                            </div>

                            {/* Layout */}
                            <div className="max-h-[500px] overflow-y-auto">
                              {layoutPorLinhas.map(linha => (
                                <div key={linha.linha} className="flex w-full min-w-[600px] mb-1 border-b pb-1">
                                  <div className="w-[50px] flex items-center justify-center font-medium border-r">
                                    {linha.linha}
                                  </div>
                                  
                                  {linha.celulas.map(celula => {
                                    const volumesInfo = contarVolumesPorNF(celula.volumes);
                                    
                                    return (
                                      <div 
                                        key={celula.id} 
                                        className={`flex-1 border-r last:border-r-0 p-2 min-h-[80px] ${
                                          selecionados.length > 0 ? 'hover:bg-blue-50 cursor-pointer' : ''
                                        } ${celula.volumes.length > 0 ? 'bg-white' : ''}`}
                                        onClick={() => selecionados.length > 0 && moverVolumesSelecionados(celula.id)}
                                      >
                                        {volumesInfo.length > 0 ? (
                                          <div className="text-xs space-y-1">
                                            {volumesInfo.map((info, idx) => (
                                              <div key={idx} className="p-1 border rounded bg-white">
                                                <div className="font-medium">{info.nf}</div>
                                                <div className="text-gray-600 truncate">{info.fornecedor}</div>
                                                <div className="flex justify-between">
                                                  <span>{info.count} vol.</span>
                                                  <Button 
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-5 w-5 p-0 text-gray-400 hover:text-red-500"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      celula.volumes
                                                        .filter(v => v.notaFiscal === info.nf)
                                                        .forEach(v => removerVolume(v.id, celula.id));
                                                    }}
                                                  >
                                                    ×
                                                  </Button>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <div className="flex items-center justify-center h-full text-xs text-gray-400">
                                            {selecionados.length > 0 ? 'Clique para alocar' : 'Vazio'}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
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
                    accessor: 'actions',
                    cell: () => (
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
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

      {/* Diálogo de confirmação */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar ação</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja alocar estes volumes?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                setConfirmDialogOpen(false);
                // Adicionar lógica de confirmação aqui
              }}
              className="bg-cross-blue hover:bg-cross-blue/90"
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default EnderecamentoCaminhao;
