
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useEtiquetasGenerator } from '@/hooks/etiquetas';
import { Volume } from '../components/etiquetas/VolumesTable';

export const useGeracaoEtiquetas = () => {
  const location = useLocation();
  const notaFiscalData = location.state || {};
  const [tipoEtiqueta, setTipoEtiqueta] = useState<'volume' | 'mae'>('volume');
  const [generatedVolumes, setGeneratedVolumes] = useState<Volume[]>([]);
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [classifyDialogOpen, setClassifyDialogOpen] = useState(false);
  const [selectedVolume, setSelectedVolume] = useState<Volume | null>(null);
  
  const form = useForm({
    defaultValues: {
      notaFiscal: '',
      tipoEtiqueta: 'volume',
      volumesTotal: '',
      formatoImpressao: '50x100',
      layoutStyle: 'standard',
      tipoVolume: 'geral',
      codigoONU: '',
      codigoRisco: '',
      etiquetaMaeId: '',
      pesoTotalBruto: ''
    }
  });
  
  const { generateEtiquetasPDF, generateEtiquetaMaePDF, isGenerating } = useEtiquetasGenerator();

  // Function to generate volumes based on form data
  const handleGenerateVolumes = () => {
    const notaFiscal = form.getValues('notaFiscal');
    const volumesTotal = parseInt(form.getValues('volumesTotal'), 10);
    const pesoTotalBruto = form.getValues('pesoTotalBruto') || notaFiscalData?.pesoTotal || '0,00 Kg';
    
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
    
    console.log("Gerando volumes com os dados da nota fiscal:", notaFiscalData);
    console.log("Quantidade de volumes a gerar:", volumesTotal);
    
    // Generate new volumes based on the quantity, using data from nota fiscal if available
    const newVolumes: Volume[] = [];
    for (let i = 1; i <= volumesTotal; i++) {
      const newVolume: Volume = {
        id: `VOL-${notaFiscal}-${i.toString().padStart(3, '0')}`,
        notaFiscal,
        descricao: `Volume ${i} de ${volumesTotal}`,
        quantidade: 1,
        etiquetado: false,
        tipoVolume: form.getValues('tipoVolume') as 'geral' | 'quimico',
        codigoONU: form.getValues('codigoONU') || '',
        codigoRisco: form.getValues('codigoRisco') || '',
        // Use data from the nota fiscal if available
        remetente: notaFiscalData?.remetente || "A definir",
        destinatario: notaFiscalData?.destinatario || "A definir",
        endereco: notaFiscalData?.endereco || "A definir",
        cidade: notaFiscalData?.cidade || "A definir",
        cidadeCompleta: notaFiscalData?.cidadeCompleta || "A definir",
        uf: notaFiscalData?.uf || "UF",
        pesoTotal: pesoTotalBruto,
        chaveNF: notaFiscalData?.chaveNF || ''
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
  const handlePrintEtiquetas = (volume: Volume) => {
    // Get volumes with the same nota fiscal
    const volumesNota = volumes.filter(vol => vol.notaFiscal === volume.notaFiscal);
    
    // Prepare nota data for the etiquetas
    const notaData = {
      fornecedor: volume.remetente || notaFiscalData?.remetente || '',
      destinatario: volume.destinatario || notaFiscalData?.destinatario || '',
      endereco: volume.endereco || notaFiscalData?.endereco || '',
      cidade: volume.cidade || notaFiscalData?.cidade || '',
      cidadeCompleta: volume.cidadeCompleta || notaFiscalData?.cidadeCompleta || '',
      uf: volume.uf || notaFiscalData?.uf || '',
      pesoTotal: volume.pesoTotal || notaFiscalData?.pesoTotal || '',
      chaveNF: volume.chaveNF || notaFiscalData?.chaveNF || ''
    };
    
    console.log("Dados da nota para etiquetas:", notaData);
    
    // Get formato de impressão and layout style from form
    const formatoImpressao = form.getValues('formatoImpressao');
    const layoutStyle = form.getValues('layoutStyle') || 'standard';
    
    // Generate etiquetas for all volumes of this nota fiscal
    const result = generateEtiquetasPDF(volumesNota, notaData, formatoImpressao, 'volume', undefined, layoutStyle as any);
    
    // Update volumes state if labels were successfully generated
    if (result && typeof result.then === 'function') {
      result.then((res) => {
        if (res && res.status === 'success' && res.volumes) {
          setVolumes(prevVolumes => 
            prevVolumes.map(vol => {
              const updatedVol = res.volumes.find(v => v.id === vol.id);
              return updatedVol || vol;
            })
          );
          
          toast({
            title: "Etiquetas Geradas",
            description: `Etiquetas para NF ${volume.notaFiscal} geradas com sucesso.`,
          });
        }
      });
    }
  };

  // Function to handle printing etiquetas for all volumes
  const handleReimprimirEtiquetas = (volume: Volume) => {
    // For reimprimir, we generate etiquetas regardless of etiquetado status
    const volumesNota = volumes.filter(vol => vol.notaFiscal === volume.notaFiscal);
    
    const notaData = {
      fornecedor: volume.remetente || notaFiscalData?.remetente || '',
      destinatario: volume.destinatario || notaFiscalData?.destinatario || '',
      endereco: volume.endereco || notaFiscalData?.endereco || '',
      cidade: volume.cidade || notaFiscalData?.cidade || '',
      cidadeCompleta: volume.cidadeCompleta || notaFiscalData?.cidadeCompleta || '',
      uf: volume.uf || notaFiscalData?.uf || '',
      pesoTotal: volume.pesoTotal || notaFiscalData?.pesoTotal || '',
      chaveNF: volume.chaveNF || notaFiscalData?.chaveNF || ''
    };
    
    // Get formato de impressão and layout style from form
    const formatoImpressao = form.getValues('formatoImpressao');
    const layoutStyle = form.getValues('layoutStyle') || 'standard';
    
    generateEtiquetasPDF(volumesNota, notaData, formatoImpressao, 'volume', undefined, layoutStyle as any);
    
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
      fornecedor: volumesNota[0].remetente || notaFiscalData?.remetente || '',
      destinatario: volumesNota[0].destinatario || notaFiscalData?.destinatario || '',
      endereco: volumesNota[0].endereco || notaFiscalData?.endereco || '',
      cidade: volumesNota[0].cidade || notaFiscalData?.cidade || '',
      cidadeCompleta: volumesNota[0].cidadeCompleta || notaFiscalData?.cidadeCompleta || '',
      uf: volumesNota[0].uf || notaFiscalData?.uf || '',
      pesoTotal: volumesNota[0].pesoTotal || notaFiscalData?.pesoTotal || '',
      chaveNF: volumesNota[0].chaveNF || notaFiscalData?.chaveNF || ''
    };
    
    // Get formato de impressão and layout style from form
    const formatoImpressao = form.getValues('formatoImpressao');
    const layoutStyle = form.getValues('layoutStyle') || 'standard';
    
    // Generate master etiqueta
    generateEtiquetaMaePDF(volumesNota, notaData, formatoImpressao, etiquetaMae.id, layoutStyle as any);
    
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
      fornecedor: volumesNota[0].remetente || notaFiscalData?.remetente || '',
      destinatario: volumesNota[0].destinatario || notaFiscalData?.destinatario || '',
      endereco: volumesNota[0].endereco || notaFiscalData?.endereco || '',
      cidade: volumesNota[0].cidade || notaFiscalData?.cidade || '',
      cidadeCompleta: volumesNota[0].cidadeCompleta || notaFiscalData?.cidadeCompleta || '',
      uf: volumesNota[0].uf || notaFiscalData?.uf || '',
      pesoTotal: volumesNota[0].pesoTotal || notaFiscalData?.pesoTotal || '',
      chaveNF: volumesNota[0].chaveNF || notaFiscalData?.chaveNF || ''
    };
    
    // Get formato de impressão and layout style from form
    const formatoImpressao = form.getValues('formatoImpressao');
    const layoutStyle = form.getValues('layoutStyle') || 'standard';
    
    // Generate master etiqueta
    generateEtiquetaMaePDF(volumesNota, notaData, formatoImpressao, etiquetaMaeId, layoutStyle as any);
    
    toast({
      title: "Etiqueta Mãe Criada",
      description: `Nova etiqueta mãe para NF ${notaFiscal} criada com sucesso.`,
    });
  };

  // Open dialog for classifying volume
  const handleClassifyVolume = (volume: Volume) => {
    setSelectedVolume(volume);
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

  return {
    form,
    notaFiscalData,
    tipoEtiqueta,
    generatedVolumes,
    volumes,
    classifyDialogOpen,
    selectedVolume,
    isGenerating,
    setTipoEtiqueta,
    setVolumes,
    setGeneratedVolumes,
    setClassifyDialogOpen,
    handleGenerateVolumes,
    handlePrintEtiquetas,
    handleReimprimirEtiquetas,
    handlePrintEtiquetaMae,
    handleCreateEtiquetaMae,
    handleClassifyVolume,
    handleSaveVolumeClassification,
    handleVincularVolumes
  };
};
