
import React from 'react';
import { QrCode, Biohazard, TestTube } from 'lucide-react';
import QRCodeGenerator from '../QRCodeGenerator';
import { EtiquetaLayoutProps } from './types';

interface PortraitLayoutProps extends EtiquetaLayoutProps {
  transportadoraLogo?: string;
}

const PortraitLayout: React.FC<PortraitLayoutProps> = ({
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
    <div className="h-full flex flex-col p-3 space-y-2 font-sans" style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', lineHeight: '1.2' }}>
      {/* Ícone químico se aplicável */}
      {isQuimico && (
        <div className="absolute top-2 right-2 text-red-600 text-2xl font-black">⚠</div>
      )}
      
      {/* Header */}
      <div className={`text-center py-3 px-2 rounded-lg shadow-md ${isMae ? 'bg-red-600' : 'bg-blue-700'} text-white`}>
        {transportadoraLogo ? (
          <div className="flex justify-center">
            <img 
              src={transportadoraLogo} 
              alt="Logo Transportadora" 
              className="object-contain"
              style={{ width: 'auto', height: '36px', maxWidth: '160px' }}
            />
          </div>
        ) : (
          <span className="text-base font-black tracking-wide">
            {isMae ? 'ETIQUETA MÃE' : (volumeData.transportadora || 'TRANSPORTADORA')}
          </span>
        )}
      </div>
      
      {/* Contagem de Volumes - DESTAQUE (para etiquetas de volume) */}
      {!isMae && volumeNumber && totalVolumes && (
        <div className="bg-orange-50 border-2 border-orange-400 rounded-lg p-3 text-center shadow-sm">
          <div className="text-xs text-orange-800 font-bold mb-1">VOLUME</div>
          <div className="text-3xl font-black text-orange-900 tracking-wider">{volumeNumber}/{totalVolumes}</div>
        </div>
      )}
      
      {/* QR Code */}
      <div className="text-center bg-white p-2 rounded-lg shadow-sm">
        <QRCodeGenerator text={volumeData.id} size={120} />
        <div className="text-sm mt-2 font-bold text-gray-800">{volumeData.id}</div>
      </div>
      
      {/* Nota Fiscal - DESTAQUE */}
      <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-3 text-center shadow-sm">
        <div className="text-xs text-yellow-800 font-bold mb-1">NOTA FISCAL</div>
        <div className="text-2xl font-black text-yellow-900 tracking-wider">{volumeData.notaFiscal || 'N/A'}</div>
      </div>
      
      {/* Cidade Destino - DESTAQUE */}
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-3 text-center shadow-sm">
        <div className="text-xs text-green-800 font-bold mb-1">CIDADE DESTINO</div>
        <div className="text-xl font-black text-green-900 leading-tight">{displayCidade || 'N/A'}</div>
        <div className="text-lg font-bold text-green-800">{volumeData.uf || 'N/A'}</div>
      </div>
      
      {/* Remetente - DESTAQUE */}
      <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-2 shadow-sm">
        <div className="text-xs text-blue-800 font-bold mb-1">REMETENTE</div>
        <div className="text-base font-black text-blue-900 leading-tight">{volumeData.remetente || 'N/A'}</div>
      </div>
      
      {/* Destinatário */}
      <div className="bg-purple-50 border-2 border-purple-500 rounded-lg p-2 shadow-sm">
        <div className="text-xs text-purple-800 font-bold mb-1">DESTINATÁRIO</div>
        <div className="text-base font-bold text-purple-900 leading-tight">{volumeData.destinatario || 'N/A'}</div>
      </div>
      
      {/* Informações Adicionais */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-50 border border-gray-300 p-2 rounded shadow-sm">
          <span className="text-xs text-gray-700 font-medium">Peso:</span>
          <div className="text-sm font-bold text-gray-900">{volumeData.pesoTotal || '0 Kg'}</div>
        </div>
        <div className="bg-gray-50 border border-gray-300 p-2 rounded shadow-sm">
          <span className="text-xs text-gray-700 font-medium">Transp:</span>
          <div className="text-xs font-bold text-gray-900 leading-tight">{volumeData.transportadora || 'N/D'}</div>
        </div>
      </div>
      
      {isQuimico && (
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-2 mt-auto shadow-sm">
          <div className="text-center mb-1">
            <span className="text-sm font-black text-red-700">⚠ PRODUTO QUÍMICO ⚠</span>
          </div>
          <div className="text-center text-xs font-medium">
            <div><span className="font-bold">ONU:</span> {volumeData.codigoONU || 'N/A'}</div>
            <div><span className="font-bold">RISCO:</span> {volumeData.codigoRisco || 'N/A'}</div>
            <div><span className="font-bold">CLASS:</span> {getClassificacaoText()}</div>
          </div>
        </div>
      )}
      
      {volumeData.endereco && (
        <div className="text-xs text-gray-600 text-center border-t pt-2 mt-auto font-medium">
          <span className="font-bold">End:</span> {volumeData.endereco}
        </div>
      )}
      
      {volumeData.descricao && (
        <div className="text-xs mt-1 pt-2 border-t-2 border-gray-300 font-medium">
          <span className="font-bold">Descrição:</span> {volumeData.descricao}
        </div>
      )}
      
      {/* Quantidade de Volumes - DESTAQUE (para etiqueta mãe) */}
      {isMae && (
        <div className="bg-purple-50 border-2 border-purple-500 rounded-lg p-3 text-center mt-2 shadow-sm">
          <div className="text-xs text-purple-800 font-bold mb-1">TOTAL DE VOLUMES</div>
          <div className="text-3xl font-black text-purple-900 tracking-wider">{volumeData.quantidade || '0'}</div>
        </div>
      )}
    </div>
  );
};

export default PortraitLayout;
