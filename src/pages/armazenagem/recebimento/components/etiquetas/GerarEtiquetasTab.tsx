
import React from 'react';
import { Volume } from './VolumesTable';
import { UseFormReturn } from 'react-hook-form';
import { LayoutStyle } from '@/hooks/etiquetas/types';
import EtiquetaFormPanel from './EtiquetaFormPanel';
import EtiquetaPreview from './EtiquetaPreview';
import GeneratedVolumesPanel from './GeneratedVolumesPanel';

interface GerarEtiquetasTabProps {
  form: UseFormReturn<any>;
  generatedVolumes: Volume[];
  handleGenerateVolumes: () => void;
  handlePrintEtiquetas: (volume: Volume) => void;
  handleClassifyVolume: (volume: Volume) => void;
}

const GerarEtiquetasTab: React.FC<GerarEtiquetasTabProps> = ({ 
  form, 
  generatedVolumes, 
  handleGenerateVolumes, 
  handlePrintEtiquetas, 
  handleClassifyVolume 
}) => {
  const currentLayoutStyle = form.watch('layoutStyle') as LayoutStyle;

  const handleLayoutChange = (newLayout: LayoutStyle) => {
    form.setValue('layoutStyle', newLayout);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <EtiquetaFormPanel 
          form={form}
          tipoEtiqueta="volume"
          isQuimico={form.watch('tipoVolume') === 'quimico'}
          handleGenerateVolumes={handleGenerateVolumes} 
          showEtiquetaMaeOption={false}
        />
        
        <GeneratedVolumesPanel 
          volumes={generatedVolumes}
          handlePrintEtiquetas={handlePrintEtiquetas}
          handleClassifyVolume={handleClassifyVolume}
        />
      </div>
      
      <div>
        <EtiquetaPreview 
          tipoEtiqueta="volume"
          isQuimico={form.watch('tipoVolume') === 'quimico'}
          formLayoutStyle={currentLayoutStyle}
          onLayoutChange={handleLayoutChange}
        />
      </div>
    </div>
  );
};

export default GerarEtiquetasTab;
