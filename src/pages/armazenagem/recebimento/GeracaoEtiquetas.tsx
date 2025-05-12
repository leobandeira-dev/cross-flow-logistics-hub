
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '../../../components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import EtiquetaFormPanel from './components/etiquetas/EtiquetaFormPanel';
import VolumesTable from './components/etiquetas/VolumesTable';
import EtiquetasMaeTab from './components/etiquetas/EtiquetasMaeTab';
import ConsultaEtiquetasTab from './components/etiquetas/ConsultaEtiquetasTab';
import ClassifyVolumeDialog from './components/etiquetas/ClassifyVolumeDialog';
import VinculoEtiquetaMaeDialog from './components/etiquetas/VinculoEtiquetaMaeDialog';
import { Volume } from './components/etiquetas/VolumesTable';
import { useEtiquetasGenerator } from '@/hooks/etiquetas';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/hooks/use-toast';

// Schema for the form validation
const formSchema = z.object({
  notaFiscal: z.string().min(1, "Nota fiscal é obrigatória"),
  volumesTotal: z.string().min(1, "Número de volumes é obrigatório"),
  pesoTotalBruto: z.string().optional(),
  formatoImpressao: z.string().default("50x100"),
  layoutOption: z.string().default("standard"),
});

type FormValues = z.infer<typeof formSchema>;

