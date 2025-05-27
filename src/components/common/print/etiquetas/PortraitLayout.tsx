
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
    <div className="h-full flex flex-col p-4 space-y-4">
      {/* Header - Tipo de Etiqueta */}
      <div className={`text-center py-3 px-4 rounded ${isMae ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'}`}>
        <span className="text-xl font-bold">
          {isMae ? 'ETIQUETA MÃE' : `VOLUME ${volumeNumber}/${totalVolumes}`}
        </span>
      </div>

      {/* QR Code Section - Reduzido */}
      <div className="flex justify-center py-1">
        <div className="text-center">
          <QrCode size={60} className="mx-auto mb-1" />
          <div className="text-xs font-medium">{volumeData.id}</div>
        </div>
      </div>

      {/* Nota Fiscal - DESTAQUE AUMENTADO */}
      <div className="bg-yellow-100 border-4 border-yellow-500 rounded-lg p-4 text-center shadow-md">
        <div className="text-base text-gray-700 font-semibold">NOTA FISCAL</div>
        <div className="text-4xl font-black text-gray-900 mt-1">{volumeData.notaFiscal || 'N/A'}</div>
      </div>

      {/* Cidade Destino - DESTAQUE AUMENTADO */}
      <div className="bg-green-100 border-4 border-green-500 rounded-lg p-4 text-center shadow-md">
        <div className="text-base text-gray-700 font-semibold">CIDADE DESTINO</div>
        <div className="text-3xl font-black text-gray-900 mt-1 leading-tight">{displayCidade}</div>
        <div className="text-2xl font-bold text-gray-700 mt-1">{volumeData.uf}</div>
      </div>

      {/* Remetente - DESTAQUE AUMENTADO */}
      <div className="bg-blue-100 border-4 border-blue-500 rounded-lg p-4 shadow-md">
        <div className="text-base text-gray-700 font-semibold">REMETENTE</div>
        <div className="text-2xl font-black text-gray-900 leading-tight mt-1">{volumeData.remetente || 'N/A'}</div>
      </div>

      {/* Quantidade de Volumes - DESTAQUE AUMENTADO (para etiqueta mãe) */}
      {isMae && (
        <div className="bg-purple-100 border-4 border-purple-500 rounded-lg p-4 text-center shadow-md">
          <div className="text-base text-gray-700 font-semibold">QUANTIDADE DE VOLUMES</div>
          <div className="text-4xl font-black text-gray-900 mt-1">{volumeData.quantidade || '0'}</div>
        </div>
      )}

      {/* Destinatário - Mantido visível */}
      <div className="bg-purple-100 border-3 border-purple-400 rounded-lg p-3">
        <div className="text-sm text-gray-600 font-medium">DESTINATÁRIO</div>
        <div className="text-lg font-bold text-gray-900 leading-tight">{volumeData.destinatario || 'N/A'}</div>
      </div>

      {/* Informações Adicionais - Compactadas */}
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
        <div className="text-xs text-gray-600 text-center border-t pt-1">
          <span className="font-medium">End:</span> {volumeData.endereco}
        </div>
      )}
    </div>
  );
};

export default PortraitLayout;
