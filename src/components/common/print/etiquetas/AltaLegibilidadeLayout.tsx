
import React from 'react';
import { Biohazard } from 'lucide-react';
import QRCodeGenerator from '../QRCodeGenerator';
import { EtiquetaLayoutProps } from './types';

const AltaLegibilidadeLayout: React.FC<EtiquetaLayoutProps> = ({
  volumeData,
  volumeNumber,
  totalVolumes,
  isMae,
  isQuimico,
  displayCidade,
  getClassificacaoText
}) => {
  return (
    <div className="p-4 space-y-4 text-black bg-white">
      {/* Cabeçalho Principal - Muito Destacado */}
      <div className="text-center border-4 border-black p-3 bg-gray-100">
        <div className="text-lg font-bold mb-1">ETIQUETA DE {isMae ? 'MÃE' : 'VOLUME'}</div>
        {isMae ? (
          <div className="text-3xl font-black">
            VOLUMES: {volumeData.quantidade || '0'}
          </div>
        ) : (
          <div className="text-3xl font-black">
            {volumeNumber}/{totalVolumes}
          </div>
        )}
      </div>

      {/* Linha 1: Nota Fiscal e Peso */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border-2 border-gray-400 p-3 bg-yellow-100">
          <div className="text-sm font-bold text-gray-700">NOTA FISCAL</div>
          <div className="text-2xl font-black">{volumeData.notaFiscal || 'N/A'}</div>
        </div>
        <div className="border-2 border-gray-400 p-3 bg-blue-100">
          <div className="text-sm font-bold text-gray-700">PESO TOTAL</div>
          <div className="text-2xl font-black">{volumeData.pesoTotal || '0 Kg'}</div>
        </div>
      </div>

      {/* Linha 2: Fornecedor */}
      <div className="border-2 border-gray-400 p-3 bg-green-100">
        <div className="text-base font-bold text-gray-700">FORNECEDOR</div>
        <div className="text-xl font-black break-words">{volumeData.remetente || 'A definir'}</div>
      </div>

      {/* Linha 3: Destinatário */}
      <div className="border-2 border-gray-400 p-3 bg-orange-100">
        <div className="text-base font-bold text-gray-700">DESTINATÁRIO</div>
        <div className="text-xl font-black break-words">{volumeData.destinatario || 'A definir'}</div>
      </div>

      {/* Linha 4: Cidade e UF */}
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 border-4 border-red-500 p-3 bg-red-100">
          <div className="text-base font-bold text-gray-700">CIDADE DESTINO</div>
          <div className="text-2xl font-black">{displayCidade}</div>
        </div>
        <div className="border-4 border-red-500 p-3 bg-red-100 text-center">
          <div className="text-base font-bold text-gray-700">UF</div>
          <div className="text-3xl font-black">{volumeData.uf || '-'}</div>
        </div>
      </div>

      {/* Linha 5: QR Code e Código do Volume */}
      <div className="grid grid-cols-2 gap-4 items-center">
        <div className="text-center">
          <QRCodeGenerator text={volumeData.id} size={100} />
        </div>
        <div className="text-center border-2 border-black p-2">
          <div className="text-base font-bold">CÓDIGO VOLUME</div>
          <div className="text-lg font-mono font-black break-all">{volumeData.id}</div>
        </div>
      </div>

      {/* Linha 6: Transportadora */}
      <div className="border-2 border-gray-400 p-3 bg-purple-100">
        <div className="text-base font-bold text-gray-700">TRANSPORTADORA</div>
        <div className="text-xl font-black">{volumeData.transportadora || 'N/D'}</div>
      </div>

      {/* Informações de Produto Químico - Se aplicável */}
      {isQuimico && (
        <div className="border-4 border-red-600 p-4 bg-yellow-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-lg font-black text-red-700 mb-2">⚠️ PRODUTO QUÍMICO ⚠️</div>
              <div className="text-base font-bold">
                <span className="text-gray-700">ONU:</span> 
                <span className="text-xl font-black ml-1">{volumeData.codigoONU || 'N/A'}</span>
              </div>
              <div className="text-base font-bold">
                <span className="text-gray-700">RISCO:</span> 
                <span className="text-xl font-black ml-1">{volumeData.codigoRisco || 'N/A'}</span>
              </div>
              <div className="text-base font-bold border-t border-gray-400 pt-1 mt-1">
                <span className="text-gray-700">CLASSIFICAÇÃO:</span> 
                <span className="text-lg font-black ml-1">{getClassificacaoText()}</span>
              </div>
            </div>
            <Biohazard size={60} className="text-red-600 ml-4" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AltaLegibilidadeLayout;
