
import React from 'react';
import { TestTube, Biohazard } from 'lucide-react';
import QRCodeGenerator from '../QRCodeGenerator';
import { EtiquetaLayoutProps } from './types';

interface EnhancedContrastLayoutProps extends EtiquetaLayoutProps {
  transportadoraLogo?: string;
}

const EnhancedContrastLayout: React.FC<EnhancedContrastLayoutProps> = ({
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
    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 h-full">
      {/* Coluna 1: Dados do remetente e Nota Fiscal */}
      <div className="flex flex-col space-y-3">
        {/* Remetente - CONTAINER PRETO */}
        <div className="bg-black border-4 border-gray-800 rounded-xl p-4 shadow-lg">
          <div className="text-lg text-white font-black">REMETENTE</div>
          <div className="text-2xl font-black text-white leading-tight mt-2">{volumeData.remetente || 'A definir'}</div>
        </div>
        
        {/* Nota Fiscal - CONTAINER PRETO */}
        <div className="bg-black border-4 border-gray-800 rounded-xl p-5 text-center shadow-lg">
          <div className="text-lg font-black text-white">NOTA FISCAL</div>
          <div className="text-4xl font-black text-white mt-3 tracking-wider">{volumeData.notaFiscal || 'N/A'}</div>
        </div>
        
        {/* Transportadora com Logo */}
        <div className="bg-gray-100 p-3 rounded-lg border">
          <div className="text-sm text-gray-600 font-medium">TRANSPORTADORA</div>
          {transportadoraLogo ? (
            <div className="mt-2 bg-white p-2 rounded border">
              <img 
                src={transportadoraLogo} 
                alt="Logo Transportadora" 
                className="w-full h-full object-contain"
                style={{ maxWidth: '120px', maxHeight: '40px' }}
              />
            </div>
          ) : (
            <div className="font-bold text-lg mt-1">
              {volumeData.transportadora || 'N/D'}
            </div>
          )}
        </div>
        
        {/* Tipo de Volume */}
        <div className="bg-gray-100 p-2 rounded">
          <div className="text-sm text-gray-600 font-medium">TIPO DE VOLUME</div>
          <div className="font-bold text-lg mt-1">
            {isQuimico ? 'QUÍMICO' : 'CARGA GERAL'}
          </div>
        </div>
      </div>
      
      {/* Coluna 2: Destinatário e código do volume */}
      <div className="flex flex-col space-y-3">
        {/* Destinatário */}
        <div className="bg-gray-100 p-3 rounded-lg border">
          <div className="text-sm text-gray-600 font-medium">DESTINATÁRIO</div>
          <div className="font-bold text-xl mt-1">{volumeData.destinatario || 'A definir'}</div>
          <div className="text-base mt-1">{volumeData.endereco || ''}</div>
        </div>
        
        {/* Destino - CONTAINER PRETO */}
        <div className="bg-black border-4 border-gray-800 rounded-xl p-5 text-center shadow-lg">
          <div className="text-lg font-black text-white">CIDADE DESTINO</div>
          <div className="text-3xl font-black text-white mt-2 leading-tight">{displayCidade}</div>
          <div className="text-2xl font-black text-white mt-2">{volumeData.uf || '-'}</div>
        </div>
        
        {/* QR Code */}
        <div className="flex flex-col items-center justify-center pt-3">
          <div className="bg-white p-3 rounded-lg shadow-md">
            <QRCodeGenerator text={volumeData.id} size={100} />
          </div>
          <div className="text-base mt-2 font-mono font-bold">{volumeData.id}</div>
        </div>
      </div>
      
      {/* Coluna 3: Número de volume e informações químicas */}
      <div className="flex flex-col space-y-3">
        {/* Cabeçalho - Número do Volume ou Quantidade de Volumes */}
        {isMae ? (
          <div className="bg-black border-4 border-gray-800 rounded-xl p-5 text-center shadow-lg">
            <div className="text-lg text-white font-black">QUANTIDADE DE VOLUMES</div>
            <div className="text-4xl font-black text-white mt-3">{volumeData.quantidade || '0'}</div>
          </div>
        ) : (
          <div className="text-center bg-gray-100 p-3 border-2 border-gray-300 rounded">
            <div className="text-sm font-medium">ETIQUETA DE VOLUME</div>
            <div className="font-bold text-3xl mt-1">
              {volumeNumber}/{totalVolumes}
            </div>
          </div>
        )}
        
        {/* Peso total */}
        <div className="bg-gray-100 p-3 rounded border">
          <div className="text-sm text-gray-600 font-medium">PESO TOTAL</div>
          <div className="font-bold text-xl mt-1">{volumeData.pesoTotal || '0 Kg'}</div>
        </div>
        
        {/* Informações de produto químico se aplicável */}
        {isQuimico && (
          <div className="bg-yellow-100 p-3 border-2 border-yellow-500 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm font-bold text-red-600 mb-2">PRODUTO QUÍMICO</div>
                <div className="text-base mb-1">
                  <span className="font-bold">ONU:</span> {volumeData.codigoONU || 'N/A'}
                </div>
                <div className="text-base mb-1">
                  <span className="font-bold">RISCO:</span> {volumeData.codigoRisco || 'N/A'}
                </div>
                <div className="text-base mt-2 pt-2 border-t border-yellow-300">
                  <span className="font-bold">CLASSIFICAÇÃO:</span> {getClassificacaoText()}
                </div>
              </div>
              <div className="ml-2">
                <Biohazard size={45} className="text-red-600" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedContrastLayout;
