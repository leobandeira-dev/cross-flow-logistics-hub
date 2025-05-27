import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Biohazard, QrCode, Package, Truck, TestTube } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LayoutStyle } from '@/hooks/etiquetas/types';

interface EtiquetaPreviewProps {
  tipoEtiqueta: 'volume' | 'mae';
  isQuimico: boolean;
}

const EtiquetaPreview: React.FC<EtiquetaPreviewProps> = ({ 
  tipoEtiqueta,
  isQuimico 
}) => {
  const [layoutStyle, setLayoutStyle] = useState<LayoutStyle>('standard');

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
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-md p-4 h-auto flex items-center justify-center">
          <div className="text-center">
            {layoutStyle === 'standard' && (
              // Standard layout preview
              renderStandardPreview(tipoEtiqueta, isQuimico)
            )}
            
            {layoutStyle === 'enhanced' && (
              // Enhanced layout preview
              renderEnhancedPreview(tipoEtiqueta, isQuimico)
            )}
            
            {layoutStyle === 'compact' && (
              // Compact layout preview with fixed visual conflicts
              renderCompactPreview(tipoEtiqueta, isQuimico)
            )}
            
            {layoutStyle === 'modern' && (
              // Modern layout preview
              renderModernPreview(tipoEtiqueta, isQuimico)
            )}
            
            {layoutStyle === 'portrait' && (
              // Portrait layout preview
              renderPortraitPreview(tipoEtiqueta, isQuimico)
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Informações na Etiqueta</h3>
          <ul className="text-sm space-y-1">
            {tipoEtiqueta === 'mae' ? (
              <>
                <li>• ID único da etiqueta mãe</li>
                <li>• QR Code de identificação</li>
                <li>• Número da nota fiscal</li>
                <li>• Quantidade total de volumes</li>
                <li>• Remetente / Destinatário</li>
                <li>• Cidade completa / UF</li>
                <li>• Peso total dos volumes</li>
                <li>• Transportadora</li>
              </>
            ) : (
              <>
                <li>• ID único do volume com QR Code</li>
                <li>• Número da nota fiscal</li>
                <li>• Numeração sequencial (X/Y)</li>
                <li>• Remetente / Destinatário</li>
                <li>• Cidade completa / UF</li>
                <li>• Tipo de volume (Geral / Químico)</li>
                <li>• Peso total dos volumes</li>
                <li>• Transportadora</li>
                {isQuimico && (
                  <>
                    <li>• Código ONU</li>
                    <li>• Código de Risco</li>
                    <li>• Simbologia de Perigo</li>
                  </>
                )}
              </>
            )}
          </ul>
        </div>
        
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Impressoras Disponíveis</h3>
          <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2">
            <option value="">Selecionar impressora</option>
            <option value="zebra">Zebra ZT410</option>
            <option value="datamax">Datamax E-4205</option>
            <option value="brother">Brother QL-820NWB</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to render the standard layout preview
const renderStandardPreview = (tipoEtiqueta: 'volume' | 'mae', isQuimico: boolean) => (
  <div className={`p-3 border-2 ${tipoEtiqueta === 'mae' ? 'border-red-500 bg-red-50' : isQuimico ? 'border-yellow-500 bg-yellow-50' : 'border-blue-500 bg-blue-50'} relative`}>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <QrCode size={40} className={`mx-auto mb-2 ${tipoEtiqueta === 'mae' ? 'text-red-600' : isQuimico ? 'text-yellow-600' : 'text-blue-600'}`} />
        {tipoEtiqueta === 'mae' ? (
          <p className="font-bold text-red-600">ETIQUETA MÃE</p>
        ) : isQuimico ? (
          <div>
            <div className="absolute top-2 right-2">
              <TestTube size={24} className="text-red-500" />
            </div>
            <div className="flex items-center justify-center">
              <Biohazard size={20} className="inline-block mr-1 text-red-500" />
              <span className="font-bold text-red-500">PRODUTO QUÍMICO</span>
            </div>
            <div className="text-xs mt-1 bg-yellow-100 p-1 border border-yellow-400 rounded">
              <span className="font-bold">ONU:</span> 1090 <br />
              <span className="font-bold">RISCO:</span> 33
            </div>
          </div>
        ) : (
          <p className="font-bold text-blue-600">ETIQUETA DE VOLUME</p>
        )}
      </div>
      <div>
        <div className="font-bold">Sedex</div>
        <div className="text-xs mt-1">Layout Padrão</div>
        <div className="text-xs mt-2">Otimizado para informações completas</div>
        <div className="mt-2 bg-yellow-100 p-1 border border-yellow-300 rounded text-xs">
          <span className="font-bold">NF:</span> 123456
        </div>
        <div className="mt-1 bg-blue-100 p-1 border border-blue-300 rounded text-xs">
          <span className="font-bold">Remetente:</span> ABC Ltda
        </div>
      </div>
    </div>
  </div>
);

// Helper function to render the enhanced layout preview with larger text
const renderEnhancedPreview = (tipoEtiqueta: 'volume' | 'mae', isQuimico: boolean) => (
  <div className={`p-3 border-2 ${tipoEtiqueta === 'mae' ? 'border-red-500 bg-red-50' : isQuimico ? 'border-yellow-500 bg-yellow-50' : 'border-blue-500 bg-blue-50'} relative`}>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <QrCode size={48} className={`mx-auto mb-2 ${tipoEtiqueta === 'mae' ? 'text-red-600' : isQuimico ? 'text-yellow-600' : 'text-blue-600'}`} />
        {tipoEtiqueta === 'mae' ? (
          <p className="font-bold text-xl text-red-600">ETIQUETA MÃE</p>
        ) : isQuimico ? (
          <div>
            <div className="absolute top-2 right-2">
              <TestTube size={28} className="text-red-500" />
            </div>
            <div className="flex items-center justify-center">
              <Biohazard size={24} className="inline-block mr-1 text-red-500" />
              <span className="font-bold text-lg text-red-500">PRODUTO QUÍMICO</span>
            </div>
            <div className="text-sm mt-1 bg-yellow-100 p-1 border border-yellow-400 rounded">
              <span className="font-bold">ONU:</span> 1090 <br />
              <span className="font-bold">RISCO:</span> 33
            </div>
          </div>
        ) : (
          <p className="font-bold text-xl text-blue-600">ETIQUETA DE VOLUME</p>
        )}
      </div>
      <div>
        <div className="font-bold text-lg">Alta Legibilidade</div>
        <div className="text-sm mt-1">Texto Maior</div>
        <div className="mt-3 bg-yellow-200 p-2 border-2 border-yellow-400 rounded text-sm">
          <span className="font-bold">NF:</span> <span className="text-lg font-bold">123456</span>
        </div>
        <div className="mt-2 bg-green-200 p-2 border-2 border-green-400 rounded text-sm">
          <span className="font-bold">Destino:</span> <span className="text-lg font-bold">SÃO PAULO</span>
        </div>
      </div>
    </div>
  </div>
);

// Helper function to render the compact layout preview - Fixed visual conflicts with improved layout
const renderCompactPreview = (tipoEtiqueta: 'volume' | 'mae', isQuimico: boolean) => (
  <div className={`p-2 border-2 ${tipoEtiqueta === 'mae' ? 'border-red-500 bg-red-50' : isQuimico ? 'border-yellow-500 bg-yellow-50' : 'border-gray-500 bg-gray-50'} relative`}>
    <div className="flex justify-between items-center mb-1">
      <div className="flex items-center">
        <QrCode size={16} className="mr-1" />
        <span className={`text-xs font-bold ${tipoEtiqueta === 'mae' ? 'text-red-600' : isQuimico ? 'text-red-500' : ''}`}>
          {tipoEtiqueta === 'mae' ? 'ETIQ. MÃE' : 'VOL 1/2'}
        </span>
      </div>
      <span className="text-xs">Braspress</span>
    </div>
    
    {isQuimico && (
      <div>
        <div className="absolute top-2 right-2">
          <TestTube size={16} className="text-red-500" />
        </div>
        <div className="flex items-center bg-yellow-100 p-1 mb-1 rounded border border-yellow-500">
          <Biohazard size={12} className="mr-1 text-red-500" />
          <span className="text-xs font-bold">QUÍMICO</span>
          <span className="text-xs ml-1">ONU:1090 / RISCO:33</span>
        </div>
      </div>
    )}
    
    <div className="grid grid-cols-2 gap-1 text-xs">
      <div className="bg-yellow-100 border border-yellow-300 p-1 rounded">
        <span className="text-gray-600">NF:</span>
        <div className="truncate font-bold">123456</div>
      </div>
      <div className="bg-blue-100 border border-blue-300 p-1 rounded">
        <span className="text-gray-600">REMETENTE:</span>
        <div className="truncate font-medium">EMPRESA XYZ</div>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-1 text-xs mt-1">
      <div>
        <span className="text-gray-600">DESTINO:</span>
        <div className="truncate font-medium">SÃO PAULO - SP</div>
      </div>
      <div className="bg-gray-100 p-1 rounded">
        <span className="text-gray-600">TRANSP:</span>
        <div className="truncate font-medium">TRANSPORTES ABC</div>
      </div>
    </div>
    
    <div className="text-xs mt-1 border-t pt-1">
      <span className="text-blue-600 font-medium">DESTINATÁRIO:</span>
      <div className="truncate">CLIENTE ABC LTDA</div>
    </div>
  </div>
);

// Helper function to render the modern layout preview
const renderModernPreview = (tipoEtiqueta: 'volume' | 'mae', isQuimico: boolean) => (
  <div className="border-2 border-black rounded overflow-hidden relative">
    <div className={`${tipoEtiqueta === 'mae' ? 'bg-red-500' : 'bg-black'} text-white p-2 text-sm`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Package size={16} className="mr-1" />
          <span className="font-bold">{tipoEtiqueta === 'mae' ? 'ETIQUETA MÃE' : 'ETIQUETA VOLUME'}</span>
        </div>
        <span className="text-xs bg-white text-black px-1 rounded">NF: 123456</span>
      </div>
    </div>
    <div className="p-2 bg-white text-center">
      {isQuimico && (
        <div className="absolute top-2 right-2">
          <TestTube size={16} className="text-red-500" />
        </div>
      )}
      {isQuimico && (
        <div className="bg-yellow-100 p-1 rounded border border-yellow-400 mb-2 flex items-center justify-center">
          <Biohazard size={16} className="text-red-500 mr-1" />
          <span className="text-xs">ONU:1090 / RISCO:33</span>
        </div>
      )}
      <QrCode size={30} className="mx-auto mb-1" />
      <p className="text-xs font-bold">Jadlog/UPS</p>
      <div className="bg-blue-100 border border-blue-300 p-1 rounded mt-1 text-xs text-left">
        <span className="text-gray-600">REMETENTE:</span>
        <div className="truncate font-medium">EMPRESA XYZ</div>
      </div>
      <p className="text-xs font-medium text-blue-600 mt-1">DESTINATÁRIO</p>
      <div className="bg-gray-100 p-1 rounded mt-1 text-xs text-left">
        <span className="text-gray-600">TRANSP:</span>
        <div className="truncate font-medium">TRANSPORTES ABC</div>
      </div>
    </div>
  </div>
);

// Helper function to render the portrait layout preview
const renderPortraitPreview = (tipoEtiqueta: 'volume' | 'mae', isQuimico: boolean) => (
  <div className={`p-3 border-2 ${tipoEtiqueta === 'mae' ? 'border-red-500 bg-red-50' : isQuimico ? 'border-yellow-500 bg-yellow-50' : 'border-blue-500 bg-blue-50'} relative min-h-[300px] w-[200px]`}>
    <div className="flex flex-col space-y-2 h-full">
      {/* Header */}
      <div className={`text-center py-1 px-2 rounded text-white text-xs font-bold ${tipoEtiqueta === 'mae' ? 'bg-red-500' : 'bg-blue-600'}`}>
        {tipoEtiqueta === 'mae' ? 'ETIQUETA MÃE' : 'VOLUME 1/2'}
      </div>
      
      {/* QR Code */}
      <div className="flex justify-center py-1">
        <QrCode size={32} className="mx-auto" />
      </div>
      
      {/* NF - Destaque */}
      <div className="bg-yellow-100 border border-yellow-400 rounded p-1 text-center">
        <div className="text-xs text-gray-600">NOTA FISCAL</div>
        <div className="text-sm font-bold">123456</div>
      </div>
      
      {/* Cidade - Destaque */}
      <div className="bg-green-100 border border-green-400 rounded p-1 text-center">
        <div className="text-xs text-gray-600">CIDADE DESTINO</div>
        <div className="text-sm font-bold">SÃO PAULO</div>
        <div className="text-xs font-semibold">SP</div>
      </div>
      
      {/* Remetente - Destaque */}
      <div className="bg-blue-100 border border-blue-400 rounded p-1">
        <div className="text-xs text-gray-600">REMETENTE</div>
        <div className="text-xs font-bold leading-tight">EMPRESA XYZ</div>
      </div>
      
      {/* Destinatário - Destaque */}
      <div className="bg-purple-100 border border-purple-400 rounded p-1">
        <div className="text-xs text-gray-600">DESTINATÁRIO</div>
        <div className="text-xs font-bold leading-tight">CLIENTE ABC</div>
      </div>

      {isQuimico && (
        <div className="absolute top-2 right-2">
          <TestTube size={16} className="text-red-500" />
        </div>
      )}
      
      {isQuimico && (
        <div className="bg-red-100 border border-red-500 rounded p-1 mt-auto">
          <div className="flex items-center justify-center">
            <Biohazard size={12} className="text-red-600 mr-1" />
            <span className="text-xs font-bold text-red-600">QUÍMICO</span>
          </div>
          <div className="text-xs text-center">ONU:1090 / RISCO:33</div>
        </div>
      )}
    </div>
  </div>
);

export default EtiquetaPreview;
