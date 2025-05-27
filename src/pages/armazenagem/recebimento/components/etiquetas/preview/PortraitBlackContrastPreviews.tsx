
import React from 'react';
import { QrCode, Biohazard } from 'lucide-react';

interface PortraitBlackContrastPreviewProps {
  tipoEtiqueta: 'volume' | 'mae';
  isQuimico: boolean;
  color: 'blue' | 'green' | 'red' | 'purple';
  transportadoraLogo?: string;
}

const colorConfig = {
  blue: {
    border: 'border-blue-600',
    bg: 'bg-blue-50',
    header: 'bg-blue-700',
    text: 'text-blue-800 text-blue-900'
  },
  green: {
    border: 'border-green-600',
    bg: 'bg-green-50',
    header: 'bg-green-700',
    text: 'text-green-800 text-green-900'
  },
  red: {
    border: 'border-red-600',
    bg: 'bg-red-50',
    header: 'bg-red-700',
    text: 'text-red-800 text-red-900'
  },
  purple: {
    border: 'border-purple-600',
    bg: 'bg-purple-50',
    header: 'bg-purple-700',
    text: 'text-purple-800 text-purple-900'
  }
};

export const PortraitBlackContrastBluePreview: React.FC<Pick<PortraitBlackContrastPreviewProps, 'tipoEtiqueta' | 'isQuimico' | 'transportadoraLogo'>> = ({ tipoEtiqueta, isQuimico, transportadoraLogo }) => {
  const config = colorConfig.blue;
  return (
    <div className={`p-3 border-2 ${config.border} ${config.bg} relative min-h-[300px] w-[200px]`}>
      <div className="flex flex-col space-y-2 h-full">
        <div className={`text-center py-1 px-2 rounded text-white text-xs font-bold ${config.header}`}>
          {tipoEtiqueta === 'mae' ? 'ETIQUETA MÃE' : 'VOLUME 1/2'}
        </div>
        
        {transportadoraLogo && (
          <div className="flex justify-center py-1">
            <div className="bg-white p-1 rounded text-xs text-center border">
              Logo 90x25mm
            </div>
          </div>
        )}
        
        <div className="flex justify-center py-1">
          <div className="bg-white p-1 rounded">
            <QrCode size={16} className="mx-auto" />
          </div>
        </div>
        
        {/* Nota Fiscal - CONTAINER PRETO */}
        <div className="bg-black border-2 border-gray-800 rounded p-2 text-center shadow-md">
          <div className="text-xs font-bold text-white">NOTA FISCAL</div>
          <div className="text-lg font-black text-white">123456</div>
        </div>
        
        {/* Cidade Destino - CONTAINER PRETO */}
        <div className="bg-black border-2 border-gray-800 rounded p-2 text-center shadow-md">
          <div className="text-xs font-bold text-white">CIDADE DESTINO</div>
          <div className="text-sm font-black text-white">SÃO PAULO</div>
          <div className="text-xs font-bold text-white">SP</div>
        </div>
        
        {/* Remetente - CONTAINER PRETO */}
        <div className="bg-black border-2 border-gray-800 rounded p-2 shadow-md">
          <div className="text-xs font-bold text-white">REMETENTE</div>
          <div className="text-xs font-black text-white leading-tight">EMPRESA XYZ</div>
        </div>
        
        {tipoEtiqueta === 'mae' && (
          <div className="bg-black border-2 border-gray-800 rounded p-2 text-center shadow-md">
            <div className="text-xs font-bold text-white">QTD VOLUMES</div>
            <div className="text-lg font-black text-white">25</div>
          </div>
        )}
        
        {isQuimico && (
          <div className="bg-red-100 border border-red-500 rounded p-1 mt-auto">
            <div className="flex items-center justify-center">
              <Biohazard size={8} className="text-red-600 mr-1" />
              <span className="text-xs font-bold text-red-600">QUÍMICO</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const PortraitBlackContrastGreenPreview: React.FC<Pick<PortraitBlackContrastPreviewProps, 'tipoEtiqueta' | 'isQuimico' | 'transportadoraLogo'>> = ({ tipoEtiqueta, isQuimico, transportadoraLogo }) => {
  const config = colorConfig.green;
  return (
    <div className={`p-3 border-2 ${config.border} ${config.bg} relative min-h-[300px] w-[200px]`}>
      <div className="flex flex-col space-y-2 h-full">
        <div className={`text-center py-1 px-2 rounded text-white text-xs font-bold ${config.header}`}>
          {tipoEtiqueta === 'mae' ? 'ETIQUETA MÃE' : 'VOLUME 1/2'}
        </div>
        
        {transportadoraLogo && (
          <div className="flex justify-center py-1">
            <div className="bg-white p-1 rounded text-xs text-center border">
              Logo 90x25mm
            </div>
          </div>
        )}
        
        <div className="flex justify-center py-1">
          <div className="bg-white p-1 rounded">
            <QrCode size={16} className="mx-auto" />
          </div>
        </div>
        
        <div className="bg-black border-2 border-gray-800 rounded p-2 text-center shadow-md">
          <div className="text-xs font-bold text-white">NOTA FISCAL</div>
          <div className="text-lg font-black text-white">123456</div>
        </div>
        
        <div className="bg-black border-2 border-gray-800 rounded p-2 text-center shadow-md">
          <div className="text-xs font-bold text-white">CIDADE DESTINO</div>
          <div className="text-sm font-black text-white">SÃO PAULO</div>
          <div className="text-xs font-bold text-white">SP</div>
        </div>
        
        <div className="bg-black border-2 border-gray-800 rounded p-2 shadow-md">
          <div className="text-xs font-bold text-white">REMETENTE</div>
          <div className="text-xs font-black text-white leading-tight">EMPRESA XYZ</div>
        </div>
        
        {tipoEtiqueta === 'mae' && (
          <div className="bg-black border-2 border-gray-800 rounded p-2 text-center shadow-md">
            <div className="text-xs font-bold text-white">QTD VOLUMES</div>
            <div className="text-lg font-black text-white">25</div>
          </div>
        )}
        
        {isQuimico && (
          <div className="bg-red-100 border border-red-500 rounded p-1 mt-auto">
            <div className="flex items-center justify-center">
              <Biohazard size={8} className="text-red-600 mr-1" />
              <span className="text-xs font-bold text-red-600">QUÍMICO</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const PortraitBlackContrastRedPreview: React.FC<Pick<PortraitBlackContrastPreviewProps, 'tipoEtiqueta' | 'isQuimico' | 'transportadoraLogo'>> = ({ tipoEtiqueta, isQuimico, transportadoraLogo }) => {
  const config = colorConfig.red;
  return (
    <div className={`p-3 border-2 ${config.border} ${config.bg} relative min-h-[300px] w-[200px]`}>
      <div className="flex flex-col space-y-2 h-full">
        <div className={`text-center py-1 px-2 rounded text-white text-xs font-bold ${config.header}`}>
          {tipoEtiqueta === 'mae' ? 'ETIQUETA MÃE' : 'VOLUME 1/2'}
        </div>
        
        {transportadoraLogo && (
          <div className="flex justify-center py-1">
            <div className="bg-white p-1 rounded text-xs text-center border">
              Logo 90x25mm
            </div>
          </div>
        )}
        
        <div className="flex justify-center py-1">
          <div className="bg-white p-1 rounded">
            <QrCode size={16} className="mx-auto" />
          </div>
        </div>
        
        <div className="bg-black border-2 border-gray-800 rounded p-2 text-center shadow-md">
          <div className="text-xs font-bold text-white">NOTA FISCAL</div>
          <div className="text-lg font-black text-white">123456</div>
        </div>
        
        <div className="bg-black border-2 border-gray-800 rounded p-2 text-center shadow-md">
          <div className="text-xs font-bold text-white">CIDADE DESTINO</div>
          <div className="text-sm font-black text-white">SÃO PAULO</div>
          <div className="text-xs font-bold text-white">SP</div>
        </div>
        
        <div className="bg-black border-2 border-gray-800 rounded p-2 shadow-md">
          <div className="text-xs font-bold text-white">REMETENTE</div>
          <div className="text-xs font-black text-white leading-tight">EMPRESA XYZ</div>
        </div>
        
        {tipoEtiqueta === 'mae' && (
          <div className="bg-black border-2 border-gray-800 rounded p-2 text-center shadow-md">
            <div className="text-xs font-bold text-white">QTD VOLUMES</div>
            <div className="text-lg font-black text-white">25</div>
          </div>
        )}
        
        {isQuimico && (
          <div className="bg-red-100 border border-red-500 rounded p-1 mt-auto">
            <div className="flex items-center justify-center">
              <Biohazard size={8} className="text-red-600 mr-1" />
              <span className="text-xs font-bold text-red-600">QUÍMICO</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const PortraitBlackContrastPurplePreview: React.FC<Pick<PortraitBlackContrastPreviewProps, 'tipoEtiqueta' | 'isQuimico' | 'transportadoraLogo'>> = ({ tipoEtiqueta, isQuimico, transportadoraLogo }) => {
  const config = colorConfig.purple;
  return (
    <div className={`p-3 border-2 ${config.border} ${config.bg} relative min-h-[300px] w-[200px]`}>
      <div className="flex flex-col space-y-2 h-full">
        <div className={`text-center py-1 px-2 rounded text-white text-xs font-bold ${config.header}`}>
          {tipoEtiqueta === 'mae' ? 'ETIQUETA MÃE' : 'VOLUME 1/2'}
        </div>
        
        {transportadoraLogo && (
          <div className="flex justify-center py-1">
            <div className="bg-white p-1 rounded text-xs text-center border">
              Logo 90x25mm
            </div>
          </div>
        )}
        
        <div className="flex justify-center py-1">
          <div className="bg-white p-1 rounded">
            <QrCode size={16} className="mx-auto" />
          </div>
        </div>
        
        <div className="bg-black border-2 border-gray-800 rounded p-2 text-center shadow-md">
          <div className="text-xs font-bold text-white">NOTA FISCAL</div>
          <div className="text-lg font-black text-white">123456</div>
        </div>
        
        <div className="bg-black border-2 border-gray-800 rounded p-2 text-center shadow-md">
          <div className="text-xs font-bold text-white">CIDADE DESTINO</div>
          <div className="text-sm font-black text-white">SÃO PAULO</div>
          <div className="text-xs font-bold text-white">SP</div>
        </div>
        
        <div className="bg-black border-2 border-gray-800 rounded p-2 shadow-md">
          <div className="text-xs font-bold text-white">REMETENTE</div>
          <div className="text-xs font-black text-white leading-tight">EMPRESA XYZ</div>
        </div>
        
        {tipoEtiqueta === 'mae' && (
          <div className="bg-black border-2 border-gray-800 rounded p-2 text-center shadow-md">
            <div className="text-xs font-bold text-white">QTD VOLUMES</div>
            <div className="text-lg font-black text-white">25</div>
          </div>
        )}
        
        {isQuimico && (
          <div className="bg-red-100 border border-red-500 rounded p-1 mt-auto">
            <div className="flex items-center justify-center">
              <Biohazard size={8} className="text-red-600 mr-1" />
              <span className="text-xs font-bold text-red-600">QUÍMICO</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
