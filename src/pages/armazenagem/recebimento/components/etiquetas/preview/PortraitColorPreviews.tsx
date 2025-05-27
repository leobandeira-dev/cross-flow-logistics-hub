
import React from 'react';
import { QrCode, Biohazard } from 'lucide-react';

interface PortraitColorPreviewProps {
  tipoEtiqueta: 'volume' | 'mae';
  isQuimico: boolean;
  color: 'blue' | 'green' | 'red' | 'purple';
}

const colorConfig = {
  blue: {
    border: 'border-blue-600',
    bg: 'bg-blue-50',
    header: 'bg-blue-700',
    nf: 'bg-blue-100 border-blue-600 text-blue-800 text-blue-900',
    cidade: 'bg-blue-200 border-blue-700 text-blue-800 text-blue-900',
    remetente: 'bg-blue-300 border-blue-800 text-blue-900',
    volumes: 'bg-blue-400 border-blue-900 text-blue-900'
  },
  green: {
    border: 'border-green-600',
    bg: 'bg-green-50',
    header: 'bg-green-700',
    nf: 'bg-amber-100 border-amber-500 text-amber-800 text-amber-900',
    cidade: 'bg-green-200 border-green-600 text-green-800 text-green-900',
    remetente: 'bg-green-300 border-green-700 text-green-900',
    volumes: 'bg-green-400 border-green-800 text-green-900'
  },
  red: {
    border: 'border-red-600',
    bg: 'bg-red-50',
    header: 'bg-red-700',
    nf: 'bg-yellow-100 border-yellow-500 text-yellow-800 text-yellow-900',
    cidade: 'bg-red-200 border-red-600 text-red-800 text-red-900',
    remetente: 'bg-red-300 border-red-700 text-red-900',
    volumes: 'bg-red-400 border-red-800 text-red-900'
  },
  purple: {
    border: 'border-purple-600',
    bg: 'bg-purple-50',
    header: 'bg-purple-700',
    nf: 'bg-yellow-100 border-yellow-500 text-yellow-800 text-yellow-900',
    cidade: 'bg-purple-200 border-purple-600 text-purple-800 text-purple-900',
    remetente: 'bg-purple-300 border-purple-700 text-purple-900',
    volumes: 'bg-purple-400 border-purple-800 text-purple-900'
  }
};

