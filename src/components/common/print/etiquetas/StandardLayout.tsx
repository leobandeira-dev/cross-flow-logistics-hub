
import React from 'react';
import { TestTube, Biohazard } from 'lucide-react';
import QRCodeGenerator from '../QRCodeGenerator';
import { EtiquetaLayoutProps } from './types';

const StandardLayout: React.FC<EtiquetaLayoutProps> = ({
  volumeData,
  volumeNumber,
  totalVolumes,
  isMae,
  isQuimico,
  displayCidade,
  getClassificacaoText
}) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Coluna 1: Dados do remetente e Nota Fiscal */}
      <div className="flex flex-col space-y-3">
        {/* Remetente - Highlighted */}
        <div className="p-1 bg-blue-100 border border-blue-300 rounded">
          <div className="text-xs text-gray-600">FORNECEDOR</div>
          <div className="font-bold text-base">{volumeData.remetente || 'A definir'}</div>
        </div>
        
        {/* Nota Fiscal - Highlighted */}
        <div className="p-1 bg-yellow-100 border border-yellow-300 rounded">
          <div className="text-xs text-gray-600">NOTA FISCAL</div>
          <div className="font-bold text-lg">{volumeData.notaFiscal || 'N/A'}</div>
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
      <div className="flex flex-col space-y-3">
        {/* Destinatário */}
        <div className="p-1 bg-gray-100">
          <div className="text-xs text-gray-600">DESTINATÁRIO</div>
          <div className="font-bold text-base">{volumeData.destinatario || 'A definir'}</div>
          <div className="text-xs">{volumeData.endereco || ''}</div>
        </div>
        
        {/* Destino - Highlighted city */}
        <div className="flex space-x-2 items-center">
          <div className="flex-1 p-1 bg-green-100 border border-green-300 rounded">
            <div className="text-xs text-gray-600">CIDADE</div>
            <div className="font-bold text-base">{displayCidade}</div>
          </div>
          <div className="w-16 p-1 border border-black flex items-center justify-center">
            <div className="font-bold text-xl">{volumeData.uf || '-'}</div>
          </div>
        </div>
        
        {/* QR Code */}
        <div className="flex flex-col items-center justify-center pt-2">
          <QRCodeGenerator text={volumeData.id} size={80} />
          <div className="text-xs mt-1 font-mono">{volumeData.id}</div>
        </div>
      </div>
      
      {/* Coluna 3: Número de volume e informações químicas */}
      <div className="flex flex-col space-y-3">
        {/* Cabeçalho - Número do Volume */}
        <div className="text-center bg-gray-100 p-2 border border-gray-300">
          <div className="text-xs">ETIQUETA DE {isMae ? 'MÃE' : 'VOLUME'}</div>
          {isMae ? (
            <div className="font-bold text-xl">
              Volumes: {volumeData.quantidade || '0'}
            </div>
          ) : (
            <div className="font-bold text-xl">
              {volumeNumber}/{totalVolumes}
            </div>
          )}
        </div>
        
        {/* Peso total */}
        <div className="p-1 bg-gray-100">
          <div className="text-xs text-gray-600">PESO TOTAL</div>
          <div className="font-bold text-base">{volumeData.pesoTotal || '0 Kg'}</div>
        </div>
        
        {/* Informações de produto químico se aplicável */}
        {isQuimico && (
          <div className="bg-yellow-100 p-2 border-2 border-yellow-500 rounded">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold">PRODUTO QUÍMICO</div>
                <div className="text-sm">
                  <span className="font-bold">ONU:</span> {volumeData.codigoONU || 'N/A'}
                </div>
                <div className="text-sm">
                  <span className="font-bold">RISCO:</span> {volumeData.codigoRisco || 'N/A'}
                </div>
                <div className="text-sm mt-1 border-t pt-1">
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

export default StandardLayout;
