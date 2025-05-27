
import React from 'react';
import { QrCode, Biohazard, TestTube } from 'lucide-react';
import { EtiquetaLayoutProps } from './types';

const PortraitBlueLayout: React.FC<EtiquetaLayoutProps> = ({
  volumeData,
  volumeNumber,
  totalVolumes,
  isMae,
  isQuimico,
  displayCidade,
  getClassificacaoText
}) => {
  return (
    <div className="h-full flex flex-col p-4 space-y-4 bg-blue-50">
      {/* Header - Tipo de Etiqueta */}
      <div className={`text-center py-3 px-4 rounded-lg shadow-lg ${isMae ? 'bg-blue-800 text-white' : 'bg-blue-700 text-white'}`}>
        <span className="text-xl font-black">
          {isMae ? 'ETIQUETA MÃE' : `VOLUME ${volumeNumber}/${totalVolumes}`}
        </span>
      </div>

      {/* QR Code Section - Reduzido */}
      <div className="flex justify-center py-1">
        <div className="text-center bg-white p-2 rounded-lg shadow-md">
          <QrCode size={50} className="mx-auto mb-1" />
          <div className="text-xs font-bold text-blue-800">{volumeData.id}</div>
        </div>
      </div>

      {/* Nota Fiscal - DESTAQUE MÁXIMO */}
      <div className="bg-blue-100 border-4 border-blue-600 rounded-xl p-5 text-center shadow-lg">
        <div className="text-lg text-blue-800 font-black">NOTA FISCAL</div>
        <div className="text-5xl font-black text-blue-900 mt-2 tracking-wider">{volumeData.notaFiscal || 'N/A'}</div>
      </div>

      {/* Cidade Destino - DESTAQUE MÁXIMO */}
      <div className="bg-blue-200 border-4 border-blue-700 rounded-xl p-5 text-center shadow-lg">
        <div className="text-lg text-blue-800 font-black">CIDADE DESTINO</div>
        <div className="text-4xl font-black text-blue-900 mt-2 leading-tight">{displayCidade}</div>
        <div className="text-3xl font-black text-blue-800 mt-1">{volumeData.uf}</div>
      </div>

      {/* Remetente - DESTAQUE MÁXIMO */}
      <div className="bg-blue-300 border-4 border-blue-800 rounded-xl p-5 shadow-lg">
        <div className="text-lg text-blue-900 font-black">REMETENTE</div>
        <div className="text-3xl font-black text-blue-900 leading-tight mt-2">{volumeData.remetente || 'N/A'}</div>
      </div>

      {/* Quantidade de Volumes - DESTAQUE MÁXIMO (para etiqueta mãe) */}
      {isMae && (
        <div className="bg-blue-400 border-4 border-blue-900 rounded-xl p-5 text-center shadow-lg">
          <div className="text-lg text-blue-900 font-black">QUANTIDADE DE VOLUMES</div>
          <div className="text-5xl font-black text-blue-900 mt-2">{volumeData.quantidade || '0'}</div>
        </div>
      )}

      {/* Destinatário - Mantido visível */}
      <div className="bg-blue-100 border-2 border-blue-500 rounded-lg p-3 shadow-md">
        <div className="text-sm text-blue-700 font-bold">DESTINATÁRIO</div>
        <div className="text-lg font-bold text-blue-900 leading-tight">{volumeData.destinatario || 'N/A'}</div>
      </div>

      {/* Informações Adicionais - Compactadas */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="bg-blue-50 border border-blue-300 p-2 rounded">
          <span className="text-blue-600 font-medium">Peso:</span>
          <div className="font-bold text-blue-800">{volumeData.pesoTotal}</div>
        </div>
        <div className="bg-blue-50 border border-blue-300 p-2 rounded">
          <span className="text-blue-600 font-medium">Transp:</span>
          <div className="font-bold text-blue-800 text-xs">{volumeData.transportadora || 'N/D'}</div>
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
        <div className="text-xs text-blue-600 text-center border-t pt-1">
          <span className="font-medium">End:</span> {volumeData.endereco}
        </div>
      )}
    </div>
  );
};

export default PortraitBlueLayout;
