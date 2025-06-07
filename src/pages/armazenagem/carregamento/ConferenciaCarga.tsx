
import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import OrderDetailsForm from '@/components/carregamento/OrderDetailsForm';
import BarcodeScannerSection from '@/components/carregamento/BarcodeScannerSection';
import VolumesTable from '@/components/carregamento/VolumesTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

// Mock data for cargas
const itensParaConferencia = [
  { id: 'ITEM-001', produto: 'Produto A', quantidade: 5, verificado: false, etiquetaMae: 'ETQ-001', notaFiscal: 'NF-5566' },
  { id: 'ITEM-002', produto: 'Produto B', quantidade: 10, verificado: false, etiquetaMae: 'ETQ-001', notaFiscal: 'NF-5566' },
  { id: 'ITEM-003', produto: 'Produto C', quantidade: 3, verificado: false, etiquetaMae: 'ETQ-002', notaFiscal: 'NF-7788' },
  { id: 'ITEM-004', produto: 'Produto D', quantidade: 8, verificado: false, etiquetaMae: 'ETQ-002', notaFiscal: 'NF-7788' },
];

const cargasEmConferencia = [
  {
    id: 'OC-2023-002',
    cliente: 'Empresa XYZ',
    destinatario: 'Rio de Janeiro, RJ',
    dataCarregamento: '16/05/2023',
    volumesTotal: 18,
    volumesVerificados: 10,
    status: 'processing',
    inicioConferencia: '16/05/2023 09:30',
    conferenteResponsavel: 'João Silva'
  }
];

const cargasConferidas = [
  {
    id: 'OC-2023-003',
    cliente: 'Transportadora Rápida',
    destinatario: 'Curitiba, PR',
    dataCarregamento: '14/05/2023',
    volumesTotal: 12,
    volumesVerificados: 12,
    status: 'completed',
    inicioConferencia: '14/05/2023 14:15',
    fimConferencia: '14/05/2023 15:30',
    conferenteResponsavel: 'Maria Santos'
  }
];

// Mock volumes não relacionados para simulação
const volumesNaoRelacionados = [
  { id: 'ITEM-005', produto: 'Produto E', quantidade: 2, verificado: false, etiquetaMae: 'ETQ-003', notaFiscal: 'NF-9900' },
  { id: 'ITEM-006', produto: 'Produto F', quantidade: 7, verificado: false, etiquetaMae: 'ETQ-004', notaFiscal: 'NF-9901' },
];

