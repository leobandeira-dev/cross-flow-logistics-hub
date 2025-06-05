
import React from 'react';
import EmpresaLogo from './EmpresaLogo';

interface EnhancedReadabilityLayoutProps {
  volumeData: any;
  volumeNumber?: number;
  totalVolumes?: number;
  isMae: boolean;
  isQuimico: boolean;
  displayCidade: string;
  getClassificacaoText: () => string;
  transportadoraLogo?: string;
}

const EnhancedReadabilityLayout: React.FC<EnhancedReadabilityLayoutProps> = ({
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
    <div className="w-full h-full bg-white relative">
      {/* Header with company logo and watermark */}
      <div className="flex justify-between items-start mb-2 pb-2 border-b">
        <div className="flex-1">
          <EmpresaLogo 
            className="max-h-6 object-contain"
            fallbackText="CROSSWMS"
            showWatermark={false}
          />
        </div>
        {transportadoraLogo && (
          <div className="flex-1 text-right">
            <img src={transportadoraLogo} alt="Transportadora" className="max-h-4 object-contain ml-auto" />
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="space-y-2">
        {/* Volume info */}
        <div className="text-center">
          <div className="text-lg font-bold">
            {isMae ? 'ETIQUETA MÃE' : `Vol. ${volumeNumber}/${totalVolumes}`}
          </div>
          <div className="text-xs font-bold">
            ID: {volumeData.id}
          </div>
        </div>

        {/* Origin and destination */}
        <div className="grid grid-cols-1 gap-1 text-xs">
          <div>
            <span className="font-semibold">De:</span> {volumeData.remetente}
          </div>
          <div>
            <span className="font-semibold">Para:</span> {volumeData.destinatario}
          </div>
        </div>

        {/* Address info */}
        <div className="text-xs">
          <div className="font-semibold">{volumeData.endereco}</div>
          <div>{displayCidade}</div>
        </div>

        {/* Weight and classification */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="font-semibold">Peso:</span> {volumeData.pesoTotal}
          </div>
          <div>
            <span className="font-semibold">Tipo:</span> {getClassificacaoText()}
          </div>
        </div>

        {/* Transport info */}
        {volumeData.transportadora && (
          <div className="text-xs">
            <span className="font-semibold">Transp:</span> {volumeData.transportadora}
          </div>
        )}

        {/* Chemical codes if applicable */}
        {isQuimico && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="font-semibold">ONU:</span> {volumeData.codigoONU}
            </div>
            <div>
              <span className="font-semibold">Risco:</span> {volumeData.codigoRisco}
            </div>
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

export default EnhancedReadabilityLayout;
