
import React, { useState, useEffect } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import OrderDetailsForm from '@/components/carregamento/OrderDetailsForm';
import BarcodeScannerSection from '@/components/carregamento/BarcodeScannerSection';
import VolumesTable from '@/components/carregamento/VolumesTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useConferenciaCargaReal } from '@/hooks/carregamento/useConferenciaCargaReal';

const ConferenciaCarga: React.FC = () => {
  const [codigoVolume, setCodigoVolume] = useState('');
  const [codigoNF, setCodigoNF] = useState('');
  const [codigoEtiquetaMae, setCodigoEtiquetaMae] = useState('');
  const [tabAtiva, setTabAtiva] = useState('conferir');
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);

  const {
    isLoading,
    ordemSelecionada,
    itensConferencia,
    ordensEmConferencia,
    ordensConferidas,
    buscarOrdemParaConferencia,
    verificarItemPorVolume,
    verificarItensPorNF,
    verificarItensPorEtiquetaMae,
    buscarOrdensEmConferencia,
    buscarOrdensConferidas,
    removerItemConferencia
  } = useConferenciaCargaReal();

  // Carregar dados quando a tab muda
  useEffect(() => {
    if (tabAtiva === 'emConferencia') {
      buscarOrdensEmConferencia();
    } else if (tabAtiva === 'conferidas') {
      buscarOrdensConferidas();
    }
  }, [tabAtiva, buscarOrdensEmConferencia, buscarOrdensConferidas]);

  const handleSubmit = (data: any) => {
    console.log('Form data submitted:', data);
    const numeroOC = data.numeroOC;
    
    if (numeroOC) {
      buscarOrdemParaConferencia(numeroOC);
      setTabAtiva('conferir');
    }
  };

  const handleVerificarItem = (id: string) => {
    // A verificação já é feita pelos métodos específicos
    // Esta função mantém compatibilidade com a interface existente
    console.log('Item verificado:', id);
  };

  const handleRemoverItem = (id: string) => {
    removerItemConferencia(id);
  };

  const handleVerificarPorVolume = async () => {
    if (!codigoVolume) return;
    
    const sucesso = await verificarItemPorVolume(codigoVolume);
    if (sucesso) {
      setCodigoVolume('');
    }
  };

  const handleVerificarPorNF = async () => {
    if (!codigoNF) return;
    
    const sucesso = await verificarItensPorNF(codigoNF);
    if (sucesso) {
      setCodigoNF('');
    }
  };

  const handleVerificarPorEtiquetaMae = async () => {
    if (!codigoEtiquetaMae) return;
    
    const sucesso = await verificarItensPorEtiquetaMae(codigoEtiquetaMae);
    if (sucesso) {
      setCodigoEtiquetaMae('');
    }
  };

  const verificadosCount = itensConferencia.filter(i => i.verificado).length;
  const totalCount = itensConferencia.length;

  // Função para obter os dados com base na tab ativa
  const getOrdensParaTab = () => {
    switch(tabAtiva) {
      case 'conferir':
        return ordemSelecionada;
      case 'emConferencia':
        return ordensEmConferencia[0] || null;
      case 'conferidas':
        return ordensConferidas[0] || null;
      default:
        return null;
    }
  };

  const getItensParaTab = () => {
    switch(tabAtiva) {
      case 'conferir':
        return itensConferencia;
      case 'emConferencia':
        // Para ordens em conferência, mostrar dados reais se disponível
        return itensConferencia.length > 0 ? itensConferencia : [];
      case 'conferidas':
        // Para ordens conferidas, mostrar dados reais se disponível
        return itensConferencia.length > 0 ? itensConferencia : [];
      default:
        return [];
    }
  };

  return (
    <MainLayout title="Conferência de Carga">
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
            loading={isLoading}
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
                loading={isLoading}
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
            loading={isLoading}
          />
        </div>
      </div>

      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Volume não relacionado</AlertDialogTitle>
            <AlertDialogDescription>
              O volume informado não está relacionado a esta ordem de carregamento.
              <br /><br />
              Deseja adicionar este item à ordem atual?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-cross-blue hover:bg-cross-blue/90">
              Adicionar à Ordem
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default ConferenciaCarga;
