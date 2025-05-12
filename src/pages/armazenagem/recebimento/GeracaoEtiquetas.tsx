
import React, { useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { volumesParaEtiquetar, etiquetasMae } from './components/etiquetas/mockData';

// Import refactored components
import GerarEtiquetasTab from './components/etiquetas/GerarEtiquetasTab';
import FormInitializer from './components/etiquetas/FormInitializer';
import ConsultaEtiquetasTab from './components/etiquetas/ConsultaEtiquetasTab';
import EtiquetasMaeTab from './components/etiquetas/EtiquetasMaeTab';
import ClassifyVolumeDialog from './components/etiquetas/ClassifyVolumeDialog';
import { useGeracaoEtiquetas } from './hooks/useGeracaoEtiquetas';

const GeracaoEtiquetas: React.FC = () => {
  const [activeTab, setActiveTab] = useState('gerar');
  
  const {
    form,
    notaFiscalData,
    tipoEtiqueta,
    generatedVolumes,
    volumes,
    classifyDialogOpen,
    selectedVolume,
    setClassifyDialogOpen,
    handleGenerateVolumes,
    handlePrintEtiquetas,
    handleReimprimirEtiquetas,
    handlePrintEtiquetaMae,
    handleCreateEtiquetaMae,
    handleClassifyVolume,
    handleSaveVolumeClassification,
    handleVincularVolumes
  } = useGeracaoEtiquetas();

  return (
    <MainLayout title="Geração de Etiquetas">
      <div className="mb-6">
        <h2 className="text-2xl font-heading mb-2">Geração de Etiquetas por Volume</h2>
        <p className="text-gray-600">Gere etiquetas de identificação única para cada volume ou etiquetas mãe para agrupamento</p>
      </div>
      
      {/* Use the FormInitializer to handle form data initialization */}
      <FormInitializer 
        form={form} 
        notaFiscalData={notaFiscalData}
        onInitialized={handleGenerateVolumes}
      />
      
      <Tabs defaultValue="gerar" className="mb-6" onValueChange={(value) => setActiveTab(value)}>
        <TabsList className="mb-4">
          <TabsTrigger value="gerar">Etiquetas Volumes</TabsTrigger>
          <TabsTrigger value="consultar">Consultar Etiquetas</TabsTrigger>
          <TabsTrigger value="etiquetasMae">Etiquetas Mãe</TabsTrigger>
        </TabsList>
        
        <TabsContent value="gerar">
          <GerarEtiquetasTab 
            form={form}
            generatedVolumes={generatedVolumes}
            handleGenerateVolumes={handleGenerateVolumes}
            handlePrintEtiquetas={handlePrintEtiquetas}
            handleClassifyVolume={handleClassifyVolume}
          />
        </TabsContent>
        
        <TabsContent value="consultar">
          <ConsultaEtiquetasTab 
            volumes={volumes}
            handleReimprimirEtiquetas={handleReimprimirEtiquetas}
          />
        </TabsContent>
        
        <TabsContent value="etiquetasMae">
          <EtiquetasMaeTab 
            etiquetasMae={etiquetasMae}
            volumes={volumes}
            handlePrintEtiquetaMae={handlePrintEtiquetaMae}
            handleVincularVolumes={handleVincularVolumes}
            handleCreateEtiquetaMae={handleCreateEtiquetaMae}
            form={form}
          />
        </TabsContent>
      </Tabs>

      {/* Classification Dialog */}
      <ClassifyVolumeDialog 
        volume={selectedVolume}
        open={classifyDialogOpen}
        onClose={() => setClassifyDialogOpen(false)}
        onSave={handleSaveVolumeClassification}
      />
    </MainLayout>
  );
};

export default GeracaoEtiquetas;
