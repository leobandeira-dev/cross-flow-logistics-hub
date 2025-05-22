
import React from 'react';
import { TestTube, Biohazard } from 'lucide-react';
import QRCodeGenerator from '../QRCodeGenerator';
import { EtiquetaLayoutProps } from './types';

const EnhancedReadabilityLayout: React.FC<EtiquetaLayoutProps> = ({
  volumeData,
  volumeNumber,
  totalVolumes,
  isMae,
  isQuimico,
  displayCidade,
  getClassificacaoText
}) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {/* Coluna 1: Dados do remetente e Nota Fiscal */}
      <div className="flex flex-col space-y-2">
        {/* Remetente - Highlighted */}
        <div className="p-1 bg-blue-100 border border-blue-300 rounded">
          <div className="text-xs text-gray-600">FORNECEDOR</div>
          <div className="font-bold text-lg">{volumeData.remetente || 'A definir'}</div>
        </div>
        
        {/* Nota Fiscal - Enhanced Highlighting */}
        <div className="p-2 bg-yellow-200 border-2 border-yellow-400 rounded">
          <div className="text-sm font-bold text-gray-700">NOTA FISCAL</div>
          <div className="font-bold text-2xl">{volumeData.notaFiscal || 'N/A'}</div>
        </div>
        
        {/* Transportadora */}
        <div className="p-1 bg-gray-100">
          <div className="text-xs text-gray-600">TRANSPORTADORA</div>
          <div className="font-bold text-base">
            {volumeData.transportadora || 'N/D'}
          </div>
        </div>
        
        {/* Tipo de Volume */}
        <div className="p-1 bg-gray-100">
          <div className="text-xs text-gray-600">TIPO DE VOLUME</div>
          <div className="font-bold text-base">
            {isQuimico ? 'QUÍMICO' : 'CARGA GERAL'}
          </div>
        </div>
      </div>
      
      {/* Coluna 2: Destinatário e código do volume */}
      <div className="flex flex-col space-y-2">
        {/* Destinatário */}
        <div className="p-1 bg-gray-100">
          <div className="text-xs text-gray-600">DESTINATÁRIO</div>
          <div className="font-bold text-lg">{volumeData.destinatario || 'A definir'}</div>
          <div className="text-sm">{volumeData.endereco || ''}</div>
        </div>
        
        {/* Destino - Enhanced Highlighted city */}
        <div className="flex space-x-2 items-center">
          <div className="flex-1 p-2 bg-green-200 border-2 border-green-400 rounded">
            <div className="text-sm font-bold text-gray-700">CIDADE</div>
            <div className="font-bold text-xl">{displayCidade}</div>
          </div>
          <div className="w-16 p-1 border-2 border-black flex items-center justify-center">
            <div className="font-bold text-2xl">{volumeData.uf || '-'}</div>
          </div>
        </div>
        
        {/* QR Code - Larger */}
        <div className="flex flex-col items-center justify-center pt-1">
          <QRCodeGenerator text={volumeData.id} size={90} />
          <div className="text-sm mt-1 font-mono font-bold">{volumeData.id}</div>
        </div>
      </div>
      
      {/* Coluna 3: Número de volume e informações químicas */}
      <div className="flex flex-col space-y-2">
        {/* Cabeçalho - Número do Volume */}
        <div className="text-center bg-gray-100 p-2 border-2 border-gray-300">
          <div className="text-sm">ETIQUETA DE {isMae ? 'MÃE' : 'VOLUME'}</div>
          {isMae ? (
            <div className="font-bold text-2xl">
              Volumes: {volumeData.quantidade || '0'}
            </div>
          ) : (
            <div className="font-bold text-2xl">
              {volumeNumber}/{totalVolumes}
            </div>
          )}
        </div>
        
        {/* Peso total */}
        <div className="p-1 bg-gray-100">
          <div className="text-xs text-gray-600">PESO TOTAL</div>
          <div className="font-bold text-lg">{volumeData.pesoTotal || '0 Kg'}</div>
        </div>
        
        {/* Informações de produto químico se aplicável */}
        {isQuimico && (
          <div className="bg-yellow-100 p-2 border-2 border-yellow-500 rounded">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold">PRODUTO QUÍMICO</div>
                <div className="text-base">
                  <span className="font-bold">ONU:</span> {volumeData.codigoONU || 'N/A'}
                </div>
                <div className="text-base">
                  <span className="font-bold">RISCO:</span> {volumeData.codigoRisco || 'N/A'}
                </div>
                <div className="text-base mt-1 border-t pt-1">
                  <span className="font-bold">CLASSIFICAÇÃO:</span> {getClassificacaoText()}
                </div>
              </div>
              <Biohazard size={40} className="text-red-600" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedReadabilityLayout;
