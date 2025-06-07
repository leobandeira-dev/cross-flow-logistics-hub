
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useEnderecamentoVolumes } from '@/hooks/useEnderecamentoVolumes';
import PrintLayoutModal from '@/components/carregamento/enderecamento/PrintLayoutModal';
import ConfirmationDialog from '@/components/carregamento/enderecamento/ConfirmationDialog';
import SearchVolumeCard from '@/components/armazenagem/enderecamento/SearchVolumeCard';
import FoundVolumesCard from '@/components/armazenagem/enderecamento/FoundVolumesCard';
import EnderecosDisponiveisCard from '@/components/armazenagem/enderecamento/EnderecosDisponiveisCard';
import VolumesRecentesCard from '@/components/armazenagem/enderecamento/VolumesRecentesCard';
import MapaEnderecamentoCard from '@/components/armazenagem/enderecamento/MapaEnderecamentoCard';
import VolumePrintTemplate from '@/components/armazenagem/enderecamento/VolumePrintTemplate';

const Enderecamento: React.FC = () => {
  const {
    volumesParaEnderecar,
    volumesEndereçados,
    filteredVolumes,
    selectedVolumes,
    selectedEndereco,
    printModalOpen,
    selectedVolumeForPrint,
    confirmDialogOpen,
    searchTerm,
    searchType,
    volumeRef,
    enderecosDisponiveis,
    
    setSelectedVolumes,
    setSelectedEndereco,
    setPrintModalOpen,
    setConfirmDialogOpen,
    setSearchTerm,
    
    handlePrintClick,
    handleSearch,
    handleVolumeSelect,
    handleSearchTypeChange,
    handleConfirmEndereçamento
  } = useEnderecamentoVolumes();

  return (
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
              {/* Search Volume Card */}
              <SearchVolumeCard
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchType={searchType}
                handleSearchTypeChange={handleSearchTypeChange}
                handleSearch={handleSearch}
                selectedVolumes={selectedVolumes}
                handleVolumeSelect={handleVolumeSelect}
                selectedEndereco={selectedEndereco}
                setSelectedEndereco={setSelectedEndereco}
                confirmDialogOpen={confirmDialogOpen}
                setConfirmDialogOpen={setConfirmDialogOpen}
              />
              
              {/* Found Volumes Card */}
              <FoundVolumesCard
                filteredVolumes={filteredVolumes}
                selectedVolumes={selectedVolumes}
                handleVolumeSelect={handleVolumeSelect}
              />
            </div>
            
            <div className="lg:col-span-2">
              {/* Enderecos Disponiveis Card */}
              <EnderecosDisponiveisCard
                enderecosDisponiveis={enderecosDisponiveis}
                selectedEndereco={selectedEndereco}
                setSelectedEndereco={setSelectedEndereco}
              />
              
              {/* Volumes Recentes Card */}
              <VolumesRecentesCard
                volumesEndereçados={volumesEndereçados}
                handlePrintClick={handlePrintClick}
              />
            </div>
        </TabsContent>
        
        <TabsContent value="consultar">
          {/* Mapa Enderecamento Card */}
          <MapaEnderecamentoCard
            volumesEndereçados={volumesEndereçados}
            handlePrintClick={handlePrintClick}
          />
        </TabsContent>
      </Tabs>
      
      {/* Volume Print Template */}
      <VolumePrintTemplate
        volumeRef={volumeRef}
        selectedVolumeForPrint={selectedVolumeForPrint}
        volumesParaEnderecar={volumesParaEnderecar}
      />
      
      {/* Print Layout Modal */}
      <PrintLayoutModal
        open={printModalOpen}
        onOpenChange={setPrintModalOpen}
        orderNumber={selectedVolumeForPrint || ''}
        layoutRef={volumeRef}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog 
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={handleConfirmEndereçamento}
        title="Confirmar endereçamento"
        description={`Deseja endereçar ${selectedVolumes.length} volume(s) para o endereço ${selectedEndereco}?`}
      />
    </div>
  );
};

export default Enderecamento;
