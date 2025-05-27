
import React from 'react';
import { QrCode, Biohazard, TestTube } from 'lucide-react';
import { EtiquetaLayoutProps } from './types';

interface PortraitBlackContrastLayoutProps extends EtiquetaLayoutProps {
  transportadoraLogo?: string;
  color?: 'blue' | 'green' | 'red' | 'purple';
}

const PortraitBlackContrastLayout: React.FC<PortraitBlackContrastLayoutProps> = ({
  volumeData,
  volumeNumber,
  totalVolumes,
  isMae,
  isQuimico,
  displayCidade,
  getClassificacaoText,
  transportadoraLogo,
  color = 'blue'
}) => {
  const colorConfig = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    red: 'bg-red-50',
    purple: 'bg-purple-50'
  };

  return (
    <div className={`h-full flex flex-col p-4 space-y-4 ${colorConfig[color]}`}>
      {/* Header - Tipo de Etiqueta */}
      <div className={`text-center py-3 px-4 rounded-lg shadow-lg ${isMae ? 'bg-red-800 text-white' : `bg-${color}-700 text-white`}`}>
        <span className="text-xl font-black">
          {isMae ? 'ETIQUETA MÃE' : `VOLUME ${volumeNumber}/${totalVolumes}`}
        </span>
      </div>

      {/* Logo da Transportadora */}
      {transportadoraLogo && (
        <div className="flex justify-center py-2">
          <div className="bg-white p-2 rounded-lg shadow-md" style={{ width: '90mm', height: '25mm' }}>
            <img 
              src={transportadoraLogo} 
              alt="Logo Transportadora" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* QR Code Section - Reduzido */}
      <div className="flex justify-center py-1">
        <div className="text-center bg-white p-2 rounded-lg shadow-md">
          <QrCode size={45} className="mx-auto mb-1" />
          <div className={`text-xs font-bold text-${color}-800`}>{volumeData.id}</div>
        </div>
      </div>

      {/* Nota Fiscal - CONTAINER PRETO */}
      <div className="bg-black border-4 border-gray-800 rounded-xl p-5 text-center shadow-lg">
        <div className="text-lg text-white font-black">NOTA FISCAL</div>
        <div className="text-5xl font-black text-white mt-2 tracking-wider">{volumeData.notaFiscal || 'N/A'}</div>
      </div>

      {/* Cidade Destino - CONTAINER PRETO */}
      <div className="bg-black border-4 border-gray-800 rounded-xl p-5 text-center shadow-lg">
        <div className="text-lg text-white font-black">CIDADE DESTINO</div>
        <div className="text-4xl font-black text-white mt-2 leading-tight">{displayCidade}</div>
        <div className="text-3xl font-black text-white mt-1">{volumeData.uf}</div>
      </div>

      {/* Remetente - CONTAINER PRETO */}
      <div className="bg-black border-4 border-gray-800 rounded-xl p-5 shadow-lg">
        <div className="text-lg text-white font-black">REMETENTE</div>
        <div className="text-3xl font-black text-white leading-tight mt-2">{volumeData.remetente || 'N/A'}</div>
      </div>

      {/* Quantidade de Volumes - CONTAINER PRETO (para etiqueta mãe) */}
      {isMae && (
        <div className="bg-black border-4 border-gray-800 rounded-xl p-5 text-center shadow-lg">
          <div className="text-lg text-white font-black">QUANTIDADE DE VOLUMES</div>
          <div className="text-5xl font-black text-white mt-2">{volumeData.quantidade || '0'}</div>
        </div>
      )}

      {/* Destinatário - Mantido com cor original */}
      <div className={`bg-${color}-100 border-2 border-${color}-500 rounded-lg p-3 shadow-md`}>
        <div className={`text-sm text-${color}-700 font-bold`}>DESTINATÁRIO</div>
        <div className={`text-lg font-bold text-${color}-900 leading-tight`}>{volumeData.destinatario || 'N/A'}</div>
      </div>

      {/* Informações Adicionais - Compactadas */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className={`bg-${color}-50 border border-${color}-300 p-2 rounded`}>
          <span className={`text-${color}-600 font-medium`}>Peso:</span>
          <div className={`font-bold text-${color}-800`}>{volumeData.pesoTotal}</div>
        </div>
        <div className={`bg-${color}-50 border border-${color}-300 p-2 rounded`}>
          <span className={`text-${color}-600 font-medium`}>Transp:</span>
          <div className={`font-bold text-${color}-800 text-xs`}>{volumeData.transportadora || 'N/D'}</div>
        </div>
      </div>

      {/* Produto Químico - Compactado */}
      {isQuimico && (
        <div className="bg-red-100 border-2 border-red-500 rounded p-2">
          <div className="flex items-center justify-center mb-1">
            <Biohazard size={16} className="text-red-600 mr-1" />
            <span className="text-sm font-bold text-red-600">PRODUTO QUÍMICO</span>
            <TestTube size={14} className="text-red-600 ml-1" />
          </div>
          <div className="text-center text-xs">
            <div><span className="font-bold">ONU:</span> {volumeData.codigoONU || 'N/A'}</div>
            <div><span className="font-bold">RISCO:</span> {volumeData.codigoRisco || 'N/A'}</div>
            <div><span className="font-bold">CLASS:</span> {getClassificacaoText()}</div>
          </div>
        </div>
      )}

      {/* Endereço - Compactado (se houver espaço) */}
      {volumeData.endereco && (
        <div className={`text-xs text-${color}-600 text-center border-t pt-1`}>
          <span className="font-medium">End:</span> {volumeData.endereco}
        </div>
      )}
    </div>
  );
};

export default PortraitBlackContrastLayout;
