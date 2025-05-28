import React from 'react';
import { QrCode, Biohazard, TestTube } from 'lucide-react';
import QRCodeGenerator from '../QRCodeGenerator';
import { EtiquetaLayoutProps } from './types';

interface PortraitContrastLayoutProps extends EtiquetaLayoutProps {
  transportadoraLogo?: string;
}

const PortraitContrastLayout: React.FC<PortraitContrastLayoutProps> = ({
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
    <div className="h-full flex flex-col p-4 space-y-4">
      {/* Ícone químico se aplicável */}
      {isQuimico && (
        <div className="absolute top-3 right-3 text-red-600 text-3xl">⚠</div>
      )}
      
      {/* Header */}
      <div className={`text-center p-3 rounded ${isMae ? 'bg-red-500' : 'bg-blue-600'} text-white`}>
        {transportadoraLogo ? (
          <div className="flex justify-center">
            <img 
              src={transportadoraLogo} 
              alt="Logo Transportadora" 
              className="object-contain"
              style={{ width: 'auto', height: '32px', maxWidth: '150px' }}
            />
          </div>
        ) : (
          <span className="text-lg font-bold">
            {isMae ? 'ETIQUETA MÃE' : (volumeData.transportadora || 'TRANSPORTADORA')}
          </span>
        )}
      </div>
      
      {/* QR Code */}
      <div className="text-center">
        <QRCodeGenerator text={volumeData.id} size={100} />
        <div className="text-sm mt-2 font-bold">{volumeData.id}</div>
      </div>
      
      {/* Nota Fiscal - DESTAQUE COM ALTO CONTRASTE */}
      <div className="bg-black text-white border-3 border-gray-800 rounded-lg p-3 text-center">
        <div className="text-xs text-white">NOTA FISCAL</div>
        <div className="text-2xl font-bold text-white">{volumeData.notaFiscal || 'N/A'}</div>
      </div>
      
      {/* Cidade Destino - DESTAQUE COM ALTO CONTRASTE */}
      <div className="bg-black text-white border-3 border-gray-800 rounded-lg p-3 text-center">
        <div className="text-xs text-white">CIDADE DESTINO</div>
        <div className="text-xl font-bold text-white">{displayCidade || 'N/A'}</div>
        <div className="text-lg font-semibold text-white">{volumeData.uf || 'N/A'}</div>
      </div>
      
      {/* Remetente - DESTAQUE COM ALTO CONTRASTE */}
      <div className="bg-black text-white border-3 border-gray-800 rounded-lg p-3">
        <div className="text-xs text-white font-semibold">REMETENTE</div>
        <div className="text-lg font-bold text-white leading-tight">{volumeData.remetente || 'N/A'}</div>
      </div>
      
      {/* Destinatário */}
      <div className="bg-purple-100 border-3 border-purple-500 rounded-lg p-3">
        <div className="text-xs text-purple-700 font-semibold">DESTINATÁRIO</div>
        <div className="text-lg font-bold text-purple-900 leading-tight">{volumeData.destinatario || 'N/A'}</div>
      </div>
      
      {/* Informações Adicionais */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-100 p-2 rounded">
          <span className="text-xs text-gray-600">Peso:</span>
          <div className="text-sm font-semibold">{volumeData.pesoTotal || '0 Kg'}</div>
        </div>
        <div className="bg-gray-100 p-2 rounded">
          <span className="text-xs text-gray-600">Transp:</span>
          <div className="text-xs font-semibold">{volumeData.transportadora || 'N/D'}</div>
        </div>
      </div>
      
      {isQuimico && (
        <div className="bg-red-100 border-3 border-red-500 rounded-lg p-3 mt-auto">
          <div className="text-center mb-2">
            <span className="text-sm font-bold text-red-600">⚠ PRODUTO QUÍMICO ⚠</span>
          </div>
          <div className="text-center text-xs">
            <div><span className="font-bold">ONU:</span> {volumeData.codigoONU || 'N/A'}</div>
            <div><span className="font-bold">RISCO:</span> {volumeData.codigoRisco || 'N/A'}</div>
            <div><span className="font-bold">CLASS:</span> {getClassificacaoText()}</div>
          </div>
        </div>
      )}
      
      {volumeData.endereco && (
        <div className="text-xs text-gray-600 text-center border-t pt-2 mt-auto">
          <span className="font-medium">End:</span> {volumeData.endereco}
        </div>
      )}
      
      {volumeData.descricao && (
        <div className="text-xs mt-2 pt-2 border-t-2 border-gray-300">
          <span className="font-bold">Descrição:</span> {volumeData.descricao}
        </div>
      )}
      
      {/* Quantidade de Volumes - DESTAQUE COM ALTO CONTRASTE (para etiqueta mãe) */}
      {isMae && (
        <div className="bg-black text-white border-3 border-gray-800 rounded-lg p-3 text-center mt-2">
          <div className="text-xs text-white">TOTAL DE VOLUMES</div>
          <div className="text-2xl font-bold text-white">{volumeData.quantidade || '0'}</div>
        </div>
      )}
    </div>
  );
};

export default PortraitContrastLayout;