const GeracaoEtiquetas = () => {
  // Get location state passed from previous screen
  const location = useLocation();
  const notaFiscalData = location.state || {};

  // States
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [generatedVolumes, setGeneratedVolumes] = useState<Volume[]>([]);
  const [selectedVolumes, setSelectedVolumes] = useState<string[]>([]);
  const [selectedClassifyVolume, setSelectedClassifyVolume] = useState<Volume | null>(null);
  const [classifyDialogOpen, setClassifyDialogOpen] = useState(false);
  const [vinculoDialogOpen, setVinculoDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("gerar");

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notaFiscal: '',
      volumesTotal: '',
      pesoTotalBruto: '',
      formatoImpressao: '50x100',
      layoutOption: 'standard',
    }
  });

  // Use etiquetas generator hook
  const { isGenerating, generateEtiquetasPDF, generateEtiquetaMaePDF } = useEtiquetasGenerator();

  // Load data from nota fiscal when available
  useEffect(() => {
    if (notaFiscalData) {
      console.log("Dados da nota fiscal recebidos:", notaFiscalData);
      
      // Set all the available data from the nota fiscal
      form.setValue('notaFiscal', notaFiscalData.notaFiscal);
      
      // FIX: Properly check for volumesTotal in notaFiscalData and set it
      // Check for various possible field names for volumes
      const volumeCount = notaFiscalData.volumesTotal || 
                          notaFiscalData.volumesTotais || 
                          notaFiscalData.qVol || 
                          notaFiscalData.vol?.qVol ||
                          '';
                          
      if (volumeCount) {
        form.setValue('volumesTotal', volumeCount.toString());
      }
      
      form.setValue('pesoTotalBruto', notaFiscalData.pesoTotal || notaFiscalData.pesoTotalBruto || '');
      
      // If volumes total is provided, automatically generate volumes
      if (volumeCount && parseInt(volumeCount.toString()) > 0) {
        setTimeout(() => handleGenerateVolumes(), 300);
      }
    }
  }, [notaFiscalData, form]);

  // Handle volume generation based on form values
  const handleGenerateVolumes = () => {
    const values = form.getValues();
    const notaFiscal = values.notaFiscal;
    const volumesCount = parseInt(values.volumesTotal || '0');
    
    if (!notaFiscal) {
      toast({
        title: "Atenção",
        description: "Número da nota fiscal é obrigatório",
        variant: "destructive"
      });
      return;
    }
    
    if (volumesCount <= 0) {
      toast({
        title: "Atenção",
        description: "O número de volumes deve ser maior que zero",
        variant: "destructive"
      });
      return;
    }
    
    if (volumesCount > 100) {
      toast({
        title: "Atenção",
        description: "O número máximo de volumes permitido é 100",
        variant: "destructive"
      });
      return;
    }
    
    // Generate the volumes
    const newVolumes: Volume[] = [];
    for (let i = 0; i < volumesCount; i++) {
      newVolumes.push({
        id: uuidv4(),
        notaFiscal,
        descricao: `Volume ${i+1}/${volumesCount}`,
        quantidade: 1,
        etiquetado: false,
      });
    }
    
    setVolumes(newVolumes);
    setGeneratedVolumes(newVolumes);
    
    toast({
      title: "Volumes gerados",
      description: `${volumesCount} volumes foram gerados com sucesso.`,
    });
  };

  // Handle volume selection for printing
  const handleVolumeSelectionChange = (selectedIds: string[]) => {
    setSelectedVolumes(selectedIds);
  };

  // Handle print button click
  const handlePrintSelected = async () => {
    if (selectedVolumes.length === 0) {
      toast({
        title: "Atenção",
        description: "Selecione pelo menos um volume para imprimir",
        variant: "destructive"
      });
      return;
    }
    
    const selectedVolumesData = volumes.filter(volume => selectedVolumes.includes(volume.id));
    const values = form.getValues();
    
    const result = await generateEtiquetasPDF(
      selectedVolumesData,
      notaFiscalData,
      values.formatoImpressao,
      'volume',
      undefined,
      values.layoutOption as any
    );
    
    if (result.status === 'success') {
      // Mark the volumes as printed
      const updatedVolumes = volumes.map(vol => {
        if (selectedVolumes.includes(vol.id)) {
          return { ...vol, etiquetado: true };
        }
        return vol;
      });
      
      setVolumes(updatedVolumes);
      setGeneratedVolumes(updatedVolumes);
      setSelectedVolumes([]);
    }
  };

  // Handle master tag generation
  const handleGenerateMasterTag = async () => {
    if (selectedVolumes.length === 0) {
      toast({
        title: "Atenção",
        description: "Selecione os volumes que deseja vincular à etiqueta mãe",
        variant: "destructive"
      });
      return;
    }
    
    setVinculoDialogOpen(true);
  };

  // Create master tag with the selected volumes
  const handleCreateMasterTag = async (masterTagId: string) => {
    const selectedVolumesData = volumes.filter(volume => selectedVolumes.includes(volume.id));
    const values = form.getValues();
    
    const result = await generateEtiquetaMaePDF(
      selectedVolumesData,
      notaFiscalData,
      values.formatoImpressao,
      masterTagId,
      values.layoutOption as any
    );
    
    if (result.status === 'success') {
      toast({
        title: "Etiqueta mãe gerada",
        description: `Etiqueta mãe ${masterTagId} gerada com sucesso para ${selectedVolumesData.length} volumes`,
      });
      
      // Update volumes with master tag info
      const updatedVolumes = volumes.map(vol => {
        if (selectedVolumes.includes(vol.id)) {
          return { ...vol, etiquetaMae: masterTagId };
        }
        return vol;
      });
      
      setVolumes(updatedVolumes);
      setGeneratedVolumes(updatedVolumes);
    }
    
    setVinculoDialogOpen(false);
  };

  // Handle volume classification
  const handleClassifyVolume = (volume: Volume) => {
    setSelectedClassifyVolume(volume);
    setClassifyDialogOpen(true);
  };

  // Save volume classification
  const handleSaveVolumeClassification = (volume: Volume, formData: any) => {
    // Update both states: volumes and generatedVolumes to ensure UI is consistent
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
    
    // Also update generatedVolumes to ensure the type is updated in the "Volumes para etiquetar" list
    setGeneratedVolumes(prevVolumes => 
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
      title: "Volume classificado",
      description: `Volume ${volume.id} classificado como ${formData.tipoVolume === 'quimico' ? 'Produto Químico' : 'Carga Geral'}`,
    });
  };

  return (
    <MainLayout title="Geração de Etiquetas">
      <div className="mb-6">
        <h2 className="text-2xl font-heading mb-2">Geração de Etiquetas</h2>
        <p className="text-gray-600">Gere etiquetas para os volumes de uma nota fiscal</p>
      </div>
      
      <Tabs defaultValue="gerar" className="mb-6" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="gerar">Gerar Etiquetas</TabsTrigger>
          <TabsTrigger value="etiquetas-mae">Etiquetas Mãe</TabsTrigger>
          <TabsTrigger value="consultar">Consultar Etiquetas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="gerar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados para Geração</CardTitle>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form className="space-y-6">
                  <EtiquetaFormPanel
                    form={form}
                    onGenerateVolumes={handleGenerateVolumes}
                  />
                  
                  <VolumesTable
                    volumes={generatedVolumes}
                    selectedVolumes={selectedVolumes}
                    onSelectionChange={handleVolumeSelectionChange}
                    onClassifyVolume={handleClassifyVolume}
                    onPrintSelected={handlePrintSelected}
                    onGenerateMasterTag={handleGenerateMasterTag}
                    isGenerating={isGenerating}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="etiquetas-mae">
          <EtiquetasMaeTab
            volumes={volumes}
          />
        </TabsContent>
        
        <TabsContent value="consultar">
          <ConsultaEtiquetasTab />
        </TabsContent>
      </Tabs>
      
      <ClassifyVolumeDialog 
        volume={selectedClassifyVolume}
        open={classifyDialogOpen}
        onClose={() => setClassifyDialogOpen(false)}
        onSave={handleSaveVolumeClassification}
      />
      
      <VinculoEtiquetaMaeDialog
        open={vinculoDialogOpen}
        onClose={() => setVinculoDialogOpen(false)}
        onSave={handleCreateMasterTag}
        notaFiscal={form.getValues().notaFiscal}
      />
    </MainLayout>
  );
};

export default GeracaoEtiquetas;
