
import React from 'react';
import EmpresaLogo from './EmpresaLogo';

interface PortraitContrastLayoutProps {
  volumeData: any;
  volumeNumber?: number;
  totalVolumes?: number;
  isMae: boolean;
  isQuimico: boolean;
  displayCidade: string;
  getClassificacaoText: () => string;
  transportadoraLogo?: string;
}

const PortraitContrastLayout: React.FC<PortraitContrastLayoutProps> = ({
  volumeData,
  volumeNumber,
  totalVolumes,
  isMae,
  isQuimico,
  displayCidade,
  getClassificacaoText,
  transportadoraLogo
}) => {
  return (
    <div className="w-full h-full bg-black text-white p-3 relative">
      {/* Header */}
      <div className="text-center mb-4 pb-3 border-b border-white">
        <EmpresaLogo 
          className="max-h-8 object-contain mx-auto mb-2 filter invert"
          fallbackText="CROSSWMS"
          showWatermark={false}
        />
        <div className="text-lg font-bold bg-white text-black px-3 py-1 rounded">
          {isMae ? 'ETIQUETA MÃE' : `VOL ${volumeNumber}/${totalVolumes}`}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* ID */}
        <div className="text-center bg-gray-800 p-2 rounded">
          <div className="text-xs font-bold">IDENTIFICAÇÃO</div>
          <div className="text-lg font-bold">{volumeData.id}</div>
        </div>

        {/* Origin */}
        <div className="bg-blue-900 p-2 rounded">
          <div className="text-xs font-bold mb-1">📤 REMETENTE</div>
          <div className="text-sm font-bold">{volumeData.remetente}</div>
        </div>

        {/* Destination */}
        <div className="bg-green-900 p-2 rounded">
          <div className="text-xs font-bold mb-1">📥 DESTINATÁRIO</div>
          <div className="text-sm font-bold">{volumeData.destinatario}</div>
          <div className="text-sm">{volumeData.endereco}</div>
          <div className="text-lg font-bold">{displayCidade}</div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 gap-2">
          <div className="bg-white text-black p-2 rounded flex justify-between">
            <span className="font-bold">PESO:</span>
            <span className="font-bold">{volumeData.pesoTotal}</span>
          </div>
          <div className="bg-white text-black p-2 rounded flex justify-between">
            <span className="font-bold">TIPO:</span>
            <span className="font-bold">{getClassificacaoText()}</span>
          </div>
          {volumeData.transportadora && (
            <div className="bg-gray-700 p-2 rounded flex justify-between">
              <span className="font-bold">TRANSP:</span>
              <span>{volumeData.transportadora}</span>
            </div>
          )}
        </div>

        {/* Chemical info */}
        {isQuimico && (
          <div className="bg-red-800 p-3 rounded border-2 border-red-400">
            <div className="text-center text-sm font-bold mb-2">⚠️ PRODUTO QUÍMICO ⚠️</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-black p-2 rounded text-center">
                <div className="text-xs font-bold">ONU</div>
                <div className="text-lg font-bold">{volumeData.codigoONU}</div>
              </div>
              <div className="bg-black p-2 rounded text-center">
                <div className="text-xs font-bold">RISCO</div>
                <div className="text-lg font-bold">{volumeData.codigoRisco}</div>
              </div>
            </div>
          </div>
        )}

        {/* Transport logo */}
        {transportadoraLogo && (
          <div className="text-center bg-gray-800 p-2 rounded">
            <img src={transportadoraLogo} alt="Transportadora" className="max-h-4 object-contain mx-auto filter invert" />
          </div>
        )}
      </div>

      {/* Watermark */}
      <div className="absolute bottom-1 right-1 text-xs text-gray-400 opacity-50 font-light">
        crosswms.com.br
      </div>
    </div>
  );
};

export default PortraitContrastLayout;
