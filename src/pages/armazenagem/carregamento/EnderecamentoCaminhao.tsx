
import React, { useState, useEffect } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from "@/hooks/use-toast";

// Import custom components
import HistoricoLayout from '@/components/carregamento/enderecamento/HistoricoLayout';
import CarregamentoLayout from '@/components/carregamento/enderecamento/CarregamentoLayout';
import ConfirmationDialog from '@/components/carregamento/enderecamento/ConfirmationDialog';

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
  const [ordemSelecionada, setOrdemSelecionada] = useState<string | null>(null);
  const [volumes, setVolumes] = useState(volumesPorCarregar);
  const [volumesFiltrados, setVolumesFiltrados] = useState(volumesPorCarregar);
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

  const handleOrderFormSubmit = (data: any) => {
    console.log('Form data submitted:', data);
    setOrdemSelecionada(data.numeroOC || 'OC-2023-001');
  };

  const filtrarVolumes = (searchValue: string, searchType: SearchType) => {
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
    if (selecionados.length === volumesFiltrados.filter(v => !v.posicionado).length) {
      setSelecionados([]);
    } else {
      setSelecionados(volumesFiltrados.filter(v => !v.posicionado).map(v => v.id));
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

  const saveLayout = () => {
    toast({
      title: "Layout salvo",
      description: "O layout de carregamento foi salvo com sucesso.",
    });
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
          <CarregamentoLayout 
            orderNumber={ordemSelecionada}
            volumes={volumes}
            volumesFiltrados={volumesFiltrados}
            selecionados={selecionados}
            caminhaoLayout={caminhaoLayout}
            onOrderFormSubmit={handleOrderFormSubmit}
            onFilter={filtrarVolumes}
            onSelectionToggle={toggleSelecao}
            onSelectAll={selecionarTodos}
            onCellClick={moverVolumesSelecionados}
            onRemoveVolume={removerVolume}
            onSaveLayout={saveLayout}
            hasSelectedVolumes={selecionados.length > 0}
            allVolumesPositioned={!volumes.some(v => !v.posicionado)}
          />
        </TabsContent>
        
        <TabsContent value="historico">
          <HistoricoLayout />
        </TabsContent>
      </Tabs>

      <ConfirmationDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={() => {
          // Adicionar lógica de confirmação aqui
          console.log('Confirmação realizada');
        }}
      />
    </MainLayout>
  );
};

export default EnderecamentoCaminhao;