export const PortraitBluePreview: React.FC<Pick<PortraitColorPreviewProps, 'tipoEtiqueta' | 'isQuimico'>> = ({ tipoEtiqueta, isQuimico }) => {
  const config = colorConfig.blue;
  return (
    <div className={`p-3 border-2 ${config.border} ${config.bg} relative min-h-[300px] w-[200px]`}>
      <div className="flex flex-col space-y-2 h-full">
        <div className={`text-center py-1 px-2 rounded text-white text-xs font-bold ${config.header}`}>
          {tipoEtiqueta === 'mae' ? 'ETIQUETA MÃE' : 'VOLUME 1/2'}
        </div>
        
        <div className="flex justify-center py-1">
          <div className="bg-white p-1 rounded">
            <QrCode size={20} className="mx-auto" />
          </div>
        </div>
        
        <div className={`${config.nf} border-2 rounded p-2 text-center shadow-md`}>
          <div className="text-xs font-bold">NOTA FISCAL</div>
          <div className="text-xl font-black">123456</div>
        </div>
        
        <div className={`${config.cidade} border-2 rounded p-2 text-center shadow-md`}>
          <div className="text-xs font-bold">CIDADE DESTINO</div>
          <div className="text-lg font-black">SÃO PAULO</div>
          <div className="text-sm font-bold">SP</div>
        </div>
        
        <div className={`${config.remetente} border-2 rounded p-2 shadow-md`}>
          <div className="text-xs font-bold">REMETENTE</div>
          <div className="text-sm font-black leading-tight">EMPRESA XYZ</div>
        </div>
        
        {tipoEtiqueta === 'mae' && (
          <div className={`${config.volumes} border-2 rounded p-2 text-center shadow-md`}>
            <div className="text-xs font-bold">QTD VOLUMES</div>
            <div className="text-xl font-black">25</div>
          </div>
        )}
        
        {isQuimico && (
          <div className="bg-red-100 border border-red-500 rounded p-1 mt-auto">
            <div className="flex items-center justify-center">
              <Biohazard size={10} className="text-red-600 mr-1" />
              <span className="text-xs font-bold text-red-600">QUÍMICO</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const PortraitGreenPreview: React.FC<Pick<PortraitColorPreviewProps, 'tipoEtiqueta' | 'isQuimico'>> = ({ tipoEtiqueta, isQuimico }) => {
  const config = colorConfig.green;
  return (
    <div className={`p-3 border-2 ${config.border} ${config.bg} relative min-h-[300px] w-[200px]`}>
      <div className="flex flex-col space-y-2 h-full">
        <div className={`text-center py-1 px-2 rounded text-white text-xs font-bold ${config.header}`}>
          {tipoEtiqueta === 'mae' ? 'ETIQUETA MÃE' : 'VOLUME 1/2'}
        </div>
        
        <div className="flex justify-center py-1">
          <div className="bg-white p-1 rounded">
            <QrCode size={20} className="mx-auto" />
          </div>
        </div>
        
        <div className={`${config.nf} border-2 rounded p-2 text-center shadow-md`}>
          <div className="text-xs font-bold">NOTA FISCAL</div>
          <div className="text-xl font-black">123456</div>
        </div>
        
        <div className={`${config.cidade} border-2 rounded p-2 text-center shadow-md`}>
          <div className="text-xs font-bold">CIDADE DESTINO</div>
          <div className="text-lg font-black">SÃO PAULO</div>
          <div className="text-sm font-bold">SP</div>
        </div>
        
        <div className={`${config.remetente} border-2 rounded p-2 shadow-md`}>
          <div className="text-xs font-bold">REMETENTE</div>
          <div className="text-sm font-black leading-tight">EMPRESA XYZ</div>
        </div>
        
        {tipoEtiqueta === 'mae' && (
          <div className={`${config.volumes} border-2 rounded p-2 text-center shadow-md`}>
            <div className="text-xs font-bold">QTD VOLUMES</div>
            <div className="text-xl font-black">25</div>
          </div>
        )}
        
        {isQuimico && (
          <div className="bg-red-100 border border-red-500 rounded p-1 mt-auto">
            <div className="flex items-center justify-center">
              <Biohazard size={10} className="text-red-600 mr-1" />
              <span className="text-xs font-bold text-red-600">QUÍMICO</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const PortraitRedPreview: React.FC<Pick<PortraitColorPreviewProps, 'tipoEtiqueta' | 'isQuimico'>> = ({ tipoEtiqueta, isQuimico }) => {
  const config = colorConfig.red;
  return (
    <div className={`p-3 border-2 ${config.border} ${config.bg} relative min-h-[300px] w-[200px]`}>
      <div className="flex flex-col space-y-2 h-full">
        <div className={`text-center py-1 px-2 rounded text-white text-xs font-bold ${config.header}`}>
          {tipoEtiqueta === 'mae' ? 'ETIQUETA MÃE' : 'VOLUME 1/2'}
        </div>
        
        <div className="flex justify-center py-1">
          <div className="bg-white p-1 rounded">
            <QrCode size={20} className="mx-auto" />
          </div>
        </div>
        
        <div className={`${config.nf} border-2 rounded p-2 text-center shadow-md`}>
          <div className="text-xs font-bold">NOTA FISCAL</div>
          <div className="text-xl font-black">123456</div>
        </div>
        
        <div className={`${config.cidade} border-2 rounded p-2 text-center shadow-md`}>
          <div className="text-xs font-bold">CIDADE DESTINO</div>
          <div className="text-lg font-black">SÃO PAULO</div>
          <div className="text-sm font-bold">SP</div>
        </div>
        
        <div className={`${config.remetente} border-2 rounded p-2 shadow-md`}>
          <div className="text-xs font-bold">REMETENTE</div>
          <div className="text-sm font-black leading-tight">EMPRESA XYZ</div>
        </div>
        
        {tipoEtiqueta === 'mae' && (
          <div className={`${config.volumes} border-2 rounded p-2 text-center shadow-md`}>
            <div className="text-xs font-bold">QTD VOLUMES</div>
            <div className="text-xl font-black">25</div>
          </div>
        )}
        
        {isQuimico && (
          <div className="bg-orange-100 border border-orange-500 rounded p-1 mt-auto">
            <div className="flex items-center justify-center">
              <Biohazard size={10} className="text-orange-600 mr-1" />
              <span className="text-xs font-bold text-orange-600">QUÍMICO</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const PortraitPurplePreview: React.FC<Pick<PortraitColorPreviewProps, 'tipoEtiqueta' | 'isQuimico'>> = ({ tipoEtiqueta, isQuimico }) => {
  const config = colorConfig.purple;
  return (
    <div className={`p-3 border-2 ${config.border} ${config.bg} relative min-h-[300px] w-[200px]`}>
      <div className="flex flex-col space-y-2 h-full">
        <div className={`text-center py-1 px-2 rounded text-white text-xs font-bold ${config.header}`}>
          {tipoEtiqueta === 'mae' ? 'ETIQUETA MÃE' : 'VOLUME 1/2'}
        </div>
        
        <div className="flex justify-center py-1">
          <div className="bg-white p-1 rounded">
            <QrCode size={20} className="mx-auto" />
          </div>
        </div>
        
        <div className={`${config.nf} border-2 rounded p-2 text-center shadow-md`}>
          <div className="text-xs font-bold">NOTA FISCAL</div>
          <div className="text-xl font-black">123456</div>
        </div>
        
        <div className={`${config.cidade} border-2 rounded p-2 text-center shadow-md`}>
          <div className="text-xs font-bold">CIDADE DESTINO</div>
          <div className="text-lg font-black">SÃO PAULO</div>
          <div className="text-sm font-bold">SP</div>
        </div>
        
        <div className={`${config.remetente} border-2 rounded p-2 shadow-md`}>
          <div className="text-xs font-bold">REMETENTE</div>
          <div className="text-sm font-black leading-tight">EMPRESA XYZ</div>
        </div>
        
        {tipoEtiqueta === 'mae' && (
          <div className={`${config.volumes} border-2 rounded p-2 text-center shadow-md`}>
            <div className="text-xs font-bold">QTD VOLUMES</div>
            <div className="text-xl font-black">25</div>
          </div>
        )}
        
        {isQuimico && (
          <div className="bg-red-100 border border-red-500 rounded p-1 mt-auto">
            <div className="flex items-center justify-center">
              <Biohazard size={10} className="text-red-600 mr-1" />
              <span className="text-xs font-bold text-red-600">QUÍMICO</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
