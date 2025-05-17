
import React from 'react';
import { TestTube, Biohazard } from 'lucide-react';
import QRCodeGenerator from '../QRCodeGenerator';
import { EtiquetaLayoutProps } from './types';

const CompactLayout: React.FC<EtiquetaLayoutProps> = ({
  volumeData,
  volumeNumber,
  totalVolumes,
  isMae,
  isQuimico,
  displayCidade,
  getClassificacaoText
}) => {
  return (
    <div className="grid grid-cols-7 gap-2 text-xs">
      {/* Header - Left: QR Code */}
      <div className="col-span-2 flex flex-col items-center justify-start">
        <QRCodeGenerator text={volumeData.id} size={60} />
        <div className="text-xs mt-1 font-mono truncate w-full text-center">{volumeData.id}</div>
      </div>
      
      {/* Header - Right: NF and Volume info */}
      <div className="col-span-5">
        {/* Highlighted Supplier Info */}
        <div className="bg-blue-100 px-1 py-0.5 rounded mb-1 border border-blue-300">
          <span className="text-xs text-gray-600">FORNECEDOR:</span>
          <span className="font-bold ml-1">{volumeData.remetente || 'N/A'}</span>
        </div>
        
        <div className="flex justify-between items-center mb-1">
          {/* Highlighted NF */}
          <div className="bg-yellow-100 px-1 py-0.5 rounded w-full mr-1 border border-yellow-300">
            <span className="text-xs text-gray-600">NF:</span>
            <span className="font-bold ml-1">{volumeData.notaFiscal || 'N/A'}</span>
          </div>
          <div className="bg-gray-800 text-white px-2 py-0.5 rounded text-center min-w-[40px]">
            <span className="font-bold">{volumeNumber}/{totalVolumes}</span>
          </div>
        </div>
        
        <div className="bg-gray-100 px-1 py-0.5 rounded mb-1">
          <span className="text-xs text-gray-600">TIPO:</span>
          <span className="font-bold ml-1">{isQuimico ? 'QUÍMICO' : 'CARGA GERAL'}</span>
        </div>
        
        <div className="bg-gray-100 px-1 py-0.5 rounded">
          <span className="text-xs text-gray-600">PESO:</span>
          <span className="font-bold ml-1">{volumeData.pesoTotal || '0 Kg'}</span>
        </div>
      </div>
      
      {/* Transportadora */}
      <div className="col-span-7 bg-gray-100 px-1 py-0.5 rounded mt-1 mb-1">
        <span className="text-xs text-gray-600">TRANSPORTADORA:</span>
        <span className="font-bold ml-1">{volumeData.transportadora || "N/D"}</span>
      </div>
      
      {/* Sender and Recipient */}
      <div className="col-span-7 grid grid-cols-2 gap-1 mt-1">
        <div>
          <div className="text-xs text-gray-600">REMETENTE</div>
          <div className="font-semibold truncate">{volumeData.remetente || 'N/A'}</div>
        </div>
        
        <div className="bg-gray-100 px-1 py-0.5 rounded">
          <div className="text-xs text-gray-600">DESTINATÁRIO</div>
          <div className="font-bold truncate">{volumeData.destinatario || 'N/A'}</div>
        </div>
      </div>
      
      {/* Destination - Highlighted City */}
      <div className="col-span-5">
        <div className="text-xs text-gray-600">ENDEREÇO DE DESTINO</div>
        <div className="font-semibold truncate text-xs">{volumeData.endereco || 'N/A'}</div>
        <div className="font-bold mt-0.5 bg-green-100 px-1 py-0.5 rounded border border-green-300">
          {displayCidade}
        </div>
      </div>
      
      <div className="col-span-2 flex items-center justify-center">
        <div className="w-full h-10 border border-black flex items-center justify-center">
          <div className="font-bold text-2xl">{volumeData.uf || 'N/A'}</div>
        </div>
      </div>
      
      {/* Chemical product info if applicable */}
      {isQuimico && (
        <div className="col-span-7 bg-yellow-100 p-1 border border-yellow-500 rounded flex flex-col justify-between items-start mt-1">
          <div>
            <div className="text-xs font-bold">PRODUTO QUÍMICO</div>
            <div className="text-xs">
              <span className="font-bold">ONU:</span> {volumeData.codigoONU || 'N/A'}
              <span className="font-bold ml-2">RISCO:</span> {volumeData.codigoRisco || 'N/A'}
            </div>
            <div className="text-xs mt-1">
              <span className="font-bold">CLASSIFICAÇÃO:</span> {getClassificacaoText()}
            </div>
          </div>
          <div className="self-end">
            <Biohazard size={24} className="text-red-600" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactLayout;
