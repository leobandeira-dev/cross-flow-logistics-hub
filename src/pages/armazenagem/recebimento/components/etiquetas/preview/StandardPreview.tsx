
import React from 'react';
import { QrCode, Biohazard, TestTube } from 'lucide-react';

interface StandardPreviewProps {
  tipoEtiqueta: 'volume' | 'mae';
  isQuimico: boolean;
}

const StandardPreview: React.FC<StandardPreviewProps> = ({ tipoEtiqueta, isQuimico }) => (
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

export default StandardPreview;