const ConferenciaCarga: React.FC = () => {
  const [ordemSelecionada, setOrdemSelecionada] = useState<any | null>(null);
  const [itens, setItens] = useState(itensParaConferencia);
  const [codigoVolume, setCodigoVolume] = useState('');
  const [codigoNF, setCodigoNF] = useState('');
  const [codigoEtiquetaMae, setCodigoEtiquetaMae] = useState('');
  const [tabAtiva, setTabAtiva] = useState('conferir');
  
  // Estado para controlar o dialog de confirmação de adição de volume não relacionado
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [volumeNaoRelacionado, setVolumeNaoRelacionado] = useState<any | null>(null);

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
      status: 'processing',
      inicioConferencia: new Date().toLocaleString(),
      conferenteResponsavel: 'Carlos Ferreira'
    });
    setTabAtiva('conferir');
  };

  const handleVerificarItem = (id: string) => {
    setItens(itens.map(item => 
      item.id === id ? { ...item, verificado: true } : item
    ));
  };

  const handleRemoverItem = (id: string) => {
    setItens(itens.filter(item => item.id !== id));
  };

  const handleVerificarPorVolume = () => {
    if (!codigoVolume) return;
    
    // Verifica se o volume pertence à ordem atual
    const volumeExistente = itens.find(item => item.id === codigoVolume);
    
    if (volumeExistente) {
      // Se o volume existe, marca como verificado
      handleVerificarItem(codigoVolume);
    } else {
      // Se o volume não existe, simula encontrar um volume não relacionado
      const volumeNaoRelacionado = volumesNaoRelacionados.find(item => item.id === codigoVolume);
      
      if (volumeNaoRelacionado) {
        // Abre diálogo para confirmar adição
        setVolumeNaoRelacionado(volumeNaoRelacionado);
        setAlertDialogOpen(true);
      } else {
        toast({
          title: "Volume não encontrado",
          description: "O código informado não corresponde a nenhum volume registrado.",
          variant: "destructive"
        });
      }
    }
    
    setCodigoVolume('');
  };

  const handleVerificarPorNF = () => {
    if (!codigoNF) return;
    
    // Verifica se a nota fiscal pertence à ordem atual
    const itensNF = itens.filter(item => item.notaFiscal === codigoNF);
    
    if (itensNF.length > 0) {
      // Se encontrar itens com esta NF, marca todos como verificados
      setItens(itens.map(item => 
        item.notaFiscal === codigoNF ? { ...item, verificado: true } : item
      ));
      
      toast({
        title: "Conferência por Nota Fiscal",
        description: `${itensNF.length} volumes verificados com sucesso pela NF ${codigoNF}.`,
      });
    } else {
      // Se a NF não existe, simula encontrar uma NF não relacionada
      const volumesComNF = volumesNaoRelacionados.filter(item => item.notaFiscal === codigoNF);
      
      if (volumesComNF.length > 0) {
        // Abre diálogo para confirmar adição do primeiro volume encontrado
        setVolumeNaoRelacionado(volumesComNF[0]);
        setAlertDialogOpen(true);
      } else {
        toast({
          title: "Nota Fiscal não encontrada",
          description: "O código informado não corresponde a nenhuma NF registrada.",
          variant: "destructive"
        });
      }
    }
    
    setCodigoNF('');
  };

  const handleVerificarPorEtiquetaMae = () => {
    if (!codigoEtiquetaMae) return;
    
    // Verifica se a etiqueta mãe pertence à ordem atual
    const itensEtiqueta = itens.filter(item => item.etiquetaMae === codigoEtiquetaMae);
    
    if (itensEtiqueta.length > 0) {
      // Se encontrar itens com esta etiqueta, marca todos como verificados
      setItens(itens.map(item => 
        item.etiquetaMae === codigoEtiquetaMae ? { ...item, verificado: true } : item
      ));
      
      toast({
        title: "Conferência por Etiqueta Mãe",
        description: `${itensEtiqueta.length} volumes verificados com sucesso pela etiqueta ${codigoEtiquetaMae}.`,
      });
    } else {
      // Se a etiqueta não existe, simula encontrar uma etiqueta não relacionada
      const volumesComEtiqueta = volumesNaoRelacionados.filter(item => item.etiquetaMae === codigoEtiquetaMae);
      
      if (volumesComEtiqueta.length > 0) {
        // Abre diálogo para confirmar adição do primeiro volume encontrado
        setVolumeNaoRelacionado(volumesComEtiqueta[0]);
        setAlertDialogOpen(true);
      } else {
        toast({
          title: "Etiqueta não encontrada",
          description: "O código informado não corresponde a nenhuma etiqueta registrada.",
          variant: "destructive"
        });
      }
    }
    
    setCodigoEtiquetaMae('');
  };

  const adicionarVolumeNaoRelacionado = () => {
    if (volumeNaoRelacionado) {
      setItens([...itens, volumeNaoRelacionado]);
      
      toast({
        title: "Volume adicionado",
        description: `O volume ${volumeNaoRelacionado.id} foi adicionado à ordem de carregamento.`,
      });
      
      setAlertDialogOpen(false);
      setVolumeNaoRelacionado(null);
    }
  };

  const verificadosCount = itens.filter(i => i.verificado).length;
  const totalCount = itens.length;

  // Função para obter os dados com base na tab ativa
  const getOrdensParaTab = () => {
    switch(tabAtiva) {
      case 'conferir':
        return ordemSelecionada;
      case 'emConferencia':
        return cargasEmConferencia[0];
      case 'conferidas':
        return cargasConferidas[0];
      default:
        return null;
    }
  };

  const getItensParaTab = () => {
    switch(tabAtiva) {
      case 'conferir':
        return itens;
      case 'emConferencia':
        return itensParaConferencia.map(item => ({ ...item, verificado: Math.random() > 0.5 }));
      case 'conferidas':
        return itensParaConferencia.map(item => ({ ...item, verificado: true }));
      default:
        return [];
    }
  };

  return (
    <div className="mb-6">
        <h2 className="text-2xl font-heading mb-2">Conferência de Carga</h2>
        <p className="text-gray-600">Realize a conferência de itens para carregamento por volume, nota fiscal ou etiqueta mãe</p>
      </div>
      
      <Tabs defaultValue="conferir" value={tabAtiva} onValueChange={setTabAtiva} className="mb-6">
        <TabsList className="grid grid-cols-3 w-full max-w-lg">
          <TabsTrigger value="conferir">Cargas a Conferir</TabsTrigger>
          <TabsTrigger value="emConferencia">Em Conferência</TabsTrigger>
          <TabsTrigger value="conferidas">Cargas Conferidas</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <OrderDetailsForm 
            onSubmit={handleSubmit} 
            ordemSelecionada={getOrdensParaTab()}
          />
          
          {tabAtiva === 'conferir' && ordemSelecionada && (
            <div className="mt-4 border rounded-md p-4">
              <BarcodeScannerSection 
                codigoVolume={codigoVolume}
                setCodigoVolume={setCodigoVolume}
                codigoNF={codigoNF}
                setCodigoNF={setCodigoNF}
                codigoEtiquetaMae={codigoEtiquetaMae}
                setCodigoEtiquetaMae={setCodigoEtiquetaMae}
                handleVerificarPorVolume={handleVerificarPorVolume}
                handleVerificarPorNF={handleVerificarPorNF}
                handleVerificarPorEtiquetaMae={handleVerificarPorEtiquetaMae}
                verificadosCount={verificadosCount}
                totalCount={totalCount}
              />
            </div>
          )}
        </div>
        
        <div className="lg:col-span-2">
          <VolumesTable 
            ordemSelecionada={getOrdensParaTab()} 
            itens={getItensParaTab()}
            handleVerificarItem={handleVerificarItem}
            handleRemoverItem={tabAtiva === 'conferir' ? handleRemoverItem : undefined}
            tipoVisualizacao={tabAtiva as 'conferir' | 'emConferencia' | 'conferidas'}
          />
        </div>

      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Volume não relacionado</AlertDialogTitle>
            <AlertDialogDescription>
              {volumeNaoRelacionado && (
                <>
                  O {volumeNaoRelacionado.id} ({volumeNaoRelacionado.produto}) não está relacionado a esta ordem de carregamento.
                  <br /><br />
                  Deseja adicionar este item à ordem atual?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={adicionarVolumeNaoRelacionado} className="bg-cross-blue hover:bg-cross-blue/90">
              Adicionar à Ordem
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ConferenciaCarga;
