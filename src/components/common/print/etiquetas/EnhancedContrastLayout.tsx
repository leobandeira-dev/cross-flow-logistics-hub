
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
    <div className="grid grid-cols-3 gap-3">
      {/* Coluna 1: Dados do remetente e Nota Fiscal */}
      <div className="flex flex-col space-y-2">
        {/* Remetente - CONTAINER PRETO */}
        <div className="bg-black border-4 border-gray-800 rounded-xl p-3 shadow-lg">
          <div className="text-lg text-white font-black">REMETENTE</div>
          <div className="text-2xl font-black text-white leading-tight mt-1">{volumeData.remetente || 'A definir'}</div>
        </div>
        
        {/* Nota Fiscal - CONTAINER PRETO */}
        <div className="bg-black border-4 border-gray-800 rounded-xl p-4 text-center shadow-lg">
          <div className="text-lg font-black text-white">NOTA FISCAL</div>
          <div className="text-4xl font-black text-white mt-2 tracking-wider">{volumeData.notaFiscal || 'N/A'}</div>
        </div>
        
        {/* Transportadora com Logo */}
        <div className="bg-gray-100 p-2 rounded">
          <div className="text-xs text-gray-600">TRANSPORTADORA</div>
          {transportadoraLogo ? (
            <div className="mt-1 bg-white p-1 rounded border">
              <img 
                src={transportadoraLogo} 
                alt="Logo Transportadora" 
                className="w-full h-full object-contain"
                style={{ width: '90mm', height: '25mm' }}
              />
            </div>
          ) : (
            <div className="font-bold text-base">
              {volumeData.transportadora || 'N/D'}
            </div>
          )}
        </div>
        
        {/* Tipo de Volume */}
        <div className="bg-gray-100 p-1">
          <div className="text-xs text-gray-600">TIPO DE VOLUME</div>
          <div className="font-bold text-base">
            {isQuimico ? 'QUÍMICO' : 'CARGA GERAL'}
          </div>
        </div>
      </div>
      
      {/* Coluna 2: Destinatário e código do volume */}
      <div className="flex flex-col space-y-2">
        {/* Destinatário */}
        <div className="bg-gray-100 p-1">
          <div className="text-xs text-gray-600">DESTINATÁRIO</div>
          <div className="font-bold text-lg">{volumeData.destinatario || 'A definir'}</div>
          <div className="text-sm">{volumeData.endereco || ''}</div>
        </div>
        
        {/* Destino - CONTAINER PRETO */}
        <div className="bg-black border-4 border-gray-800 rounded-xl p-4 text-center shadow-lg">
          <div className="text-lg font-black text-white">CIDADE DESTINO</div>
          <div className="text-3xl font-black text-white mt-1 leading-tight">{displayCidade}</div>
          <div className="text-2xl font-black text-white mt-1">{volumeData.uf || '-'}</div>
        </div>
        
        {/* QR Code */}
        <div className="flex flex-col items-center justify-center pt-2">
          <QRCodeGenerator text={volumeData.id} size={90} />
          <div className="text-sm mt-1 font-mono font-bold">{volumeData.id}</div>
        </div>
      </div>
      
      {/* Coluna 3: Número de volume e informações químicas */}
      <div className="flex flex-col space-y-2">
        {/* Cabeçalho - Número do Volume ou Quantidade de Volumes */}
        {isMae ? (
          <div className="bg-black border-4 border-gray-800 rounded-xl p-4 text-center shadow-lg">
            <div className="text-lg text-white font-black">QUANTIDADE DE VOLUMES</div>
            <div className="text-4xl font-black text-white mt-2">{volumeData.quantidade || '0'}</div>
          </div>
        ) : (
          <div className="text-center bg-gray-100 p-2 border-2 border-gray-300">
            <div className="text-sm">ETIQUETA DE VOLUME</div>
            <div className="font-bold text-2xl">
              {volumeNumber}/{totalVolumes}
            </div>
          </div>
        )}
        
        {/* Peso total */}
        <div className="bg-gray-100 p-1">
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

export default EnhancedContrastLayout;
