
import React from 'react';
import { QrCode, Biohazard, TestTube } from 'lucide-react';
import QRCodeGenerator from '../QRCodeGenerator';
import { EtiquetaLayoutProps } from './types';

interface PortraitContrastLayoutProps extends EtiquetaLayoutProps {
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
    <div className="h-full flex flex-col p-4 space-y-4 bg-gray-50">
      {/* Header - Tipo de Etiqueta */}
      <div className={`text-center py-4 px-6 rounded-lg shadow-lg ${isMae ? 'bg-red-800 text-white' : 'bg-blue-700 text-white'}`}>
        <span className="text-2xl font-black">
          {isMae ? 'ETIQUETA MÃE' : `VOLUME ${volumeNumber}/${totalVolumes}`}
        </span>
      </div>

      {/* Logo da Transportadora */}
      {transportadoraLogo && (
        <div className="flex justify-center py-3">
          <div className="bg-white p-3 rounded-lg shadow-md border" style={{ width: '120px', height: '40px' }}>
            <img 
              src={transportadoraLogo} 
              alt="Logo Transportadora" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {/* QR Code Section */}
      <div className="flex justify-center py-3">
        <div className="text-center bg-white p-4 rounded-lg shadow-md">
          <QRCodeGenerator text={volumeData.id} size={80} />
          <div className="text-base font-bold mt-2">{volumeData.id}</div>
        </div>
      </div>

      {/* Nota Fiscal - CONTAINER PRETO */}
      <div className="bg-black border-4 border-gray-800 rounded-xl p-6 text-center shadow-lg">
        <div className="text-xl text-white font-black">NOTA FISCAL</div>
        <div className="text-6xl font-black text-white mt-4 tracking-wider">{volumeData.notaFiscal || 'N/A'}</div>
      </div>

      {/* Cidade Destino - CONTAINER PRETO */}
      <div className="bg-black border-4 border-gray-800 rounded-xl p-6 text-center shadow-lg">
        <div className="text-xl text-white font-black">CIDADE DESTINO</div>
        <div className="text-5xl font-black text-white mt-4 leading-tight">{displayCidade}</div>
        <div className="text-4xl font-black text-white mt-3">{volumeData.uf}</div>
      </div>

      {/* Remetente - CONTAINER PRETO */}
      <div className="bg-black border-4 border-gray-800 rounded-xl p-6 shadow-lg">
        <div className="text-xl text-white font-black">REMETENTE</div>
        <div className="text-4xl font-black text-white leading-tight mt-4">{volumeData.remetente || 'N/A'}</div>
      </div>

      {/* Quantidade de Volumes - CONTAINER PRETO (para etiqueta mãe) */}
      {isMae && (
        <div className="bg-black border-4 border-gray-800 rounded-xl p-6 text-center shadow-lg">
          <div className="text-xl text-white font-black">QUANTIDADE DE VOLUMES</div>
          <div className="text-6xl font-black text-white mt-4">{volumeData.quantidade || '0'}</div>
        </div>
      )}

      {/* Destinatário */}
      <div className="bg-blue-100 border-2 border-blue-500 rounded-lg p-4 shadow-md">
        <div className="text-sm text-blue-700 font-bold">DESTINATÁRIO</div>
        <div className="text-lg font-bold text-blue-900 leading-tight mt-1">{volumeData.destinatario || 'N/A'}</div>
      </div>

      {/* Informações Adicionais */}
      <div className="grid grid-cols-2 gap-3 text-base">
        <div className="bg-gray-100 border border-gray-300 p-3 rounded">
          <span className="text-gray-600 font-medium">Peso:</span>
          <div className="font-bold text-gray-800 text-lg">{volumeData.pesoTotal}</div>
        </div>
        <div className="bg-gray-100 border border-gray-300 p-3 rounded">
          <span className="text-gray-600 font-medium">Transp:</span>
          <div className="font-bold text-gray-800 text-sm">{volumeData.transportadora || 'N/D'}</div>
        </div>
      </div>

      {/* Produto Químico */}
      {isQuimico && (
        <div className="bg-red-100 border-2 border-red-500 rounded p-3">
          <div className="flex items-center justify-center mb-2">
            <Biohazard size={18} className="text-red-600 mr-2" />
            <span className="text-base font-bold text-red-600">PRODUTO QUÍMICO</span>
            <TestTube size={16} className="text-red-600 ml-2" />
          </div>
          <div className="text-center text-sm">
            <div><span className="font-bold">ONU:</span> {volumeData.codigoONU || 'N/A'}</div>
            <div><span className="font-bold">RISCO:</span> {volumeData.codigoRisco || 'N/A'}</div>
            <div><span className="font-bold">CLASS:</span> {getClassificacaoText()}</div>
          </div>
        </div>
      )}

      {/* Endereço */}
      {volumeData.endereco && (
        <div className="text-sm text-gray-600 text-center border-t pt-2">
          <span className="font-medium">End:</span> {volumeData.endereco}
        </div>
      )}
    </div>
  );
};

export default PortraitContrastLayout;
