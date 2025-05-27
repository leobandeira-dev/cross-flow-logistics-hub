
import React from 'react';
import { QrCode, Biohazard, TestTube, Package } from 'lucide-react';

interface ModernPreviewProps {
  tipoEtiqueta: 'volume' | 'mae';
  isQuimico: boolean;
}

const ModernPreview: React.FC<ModernPreviewProps> = ({ tipoEtiqueta, isQuimico }) => (
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

export default ModernPreview;
