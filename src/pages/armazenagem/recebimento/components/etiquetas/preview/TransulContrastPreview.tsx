
import React from 'react';
import { QrCode, Biohazard, TestTube } from 'lucide-react';
import TransulLogo from '@/components/common/print/etiquetas/TransulLogo';

interface TransulContrastPreviewProps {
  tipoEtiqueta: 'volume' | 'mae';
  isQuimico: boolean;
  transportadoraLogo?: string;
}

const TransulContrastPreview: React.FC<TransulContrastPreviewProps> = ({ tipoEtiqueta, isQuimico, transportadoraLogo }) => {
  return (
    <div className="border-2 border-gray-600 bg-white relative min-h-[220px] w-[300px] overflow-hidden">
      {/* Header preto com logos */}
      <div className="bg-black text-white p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-4 bg-white rounded text-xs flex items-center justify-center text-black font-bold">L</div>
          <TransulLogo 
            className="object-contain bg-white p-1 rounded"
            style={{ width: '50px', height: '16px' }}
          />
        </div>
        <div className="text-xs font-bold">
          {tipoEtiqueta === 'mae' ? 'ETIQUETA MÃE' : 'VOLUME 1/2'}
        </div>
      </div>

      <div className="p-3 space-y-2">
        <div className="grid grid-cols-3 gap-2">
          {/* QR Code */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-1 rounded border-2 border-black">
              <QrCode size={20} className="mx-auto" />
            </div>
            <div className="text-xs font-bold mt-1">VOL001</div>
          </div>

          {/* Nota Fiscal - CONTAINER PRETO */}
          <div className="bg-black border-2 border-gray-800 rounded p-2 text-center">
            <div className="text-xs text-white font-bold">NF</div>
            <div className="text-lg font-black text-white">123456</div>
          </div>

          {/* Cidade Destino - CONTAINER PRETO */}
          <div className="bg-black border-2 border-gray-800 rounded p-2 text-center">
            <div className="text-xs text-white font-bold">DESTINO</div>
            <div className="text-sm font-black text-white">SÃO PAULO</div>
            <div className="text-xs font-bold text-white">SP</div>
          </div>
        </div>

        {/* Remetente e Destinatário */}
        <div className="grid grid-cols-2 gap-2">
          {/* Remetente - CONTAINER PRETO */}
          <div className="bg-black border-2 border-gray-800 rounded p-2">
            <div className="text-xs text-white font-bold">REMETENTE</div>
            <div className="text-sm font-bold text-white leading-tight">EMPRESA XYZ</div>
          </div>

          <div className="bg-gray-200 border border-gray-600 rounded p-2">
            <div className="text-xs text-gray-700 font-bold">DESTINATÁRIO</div>
            <div className="text-sm font-bold text-gray-900 leading-tight">CLIENTE ABC</div>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-gray-100 border border-gray-400 rounded p-1">
            <span className="text-gray-600 font-bold">Peso:</span>
            <div className="font-bold text-gray-900">25.5 Kg</div>
          </div>
          <div className="bg-gray-100 border border-gray-400 rounded p-1">
            <span className="text-gray-600 font-bold">Área:</span>
            <div className="font-bold text-gray-900">A1-B2</div>
          </div>
        </div>

        {/* Produto Químico */}
        {isQuimico && (
          <div className="bg-red-600 border-2 border-red-800 rounded p-2 text-white">
            <div className="flex items-center justify-center space-x-1">
              <TestTube size={10} className="text-white" />
              <span className="text-xs font-bold">QUÍMICO</span>
              <Biohazard size={10} className="text-white" />
            </div>
            <div className="text-center text-xs mt-1">ONU: 1234</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransulContrastPreview;
