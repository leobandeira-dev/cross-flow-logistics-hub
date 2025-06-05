
import React from 'react';
import EmpresaLogo from './EmpresaLogo';

interface EnhancedContrastLayoutProps {
  volumeData: any;
  volumeNumber?: number;
  totalVolumes?: number;
  isMae: boolean;
  isQuimico: boolean;
  displayCidade: string;
  getClassificacaoText: () => string;
  transportadoraLogo?: string;
}

const EnhancedContrastLayout: React.FC<EnhancedContrastLayoutProps> = ({
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
    <div className="w-full h-full bg-black text-white p-2 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-2 pb-2 border-b border-white">
        <div className="flex-1">
          <EmpresaLogo 
            className="max-h-6 object-contain filter invert"
            fallbackText="CROSSWMS"
            showWatermark={false}
          />
        </div>
        {transportadoraLogo && (
          <div className="flex-1 text-right">
            <img src={transportadoraLogo} alt="Transportadora" className="max-h-4 object-contain ml-auto filter invert" />
          </div>
        )}
      </div>

      {/* Volume info */}
      <div className="text-center mb-2">
        <div className="text-xl font-bold">
          {isMae ? 'ETIQUETA MÃE' : `VOL ${volumeNumber}/${totalVolumes}`}
        </div>
        <div className="text-sm font-bold bg-white text-black px-2 py-1 rounded">
          {volumeData.id}
        </div>
      </div>

      {/* Main content */}
      <div className="space-y-2">
        {/* Origin and destination */}
        <div className="bg-white text-black p-2 rounded">
          <div className="text-sm font-bold">DE: {volumeData.remetente}</div>
          <div className="text-sm font-bold">PARA: {volumeData.destinatario}</div>
        </div>

        {/* Address */}
        <div className="bg-gray-800 p-2 rounded">
          <div className="text-sm font-bold">{volumeData.endereco}</div>
          <div className="text-lg font-bold">{displayCidade}</div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white text-black p-1 rounded text-center">
            <div className="text-xs font-bold">PESO</div>
            <div className="text-sm">{volumeData.pesoTotal}</div>
          </div>
          <div className="bg-white text-black p-1 rounded text-center">
            <div className="text-xs font-bold">TIPO</div>
            <div className="text-sm">{getClassificacaoText()}</div>
          </div>
        </div>

        {/* Transport info */}
        {volumeData.transportadora && (
          <div className="text-center text-sm">
            <span className="font-bold">TRANSP:</span> {volumeData.transportadora}
          </div>
        )}

        {/* Chemical info */}
        {isQuimico && (
          <div className="bg-red-600 p-2 rounded">
            <div className="text-center text-sm font-bold mb-1">⚠️ PRODUTO QUÍMICO</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center">
                <div className="font-bold">ONU</div>
                <div>{volumeData.codigoONU}</div>
              </div>
              <div className="text-center">
                <div className="font-bold">RISCO</div>
                <div>{volumeData.codigoRisco}</div>
              </div>
            </div>
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

export default EnhancedContrastLayout;
