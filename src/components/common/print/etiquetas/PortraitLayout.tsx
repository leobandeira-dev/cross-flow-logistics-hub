
import React from 'react';
import { QrCode, Biohazard, TestTube } from 'lucide-react';
import { EtiquetaLayoutProps } from './types';

const PortraitLayout: React.FC<EtiquetaLayoutProps> = ({
  volumeData,
  volumeNumber,
  totalVolumes,
  isMae,
  isQuimico,
  displayCidade,
  getClassificacaoText
}) => {
  return (
    <div className="h-full flex flex-col p-4 space-y-3">
      {/* Header - Tipo de Etiqueta */}
      <div className={`text-center py-2 px-3 rounded ${isMae ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'}`}>
        <span className="text-lg font-bold">
          {isMae ? 'ETIQUETA MÃE' : `VOLUME ${volumeNumber}/${totalVolumes}`}
        </span>
      </div>

      {/* QR Code Section */}
      <div className="flex justify-center py-2">
        <div className="text-center">
          <QrCode size={80} className="mx-auto mb-2" />
          <div className="text-sm font-medium">{volumeData.id}</div>
        </div>
      </div>

      {/* Nota Fiscal - DESTAQUE */}
      <div className="bg-yellow-100 border-2 border-yellow-400 rounded p-3 text-center">
        <div className="text-sm text-gray-600">NOTA FISCAL</div>
        <div className="text-2xl font-bold text-gray-900">{volumeData.notaFiscal || 'N/A'}</div>
      </div>

      {/* Cidade Destino - DESTAQUE */}
      <div className="bg-green-100 border-2 border-green-400 rounded p-3 text-center">
        <div className="text-sm text-gray-600">CIDADE DESTINO</div>
        <div className="text-xl font-bold text-gray-900">{displayCidade}</div>
        <div className="text-lg font-semibold text-gray-700">{volumeData.uf}</div>
      </div>

      {/* Remetente - DESTAQUE */}
      <div className="bg-blue-100 border-2 border-blue-400 rounded p-3">
        <div className="text-sm text-gray-600 font-medium">REMETENTE</div>
        <div className="text-lg font-bold text-gray-900 leading-tight">{volumeData.remetente || 'N/A'}</div>
      </div>

      {/* Destinatário - DESTAQUE */}
      <div className="bg-purple-100 border-2 border-purple-400 rounded p-3">
        <div className="text-sm text-gray-600 font-medium">DESTINATÁRIO</div>
        <div className="text-lg font-bold text-gray-900 leading-tight">{volumeData.destinatario || 'N/A'}</div>
      </div>

      {/* Informações Adicionais */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-gray-100 p-2 rounded">
          <span className="text-gray-600">Peso:</span>
          <div className="font-semibold">{volumeData.pesoTotal}</div>
        </div>
        <div className="bg-gray-100 p-2 rounded">
          <span className="text-gray-600">Transp:</span>
          <div className="font-semibold text-xs">{volumeData.transportadora || 'N/D'}</div>
        </div>
      </div>

      {/* Produto Químico */}
      {isQuimico && (
        <div className="bg-red-100 border-2 border-red-500 rounded p-2">
          <div className="flex items-center justify-center mb-1">
            <Biohazard size={20} className="text-red-600 mr-2" />
            <span className="text-sm font-bold text-red-600">PRODUTO QUÍMICO</span>
            <TestTube size={16} className="text-red-600 ml-2" />
          </div>
          <div className="text-center text-xs">
            <div><span className="font-bold">ONU:</span> {volumeData.codigoONU || 'N/A'}</div>
            <div><span className="font-bold">RISCO:</span> {volumeData.codigoRisco || 'N/A'}</div>
            <div><span className="font-bold">CLASS:</span> {getClassificacaoText()}</div>
          </div>
        </div>
      )}

      {/* Endereço (se houver espaço) */}
      {volumeData.endereco && (
        <div className="text-xs text-gray-600 text-center border-t pt-1">
          <span className="font-medium">End:</span> {volumeData.endereco}
        </div>
      )}
    </div>
  );
};

export default PortraitLayout;
