
import React from 'react';
import { Card } from '@/components/ui/card';
import CompactLayout from './etiquetas/CompactLayout';
import StandardLayout from './etiquetas/StandardLayout';
import ModernLayout from './etiquetas/ModernLayout';
import EnhancedReadabilityLayout from './etiquetas/EnhancedReadabilityLayout';
import PortraitLayout from './etiquetas/PortraitLayout';
import EtiquetaMaeHeader from './etiquetas/EtiquetaMaeHeader';
import QuimicoIcon from './etiquetas/QuimicoIcon';
import { getClassificacaoText, getDisplayCidade } from './etiquetas/utils';
import { EtiquetaProps } from './etiquetas/types';

const EtiquetaTemplate = React.forwardRef<HTMLDivElement, EtiquetaProps>(
  ({ volumeData, volumeNumber, totalVolumes, format = 'small', tipo = 'volume', layoutStyle = 'standard' }, ref) => {
    // Define width based on format
    const isA4 = format === 'a4';
    const isPortrait = layoutStyle === 'portrait';
    const width = isA4 ? 'max-w-[800px]' : isPortrait ? 'max-w-[400px]' : 'max-w-[500px]';
    const height = isPortrait ? 'min-h-[600px]' : '';
    const isQuimico = volumeData.tipoVolume === 'quimico';
    const isMae = tipo === 'mae';
    const displayCidade = getDisplayCidade(volumeData);
    
    // For etiqueta mãe with no linked volumes
    const isStandaloneEtiquetaMae = isMae && !volumeData.notaFiscal;
    
    // Render the selected layout based on layoutStyle
    const renderLayout = () => {
      // Shared props for all layouts
      const layoutProps = {
        volumeData,
        volumeNumber,
        totalVolumes,
        isMae,
        isQuimico,
        displayCidade,
        getClassificacaoText: () => getClassificacaoText(volumeData.classificacaoQuimica)
      };
      
      switch (layoutStyle) {
        case 'portrait':
          return <PortraitLayout {...layoutProps} />;
        case 'compact':
          return <CompactLayout {...layoutProps} />;
        case 'modern':
          return <ModernLayout {...layoutProps} />;
        case 'enhanced':
          return <EnhancedReadabilityLayout {...layoutProps} />;
        case 'standard':
        default:
          return <StandardLayout {...layoutProps} />;
      }
    };
    
    return (
      <div 
        ref={ref}
        className={`etiqueta-container bg-white p-4 border border-gray-300 w-full ${width} ${height}`}
        style={{ 
          pageBreakInside: 'avoid', 
          pageBreakAfter: 'always',
        }}
      >
        <Card className={`border-2 ${isMae ? 'border-red-500' : 'border-black'} p-${layoutStyle === 'modern' || layoutStyle === 'enhanced' || layoutStyle === 'portrait' ? '0' : '3'} ${(layoutStyle === 'modern' || layoutStyle === 'enhanced' || layoutStyle === 'portrait') ? 'overflow-hidden' : ''} relative ${height}`}>
          {isMae && layoutStyle !== 'modern' && layoutStyle !== 'enhanced' && layoutStyle !== 'portrait' && (
            <EtiquetaMaeHeader 
              etiquetaMaeId={volumeData.etiquetaMae} 
              descricao={volumeData.descricao} 
            />
          )}
          
          {isQuimico && layoutStyle !== 'modern' && layoutStyle !== 'enhanced' && layoutStyle !== 'portrait' && <QuimicoIcon />}
          
          {renderLayout()}
        </Card>
      </div>
    );
  }
);

EtiquetaTemplate.displayName = "EtiquetaTemplate";

export default EtiquetaTemplate;
