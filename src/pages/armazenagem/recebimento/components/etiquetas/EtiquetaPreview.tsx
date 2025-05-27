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
          <h3 className="text-sm font-medium mb-2">Formatos Disponíveis</h3>
          <ul className="text-sm space-y-1">
            <li>• 50x100mm - Formato padrão compacto</li>
            <li>• 150x100mm - Formato com texto grande</li>
            <li>• A4 - Formato folha inteira</li>
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
  <div className={`p-4 border-2 ${tipoEtiqueta === 'mae' ? 'border-red-500 bg-red-50' : isQuimico ? 'border-yellow-500 bg-yellow-50' : 'border-blue-500 bg-blue-50'} relative w-full max-w-md`}>
    <div className="space-y-3">
      <div className="text-center">
        <QrCode size={60} className={`mx-auto mb-2 ${tipoEtiqueta === 'mae' ? 'text-red-600' : isQuimico ? 'text-yellow-600' : 'text-blue-600'}`} />
        {tipoEtiqueta === 'mae' ? (
          <p className="font-bold text-2xl text-red-600">ETIQUETA MÃE</p>
        ) : isQuimico ? (
          <div>
            <div className="absolute top-3 right-3">
              <TestTube size={32} className="text-red-500" />
            </div>
            <div className="flex items-center justify-center mb-2">
              <Biohazard size={28} className="inline-block mr-2 text-red-500" />
              <span className="font-bold text-xl text-red-500">PRODUTO QUÍMICO</span>
            </div>
            <div className="text-lg mt-2 bg-yellow-100 p-2 border-2 border-yellow-400 rounded">
              <span className="font-bold">ONU:</span> <span className="text-xl">1090</span> <br />
              <span className="font-bold">RISCO:</span> <span className="text-xl">33</span>
            </div>
          </div>
        ) : (
          <p className="font-bold text-2xl text-blue-600">ETIQUETA DE VOLUME</p>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="font-bold text-xl text-center">Alta Legibilidade</div>
        <div className="text-lg text-center text-gray-600">Formato 150x100mm</div>
        
        <div className="bg-yellow-200 p-3 border-2 border-yellow-400 rounded text-center">
          <span className="font-bold text-lg">NF:</span> 
          <div className="text-2xl font-bold mt-1">123456</div>
        </div>
        
        <div className="bg-green-200 p-3 border-2 border-green-400 rounded text-center">
          <span className="font-bold text-lg">DESTINO:</span>
          <div className="text-2xl font-bold mt-1">SÃO PAULO - SP</div>
        </div>
        
        <div className="bg-blue-200 p-3 border-2 border-blue-400 rounded text-center">
          <span className="font-bold text-lg">REMETENTE:</span>
          <div className="text-xl font-bold mt-1">EMPRESA XYZ LTDA</div>
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

export default EtiquetaPreview;
