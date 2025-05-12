
import React, { useState, useRef, useEffect } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Archive, Package, Search, MapPin, Save, Printer } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import StatusBadge from '@/components/common/StatusBadge';
import PrintLayoutModal from '@/components/carregamento/enderecamento/PrintLayoutModal';
import { toast } from "@/hooks/use-toast";
import SearchFilter from '@/components/common/SearchFilter';
import ConfirmationDialog from '@/components/carregamento/enderecamento/ConfirmationDialog';

// Mock data
const initialVolumesParaEnderecar = [
  { id: 'VOL-2023-001', tipo: 'Volume', descricao: 'Caixa 30x20x15', notaFiscal: '12345', endereco: null, etiquetaMae: 'ETM-001' },
  { id: 'VOL-2023-002', tipo: 'Volume', descricao: 'Caixa 40x30x25', notaFiscal: '12345', endereco: null, etiquetaMae: 'ETM-001' },
  { id: 'VOL-2023-003', tipo: 'Volume', descricao: 'Caixa 10x10x10', notaFiscal: '54321', endereco: null, etiquetaMae: 'ETM-002' },
  { id: 'PAL-2023-001', tipo: 'Palete', descricao: 'Palete Standard', notaFiscal: 'Múltiplas', endereco: 'A-01-02-03', etiquetaMae: null },
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
  const [volumesParaEnderecar, setVolumesParaEnderecar] = useState(initialVolumesParaEnderecar);
  const [volumesEndereçados, setVolumesEndereçados] = useState<any[]>(initialVolumesParaEnderecar.filter(v => v.endereco !== null));
  const [filteredVolumes, setFilteredVolumes] = useState<any[]>(initialVolumesParaEnderecar.filter(v => v.endereco === null));
  const [selectedVolumes, setSelectedVolumes] = useState<any[]>([]);
  const [selectedEndereco, setSelectedEndereco] = useState<string | null>(null);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [selectedVolumeForPrint, setSelectedVolumeForPrint] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'id' | 'notaFiscal' | 'etiquetaMae'>('id');
  const volumeRef = useRef<HTMLDivElement>(null);
  
  const handlePrintClick = (volumeId: string) => {
    setSelectedVolumeForPrint(volumeId);
    setPrintModalOpen(true);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredVolumes(volumesParaEnderecar.filter(v => v.endereco === null));
      return;
    }

    const lowerTerm = term.toLowerCase();
    let filtered;
    
    switch (searchType) {
      case 'id':
        filtered = volumesParaEnderecar.filter(v => 
          v.endereco === null && v.id.toLowerCase().includes(lowerTerm)
        );
        break;
      case 'notaFiscal':
        filtered = volumesParaEnderecar.filter(v => 
          v.endereco === null && v.notaFiscal.toLowerCase().includes(lowerTerm)
        );
        break;
      case 'etiquetaMae':
        filtered = volumesParaEnderecar.filter(v => 
          v.endereco === null && v.etiquetaMae && v.etiquetaMae.toLowerCase().includes(lowerTerm)
        );
        break;
      default:
        filtered = volumesParaEnderecar.filter(v => v.endereco === null);
    }
    
    setFilteredVolumes(filtered);
    // Auto-select volumes for batch processing if searching by nota fiscal or etiqueta mãe
    if (searchType !== 'id' && filtered.length > 0) {
      setSelectedVolumes(filtered);
    }
  };

  const handleVolumeSelect = (volume: any) => {
    // Select or deselect a volume
    if (selectedVolumes.find(v => v.id === volume.id)) {
      setSelectedVolumes(selectedVolumes.filter(v => v.id !== volume.id));
    } else {
      setSelectedVolumes([...selectedVolumes, volume]);
    }
  };

  const handleConfirmEndereçamento = () => {
    if (!selectedEndereco || selectedVolumes.length === 0) return;

    // Update volumes with new endereco
    const updatedVolumes = volumesParaEnderecar.map(volume => {
      if (selectedVolumes.some(sv => sv.id === volume.id)) {
        return { ...volume, endereco: selectedEndereco };
      }
      return volume;
    });

    setVolumesParaEnderecar(updatedVolumes);
    
    // Update endereçados list
    const newlyEndereçados = selectedVolumes.map(sv => ({
      ...sv, endereco: selectedEndereco
    }));
    
    setVolumesEndereçados([...volumesEndereçados, ...newlyEndereçados]);
    
    // Update filtered list
    setFilteredVolumes(updatedVolumes.filter(v => v.endereco === null));
    
    // Clear selection
    setSelectedVolumes([]);
    setSelectedEndereco(null);
    form.reset();
    
    // Show success message
    toast({
      title: "Endereçamento salvo",
      description: `${selectedVolumes.length} volume(s) endereçado(s) com sucesso em ${selectedEndereco}`,
    });
  };

  const handleSearchTypeChange = (type: 'id' | 'notaFiscal' | 'etiquetaMae') => {
    setSearchType(type);
    if (searchTerm) {
      handleSearch(searchTerm); // Re-run search with new type
    }
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
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Package className="mr-2 text-cross-blue" size={20} />
                    Buscar Volume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form className="space-y-4">
                      <div>
                        <div className="mb-4">
                          <FormLabel>Critério de busca</FormLabel>
                          <div className="flex gap-2 mb-4">
                            <Button 
                              variant={searchType === 'id' ? 'default' : 'outline'} 
                              size="sm"
                              onClick={() => handleSearchTypeChange('id')}
                              className={searchType === 'id' ? 'bg-cross-blue hover:bg-cross-blue/90' : ''}
                            >
                              ID Volume
                            </Button>
                            <Button 
                              variant={searchType === 'notaFiscal' ? 'default' : 'outline'} 
                              size="sm"
                              onClick={() => handleSearchTypeChange('notaFiscal')}
                              className={searchType === 'notaFiscal' ? 'bg-cross-blue hover:bg-cross-blue/90' : ''}
                            >
                              Nota Fiscal
                            </Button>
                            <Button 
                              variant={searchType === 'etiquetaMae' ? 'default' : 'outline'} 
                              size="sm"
                              onClick={() => handleSearchTypeChange('etiquetaMae')}
                              className={searchType === 'etiquetaMae' ? 'bg-cross-blue hover:bg-cross-blue/90' : ''}
                            >
                              Etiqueta Mãe
                            </Button>
                          </div>
                        </div>
                        <FormField
                          control={form.control}
                          name="idVolume"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {searchType === 'id' ? 'ID do Volume' : 
                                 searchType === 'notaFiscal' ? 'Número da Nota Fiscal' : 
                                 'Código da Etiqueta Mãe'}
                              </FormLabel>
                              <div className="relative">
                                <FormControl>
                                  <Input 
                                    placeholder={`Digite o ${searchType === 'id' ? 'código do volume' : 
                                                        searchType === 'notaFiscal' ? 'número da nota fiscal' : 
                                                        'código da etiqueta mãe'}`} 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
                                  />
                                </FormControl>
                                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button 
                        type="button" 
                        className="w-full bg-cross-blue hover:bg-cross-blue/90"
                        onClick={() => handleSearch(searchTerm)}
                      >
                        Buscar
                      </Button>
                    </form>
                  </Form>
                  
                  {selectedVolumes.length > 0 && (
                    <div className="mt-4 border rounded-md p-4">
                      <h3 className="font-medium mb-2">Volumes selecionados ({selectedVolumes.length})</h3>
                      <div className="max-h-32 overflow-y-auto">
                        {selectedVolumes.map(volume => (
                          <div key={volume.id} className="flex justify-between items-center py-1 border-b last:border-0">
                            <span className="text-sm">{volume.id}</span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleVolumeSelect(volume)}
                            >
                              Remover
                            </Button>
                          </div>
                        ))}
                      </div>
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
                      disabled={selectedVolumes.length === 0 || !selectedEndereco}
                      onClick={() => setConfirmDialogOpen(true)}
                    >
                      <Save size={16} className="mr-2" />
                      Salvar Endereçamento
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Volumes Encontrados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {filteredVolumes.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">Nenhum volume encontrado</p>
                    ) : (
                      filteredVolumes.map(volume => (
                        <div 
                          key={volume.id}
                          className={`p-3 border rounded-md cursor-pointer ${
                            selectedVolumes.some(v => v.id === volume.id) ? 'bg-blue-50 border-cross-blue' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handleVolumeSelect(volume)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <input 
                                  type="checkbox" 
                                  checked={selectedVolumes.some(v => v.id === volume.id)} 
                                  onChange={() => handleVolumeSelect(volume)}
                                  className="mr-2" 
                                />
                                <span className="font-medium">{volume.id}</span>
                              </div>
                              <p className="text-sm text-gray-600">{volume.descricao}</p>
                              <p className="text-xs text-gray-500">NF: {volume.notaFiscal}</p>
                              {volume.etiquetaMae && (
                                <p className="text-xs text-gray-500">Etiqueta Mãe: {volume.etiquetaMae}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
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
                        accessor: 'actions',
                        cell: (row) => (
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                if (row.endereco === null) {
                                  const volume = volumesParaEnderecar.find(v => v.id === row.id);
                                  if (volume) {
                                    setSelectedVolumes([volume]);
                                  }
                                }
                              }}
                              disabled={row.endereco !== null}
                            >
                              Selecionar
                            </Button>
                            {row.endereco && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handlePrintClick(row.id)}
                              >
                                <Printer className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        )
                      }
                    ]}
                    data={volumesEndereçados}
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
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Volumes Endereçados</h3>
                <DataTable
                  columns={[
                    { header: 'ID', accessor: 'id' },
                    { header: 'Tipo', accessor: 'tipo' },
                    { header: 'Descrição', accessor: 'descricao' },
                    { header: 'Nota Fiscal', accessor: 'notaFiscal' },
                    { header: 'Endereço', accessor: 'endereco' },
                    {
                      header: 'Ações',
                      accessor: 'actions',
                      cell: (row) => (
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePrintClick(row.id)}
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    }
                  ]}
                  data={volumesEndereçados}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Div oculto que servirá como template para impressão do volume */}
      <div className="hidden">
        <div ref={volumeRef} className="p-4 bg-white">
          <h2 className="text-xl font-bold mb-4">Informações de Endereçamento - Volume {selectedVolumeForPrint}</h2>
          <div className="border p-4">
            {selectedVolumeForPrint && volumesParaEnderecar.find(vol => vol.id === selectedVolumeForPrint) && (
              <>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">ID do Volume:</p>
                    <p className="font-bold">{selectedVolumeForPrint}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tipo:</p>
                    <p>{volumesParaEnderecar.find(vol => vol.id === selectedVolumeForPrint)?.tipo}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Descrição:</p>
                    <p>{volumesParaEnderecar.find(vol => vol.id === selectedVolumeForPrint)?.descricao}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nota Fiscal:</p>
                    <p>{volumesParaEnderecar.find(vol => vol.id === selectedVolumeForPrint)?.notaFiscal}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-lg font-medium">Endereço:</p>
                    <p className="text-xl font-bold">{volumesParaEnderecar.find(vol => vol.id === selectedVolumeForPrint)?.endereco || "Não endereçado"}</p>
                  </div>
                  
                  <div className="mt-8 border-t pt-4">
                    <p className="text-xs text-gray-500">Data de impressão: {new Date().toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">Hora: {new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      <PrintLayoutModal
        open={printModalOpen}
        onOpenChange={setPrintModalOpen}
        orderNumber={selectedVolumeForPrint || ''}
        layoutRef={volumeRef}
      />

      <ConfirmationDialog 
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={handleConfirmEndereçamento}
        title="Confirmar endereçamento"
        description={`Deseja endereçar ${selectedVolumes.length} volume(s) para o endereço ${selectedEndereco}?`}
      />
    </MainLayout>
  );
};

export default Enderecamento;
