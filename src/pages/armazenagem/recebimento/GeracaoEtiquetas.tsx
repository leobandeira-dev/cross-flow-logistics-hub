import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '../../../components/layout/MainLayout';
import { useForm } from 'react-hook-form';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { useEtiquetasGenerator } from '@/hooks/useEtiquetasGenerator';

// Import refactored components
import EtiquetaFormPanel from './components/etiquetas/EtiquetaFormPanel';
import EtiquetaPreview from './components/etiquetas/EtiquetaPreview';
import VolumesTable from './components/etiquetas/VolumesTable';
import ConsultaEtiquetasTab from './components/etiquetas/ConsultaEtiquetasTab';
import EtiquetasMaeTab from './components/etiquetas/EtiquetasMaeTab';
import ClassifyVolumeDialog from './components/etiquetas/ClassifyVolumeDialog';
import { volumesParaEtiquetar, etiquetasMae } from './components/etiquetas/mockData';

const GeracaoEtiquetas: React.FC = () => {
  const location = useLocation();
  const notaFiscalData = location.state;
  const [activeTab, setActiveTab] = useState('gerar');
  const [tipoEtiqueta, setTipoEtiqueta] = useState<'volume' | 'mae'>('volume');
  const [generatedVolumes, setGeneratedVolumes] = useState<any[]>([]);
  const [volumes, setVolumes] = useState(volumesParaEtiquetar);
  const [classifyDialogOpen, setClassifyDialogOpen] = useState(false);
  const [selectedVolume, setSelectedVolume] = useState<any>(null);
  
  const form = useForm({
    defaultValues: {
      notaFiscal: '',
      tipoEtiqueta: 'volume',
      volumesTotal: '',
      formatoImpressao: '50x100',
      tipoVolume: 'geral',
      codigoONU: '',
      codigoRisco: '',
      etiquetaMaeId: '',
      pesoTotalBruto: ''
    }
  });
  
  const { generateEtiquetasPDF, generateEtiquetaMaePDF, isGenerating } = useEtiquetasGenerator();
  
  useEffect(() => {
    // If nota fiscal data is provided, pre-fill the form
    if (notaFiscalData?.notaFiscal) {
      form.setValue('notaFiscal', notaFiscalData.notaFiscal);
    }
  }, [notaFiscalData, form]);

  // Function to generate volumes based on form data
  const handleGenerateVolumes = () => {
    const notaFiscal = form.getValues('notaFiscal');
    const volumesTotal = parseInt(form.getValues('volumesTotal'), 10);
    const pesoTotalBruto = form.getValues('pesoTotalBruto') || '0,00 Kg';
    
    if (!notaFiscal) {
      toast({
        title: "Erro",
        description: "Informe o número da nota fiscal.",
        variant: "destructive"
      });
      return;
    }
    
    if (!volumesTotal || isNaN(volumesTotal) || volumesTotal <= 0) {
      toast({
        title: "Erro",
        description: "Informe uma quantidade válida de volumes.",
        variant: "destructive"
      });
      return;
    }
    
    // Generate new volumes based on the quantity
    const newVolumes = [];
    for (let i = 1; i <= volumesTotal; i++) {
      const newVolume = {
        id: `VOL-${notaFiscal}-${i.toString().padStart(3, '0')}`,
        notaFiscal,
        descricao: `Volume ${i} de ${volumesTotal}`,
        quantidade: 1,
        etiquetado: false,
        tipoVolume: 'geral',
        remetente: "A definir",
        destinatario: "A definir",
        endereco: "A definir",
        cidade: "A definir",
        cidadeCompleta: "A definir",
        uf: "UF",
        pesoTotal: pesoTotalBruto
      };
      newVolumes.push(newVolume);
    }
    
    // Add to existing volumes
    setVolumes(prevVolumes => {
      // Remove any existing volumes for this nota fiscal
      const filteredVolumes = prevVolumes.filter(vol => vol.notaFiscal !== notaFiscal);
      // Add the new volumes
      return [...filteredVolumes, ...newVolumes];
    });
    
    setGeneratedVolumes(newVolumes);
    
    toast({
      title: "Volumes gerados",
      description: `${volumesTotal} volumes gerados para a nota fiscal ${notaFiscal}.`,
    });
  };

  // Function to handle printing etiquetas for selected volumes
  const handlePrintEtiquetas = (volume: any) => {
    // Get volumes with the same nota fiscal
    const volumesNota = volumes.filter(vol => vol.notaFiscal === volume.notaFiscal);
    
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
    
    // Mark volumes as printed
    setVolumes(prevVolumes => 
      prevVolumes.map(vol => 
        vol.notaFiscal === volume.notaFiscal 
          ? { ...vol, etiquetado: true } 
          : vol
      )
    );
    
    toast({
      title: "Etiquetas Geradas",
      description: `Etiquetas para NF ${volume.notaFiscal} geradas com sucesso.`,
    });
  };

  // Function to handle printing etiquetas for all volumes
  const handleReimprimirEtiquetas = (volume: any) => {
    // For reimprimir, we generate etiquetas regardless of etiquetado status
    const volumesNota = volumes.filter(vol => vol.notaFiscal === volume.notaFiscal);
    
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
    const volumesNota = volumes.filter(vol => vol.notaFiscal === etiquetaMae.notaFiscal);
    
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
    
    const volumesNota = volumes.filter(vol => vol.notaFiscal === notaFiscal);
    
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
    
    toast({
      title: "Etiqueta Mãe Criada",
      description: `Nova etiqueta mãe para NF ${notaFiscal} criada com sucesso.`,
    });
  };

  // Open dialog for classifying volume
  const handleClassifyVolume = (volume: any) => {
    setSelectedVolume(volume);
    setClassifyDialogOpen(true);
  };

  // Save volume classification
  const handleSaveVolumeClassification = (volume: any, formData: any) => {
    setVolumes(prevVolumes => 
      prevVolumes.map(vol => 
        vol.id === volume.id 
          ? { 
              ...vol, 
              tipoVolume: formData.tipoVolume,
              codigoONU: formData.codigoONU,
              codigoRisco: formData.codigoRisco
            } 
          : vol
      )
    );
    
    toast({
      title: "Volume Classificado",
      description: `O volume ${volume.id} foi classificado como ${formData.tipoVolume === 'quimico' ? 'Produto Químico' : 'Carga Geral'}.`,
    });
  };

  // Function to handle linking volumes to master label
  const handleVincularVolumes = (etiquetaMaeId: string, volumeIds: string[]) => {
    // Update volumes with the etiqueta mae link
    setVolumes(prevVolumes => 
      prevVolumes.map(vol => 
        volumeIds.includes(vol.id)
          ? { ...vol, etiquetaMae: etiquetaMaeId }
          : vol
      )
    );
    
    toast({
      title: "Volumes Vinculados",
      description: `${volumeIds.length} volumes foram vinculados à etiqueta mãe ${etiquetaMaeId}.`,
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
              <EtiquetaFormPanel 
                form={form}
                tipoEtiqueta={tipoEtiqueta}
                setTipoEtiqueta={setTipoEtiqueta}
                isQuimico={isQuimico}
                handleGenerateVolumes={handleGenerateVolumes} 
                handleCreateEtiquetaMae={handleCreateEtiquetaMae}
              />
              
              {activeTab === 'gerar' && generatedVolumes.length > 0 && (
                <VolumesTable 
                  volumes={generatedVolumes}
                  handlePrintEtiquetas={handlePrintEtiquetas}
                  handleClassifyVolume={handleClassifyVolume}
                  showEtiquetaMaeColumn={true}
                />
              )}

              {activeTab === 'gerar' && generatedVolumes.length === 0 && (
                <div className="mt-6 p-8 text-center border rounded-md bg-gray-50">
                  <p className="text-gray-600">
                    Informe a nota fiscal e a quantidade de volumes, depois clique em "Gerar Volumes" para criar etiquetas.
                  </p>
                </div>
              )}
            </div>
            
            <div>
              <EtiquetaPreview 
                tipoEtiqueta={tipoEtiqueta}
                isQuimico={isQuimico}
              />
            </div>
          </div>
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
