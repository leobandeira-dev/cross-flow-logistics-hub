import React from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Hooks
import { useEnderecamento } from '@/hooks/useEnderecamento';

// Components
import HistoricoLayout from '@/components/carregamento/enderecamento/HistoricoLayout';
import CarregamentoLayout from '@/components/carregamento/enderecamento/CarregamentoLayout';
import ConfirmationDialog from '@/components/carregamento/enderecamento/ConfirmationDialog';

const EnderecamentoCaminhao: React.FC = () => {
  const {
    ordemSelecionada,
    volumes,
    volumesFiltrados,
    selecionados,
    caminhaoLayout,
    confirmDialogOpen,
    setConfirmDialogOpen,
    handleOrderFormSubmit,
    filtrarVolumes,
    toggleSelecao,
    selecionarTodos,
    moverVolumesSelecionados,
    removerVolume,
    saveLayout,
    allVolumesPositioned
  } = useEnderecamento();
  
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
            allVolumesPositioned={allVolumesPositioned}
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
