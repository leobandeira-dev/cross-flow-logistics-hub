
import React from 'react';
import { QrCode, Biohazard, TestTube } from 'lucide-react';
import QRCodeGenerator from '../QRCodeGenerator';
import { EtiquetaLayoutProps } from './types';

interface PortraitLayoutProps extends EtiquetaLayoutProps {
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
    <div className="h-full flex flex-col p-4 space-y-4">
      {/* Ícone químico se aplicável */}
      {isQuimico && (
        <div className="absolute top-3 right-3 text-red-600 text-3xl">⚠</div>
      )}
      
      {/* Header */}
      <div className={`text-center p-3 rounded ${isMae ? 'bg-red-500' : 'bg-blue-600'} text-white`}>
        <span className="text-lg font-bold">
          {isMae ? 'ETIQUETA MÃE' : 'ETIQUETA DE VOLUME'}
        </span>
      </div>
      
      {/* Logo da Transportadora */}
      {transportadoraLogo && (
        <div className="flex justify-center">
          <img 
            src={transportadoraLogo} 
            alt="Logo Transportadora" 
            className="object-contain"
            style={{ width: 'auto', height: '32px', maxWidth: '120px' }}
          />
        </div>
      )}
      
      {/* QR Code */}
      <div className="text-center">
        <QRCodeGenerator text={volumeData.id} size={100} />
        <div className="text-sm mt-2 font-bold">{volumeData.id}</div>
      </div>
      
      {/* Nota Fiscal - DESTAQUE */}
      <div className="bg-yellow-100 border-3 border-yellow-500 rounded-lg p-3 text-center">
        <div className="text-xs text-yellow-700">NOTA FISCAL</div>
        <div className="text-2xl font-bold text-yellow-900">{volumeData.notaFiscal || 'N/A'}</div>
      </div>
      
      {/* Cidade Destino - DESTAQUE */}
      <div className="bg-green-100 border-3 border-green-500 rounded-lg p-3 text-center">
        <div className="text-xs text-green-700">CIDADE DESTINO</div>
        <div className="text-xl font-bold text-green-900">{displayCidade || 'N/A'}</div>
        <div className="text-lg font-semibold text-green-800">{volumeData.uf || 'N/A'}</div>
      </div>
      
      {/* Remetente - DESTAQUE */}
      <div className="bg-blue-100 border-3 border-blue-500 rounded-lg p-3">
        <div className="text-xs text-blue-700 font-semibold">REMETENTE</div>
        <div className="text-lg font-bold text-blue-900 leading-tight">{volumeData.remetente || 'N/A'}</div>
      </div>
      
      {/* Destinatário */}
      <div className="bg-purple-100 border-3 border-purple-500 rounded-lg p-3">
        <div className="text-xs text-purple-700 font-semibold">DESTINATÁRIO</div>
        <div className="text-lg font-bold text-purple-900 leading-tight">{volumeData.destinatario || 'N/A'}</div>
      </div>
      
      {/* Informações Adicionais */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-100 p-2 rounded">
          <span className="text-xs text-gray-600">Peso:</span>
          <div className="text-sm font-semibold">{volumeData.pesoTotal || '0 Kg'}</div>
        </div>
        <div className="bg-gray-100 p-2 rounded">
          <span className="text-xs text-gray-600">Transp:</span>
          <div className="text-xs font-semibold">{volumeData.transportadora || 'N/D'}</div>
        </div>
      </div>
      
      {isQuimico && (
        <div className="bg-red-100 border-3 border-red-500 rounded-lg p-3 mt-auto">
          <div className="text-center mb-2">
            <span className="text-sm font-bold text-red-600">⚠ PRODUTO QUÍMICO ⚠</span>
          </div>
          <div className="text-center text-xs">
            <div><span className="font-bold">ONU:</span> {volumeData.codigoONU || 'N/A'}</div>
            <div><span className="font-bold">RISCO:</span> {volumeData.codigoRisco || 'N/A'}</div>
            <div><span className="font-bold">CLASS:</span> {getClassificacaoText()}</div>
          </div>
        </div>
      )}
      
      {volumeData.endereco && (
        <div className="text-xs text-gray-600 text-center border-t pt-2 mt-auto">
          <span className="font-medium">End:</span> {volumeData.endereco}
        </div>
      )}
      
      {volumeData.descricao && (
        <div className="text-xs mt-2 pt-2 border-t-2 border-gray-300">
          <span className="font-bold">Descrição:</span> {volumeData.descricao}
        </div>
      )}
      
      {/* Quantidade de Volumes - DESTAQUE (para etiqueta mãe) */}
      {isMae && (
        <div className="bg-purple-100 border-3 border-purple-500 rounded-lg p-3 text-center mt-2">
          <div className="text-xs text-purple-700">TOTAL DE VOLUMES</div>
          <div className="text-2xl font-bold text-purple-900">{volumeData.quantidade || '0'}</div>
        </div>
      )}
    </div>
  );
};

export default PortraitLayout;
