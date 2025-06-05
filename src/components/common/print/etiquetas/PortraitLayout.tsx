
import React from 'react';
import EmpresaLogo from './EmpresaLogo';

interface PortraitLayoutProps {
  volumeData: any;
  volumeNumber?: number;
  totalVolumes?: number;
  isMae: boolean;
  isQuimico: boolean;
  displayCidade: string;
  getClassificacaoText: () => string;
  transportadoraLogo?: string;
}

const PortraitLayout: React.FC<PortraitLayoutProps> = ({
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
    <div className="w-full h-full bg-white p-2 relative">
      {/* Header */}
      <div className="text-center mb-3 pb-2 border-b">
        <EmpresaLogo 
          className="max-h-8 object-contain mx-auto mb-1"
          fallbackText="CROSSWMS"
          showWatermark={false}
        />
        <div className="text-sm font-bold">
          {isMae ? 'ETIQUETA MÃE' : `VOLUME ${volumeNumber}/${totalVolumes}`}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* ID */}
        <div className="text-center bg-gray-100 p-2 rounded">
          <div className="text-xs font-semibold">ID:</div>
          <div className="text-sm font-bold">{volumeData.id}</div>
        </div>

        {/* Origin */}
        <div className="bg-blue-50 p-2 rounded">
          <div className="text-xs font-semibold text-blue-800">REMETENTE:</div>
          <div className="text-sm">{volumeData.remetente}</div>
        </div>

        {/* Destination */}
        <div className="bg-green-50 p-2 rounded">
          <div className="text-xs font-semibold text-green-800">DESTINATÁRIO:</div>
          <div className="text-sm">{volumeData.destinatario}</div>
          <div className="text-sm">{volumeData.endereco}</div>
          <div className="text-sm font-semibold">{displayCidade}</div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 gap-2">
          <div className="flex justify-between">
            <span className="text-xs font-semibold">Peso:</span>
            <span className="text-xs">{volumeData.pesoTotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs font-semibold">Tipo:</span>
            <span className="text-xs">{getClassificacaoText()}</span>
          </div>
          {volumeData.transportadora && (
            <div className="flex justify-between">
              <span className="text-xs font-semibold">Transp:</span>
              <span className="text-xs">{volumeData.transportadora}</span>
            </div>
          )}
        </div>

        {/* Chemical info if applicable */}
        {isQuimico && (
          <div className="bg-red-50 p-2 rounded border border-red-200">
            <div className="text-xs font-semibold text-red-800 mb-1">PRODUTO QUÍMICO</div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-xs font-semibold">ONU:</span>
                <div className="text-sm">{volumeData.codigoONU}</div>
              </div>
              <div>
                <span className="text-xs font-semibold">Risco:</span>
                <div className="text-sm">{volumeData.codigoRisco}</div>
              </div>
            </div>
          </div>
        )}

        {/* Transport logo */}
        {transportadoraLogo && (
          <div className="text-center">
            <img src={transportadoraLogo} alt="Transportadora" className="max-h-4 object-contain mx-auto" />
          </div>
        )}
      </div>

      {/* Watermark */}
      <div className="absolute bottom-1 right-1 text-xs text-gray-300 opacity-30 font-light">
        crosswms.com.br
      </div>
    </div>
  );
};

export default PortraitLayout;
