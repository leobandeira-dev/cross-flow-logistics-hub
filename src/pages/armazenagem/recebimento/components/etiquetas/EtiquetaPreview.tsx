
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LayoutStyle } from '@/hooks/etiquetas/types';
import StandardPreview from './preview/StandardPreview';
import EnhancedPreview from './preview/EnhancedPreview';
import CompactPreview from './preview/CompactPreview';
import ModernPreview from './preview/ModernPreview';
import PortraitPreview from './preview/PortraitPreview';
import { PortraitBluePreview, PortraitGreenPreview, PortraitRedPreview, PortraitPurplePreview } from './preview/PortraitColorPreviews';
import EtiquetaInfoList from './preview/EtiquetaInfoList';
import PrinterSelector from './preview/PrinterSelector';

interface EtiquetaPreviewProps {
  tipoEtiqueta: 'volume' | 'mae';
  isQuimico: boolean;
}

const EtiquetaPreview: React.FC<EtiquetaPreviewProps> = ({ 
  tipoEtiqueta,
  isQuimico 
}) => {
  const [layoutStyle, setLayoutStyle] = useState<LayoutStyle>('standard');

  const renderLayoutPreview = () => {
    const commonProps = { tipoEtiqueta, isQuimico };

    switch (layoutStyle) {
      case 'standard':
        return <StandardPreview {...commonProps} />;
      case 'enhanced':
        return <EnhancedPreview {...commonProps} />;
      case 'compact':
        return <CompactPreview {...commonProps} />;
      case 'modern':
        return <ModernPreview {...commonProps} />;
      case 'portrait':
        return <PortraitPreview {...commonProps} />;
      case 'portrait_blue':
        return <PortraitBluePreview {...commonProps} />;
      case 'portrait_green':
        return <PortraitGreenPreview {...commonProps} />;
      case 'portrait_red':
        return <PortraitRedPreview {...commonProps} />;
      case 'portrait_purple':
        return <PortraitPurplePreview {...commonProps} />;
      default:
        return <StandardPreview {...commonProps} />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Modelo de Etiqueta</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label className="text-sm font-medium mb-2 block">Layout da Etiqueta</label>
          <Select value={layoutStyle} onValueChange={(value: LayoutStyle) => setLayoutStyle(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Padrão (Sedex)</SelectItem>
              <SelectItem value="enhanced">Alta Legibilidade (Texto Grande)</SelectItem>
              <SelectItem value="compact">Compacto (Braspress)</SelectItem>
              <SelectItem value="modern">Moderno (Jadlog/UPS)</SelectItem>
              <SelectItem value="portrait">Retrato (Itens Grandes)</SelectItem>
              <SelectItem value="portrait_blue">Retrato Azul (Alto Contraste)</SelectItem>
              <SelectItem value="portrait_green">Retrato Verde (Alto Contraste)</SelectItem>
              <SelectItem value="portrait_red">Retrato Vermelho (Alto Contraste)</SelectItem>
              <SelectItem value="portrait_purple">Retrato Roxo (Alto Contraste)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-md p-4 h-auto flex items-center justify-center">
          <div className="text-center">
            {renderLayoutPreview()}
          </div>
        </div>
        
        <EtiquetaInfoList tipoEtiqueta={tipoEtiqueta} isQuimico={isQuimico} />
        <PrinterSelector />
      </CardContent>
    </Card>
  );
};

export default EtiquetaPreview;
