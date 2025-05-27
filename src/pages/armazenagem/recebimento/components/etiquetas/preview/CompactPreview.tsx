
import React from 'react';
import { QrCode, Biohazard, TestTube } from 'lucide-react';

interface CompactPreviewProps {
  tipoEtiqueta: 'volume' | 'mae';
  isQuimico: boolean;
}

const CompactPreview: React.FC<CompactPreviewProps> = ({ tipoEtiqueta, isQuimico }) => (
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

export default CompactPreview;
