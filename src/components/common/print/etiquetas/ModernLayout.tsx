
import React from 'react';
import { Package, Truck, TestTube, Biohazard } from 'lucide-react';
import QRCodeGenerator from '../QRCodeGenerator';
import { EtiquetaLayoutProps } from './types';

const ModernLayout: React.FC<EtiquetaLayoutProps> = ({
  volumeData,
  volumeNumber,
  totalVolumes,
  isMae,
  isQuimico,
  displayCidade,
  getClassificacaoText
}) => {
  return (
    <>
      {/* Header bar */}
      <div className={`${isMae ? 'bg-red-500' : 'bg-black'} text-white p-2 flex justify-between items-center`}>
        <div className="flex items-center">
          {isMae ? (
            <Package size={24} className="mr-2" />
          ) : (
            <Truck size={24} className="mr-2" />
          )}
          <div>
            <div className="font-bold">
              {isMae ? 'ETIQUETA MÃE' : 'ETIQUETA DE VOLUME'}
            </div>
            <div className="text-sm">
              {isMae ? `ID: ${volumeData.etiquetaMae}` : `VOL: ${volumeNumber}/${totalVolumes}`}
            </div>
          </div>
        </div>
        <div className="text-right bg-yellow-100 text-black p-1 rounded">
          <div className="text-xs">NF</div>
          <div className="font-bold">{volumeData.notaFiscal || 'N/A'}</div>
        </div>
      </div>
      
      <div className="p-3">
        {/* Highlighted transportadora */}
        <div className="bg-gray-100 p-2 rounded mb-3">
          <div className="text-xs text-gray-600">TRANSPORTADORA</div>
          <div className="font-bold">{volumeData.transportadora || "N/D"}</div>
        </div>
        
        {/* Two column layout for main content */}
        <div className="grid grid-cols-2 gap-4">
          {/* Left column: QR Code and core identification */}
          <div className="flex flex-col space-y-3">
            <div className="flex flex-col items-center">
              <QRCodeGenerator text={volumeData.id} size={100} />
              <div className="text-xs mt-1 font-mono">{volumeData.id}</div>
            </div>
            
            {/* Highlighted Fornecedor */}
            <div className="bg-blue-100 p-2 rounded border border-blue-300">
              <div className="text-xs text-gray-600">FORNECEDOR</div>
              <div className="font-bold text-lg text-center">{volumeData.remetente || 'N/A'}</div>
            </div>
            
            {isQuimico && (
              <div className="bg-yellow-100 p-2 border-2 border-yellow-500 rounded flex items-start space-x-2">
                <Biohazard size={30} className="text-red-600 mt-1" />
                <div>
                  <div className="text-xs font-bold">PRODUTO QUÍMICO</div>
                  <div className="text-xs">
                    <span className="font-bold">ONU:</span> {volumeData.codigoONU || 'N/A'}
                  </div>
                  <div className="text-xs">
                    <span className="font-bold">RISCO:</span> {volumeData.codigoRisco || 'N/A'}
                  </div>
                  <div className="text-xs mt-1 pt-1 border-t border-yellow-400">
                    <span className="font-bold">CLASSIFICAÇÃO:</span> {getClassificacaoText()}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Right column: Address details and specifics */}
          <div className="flex flex-col space-y-3">
            {/* Remetente */}
            <div>
              <div className="text-xs text-gray-600">REMETENTE</div>
              <div className="font-bold">{volumeData.remetente || 'N/A'}</div>
            </div>
            
            {/* Destinatário */}
            <div className="bg-gray-100 p-2 rounded">
              <div className="text-xs text-gray-600">DESTINATÁRIO</div>
              <div className="font-bold">{volumeData.destinatario || 'N/A'}</div>
              <div className="text-sm">{volumeData.endereco || 'N/A'}</div>
            </div>
            
            {/* Destination with UF highlight */}
            <div className="flex space-x-2 items-center">
              <div className="flex-1 bg-green-100 p-2 rounded border border-green-300">
                <div className="text-xs text-gray-600">CIDADE</div>
                <div className="font-bold">{displayCidade}</div>
              </div>
              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-full border-2 border-black">
                <div className="font-bold text-xl">{volumeData.uf || 'N/A'}</div>
              </div>
            </div>
            
            {/* Volume type and weight */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-100 p-2 rounded">
                <div className="text-xs text-gray-600">TIPO</div>
                <div className="font-bold">{isQuimico ? 'QUÍMICO' : 'GERAL'}</div>
              </div>
              <div className="bg-gray-100 p-2 rounded">
                <div className="text-xs text-gray-600">PESO</div>
                <div className="font-bold">{volumeData.pesoTotal || '0 Kg'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModernLayout;
