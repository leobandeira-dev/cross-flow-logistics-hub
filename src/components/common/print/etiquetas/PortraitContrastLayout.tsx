
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
    <div className="h-full flex flex-col p-3 space-y-3 font-sans" style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', lineHeight: '1.3' }}>
      {/* Ícone químico se aplicável */}
      {isQuimico && (
        <div className="absolute top-2 right-2 text-red-600 text-3xl font-black">⚠</div>
      )}
      
      {/* Header */}
      <div className={`text-center py-4 px-2 rounded-lg shadow-lg ${isMae ? 'bg-red-700' : 'bg-blue-800'} text-white`}>
        {transportadoraLogo ? (
          <div className="flex justify-center">
            <img 
              src={transportadoraLogo} 
              alt="Logo Transportadora" 
              className="object-contain"
              style={{ width: 'auto', height: '42px', maxWidth: '180px' }}
            />
          </div>
        ) : (
          <span className="text-xl font-black tracking-wide">
            {isMae ? 'ETIQUETA MÃE' : (volumeData.transportadora || 'TRANSPORTADORA')}
          </span>
        )}
      </div>

      {/* Área - DESTAQUE PRINCIPAL COM ALTO CONTRASTE */}
      {volumeData.area && (
        <div className="bg-black text-white border-4 border-gray-900 rounded-xl p-5 text-center shadow-lg">
          <div className="text-sm text-white font-black mb-2">ÁREA</div>
          <div className="text-6xl font-black text-white tracking-widest">{volumeData.area}</div>
        </div>
      )}
      
      {/* Contagem de Volumes - DESTAQUE (para etiquetas de volume) */}
      {!isMae && volumeNumber && totalVolumes && (
        <div className="bg-orange-100 border-4 border-orange-600 rounded-xl p-4 text-center shadow-lg">
          <div className="text-sm text-orange-800 font-black mb-2">VOLUME</div>
          <div className="text-5xl font-black text-orange-900 tracking-widest">{volumeNumber}/{totalVolumes}</div>
        </div>
      )}
      
      {/* QR Code */}
      <div className="text-center bg-white p-3 rounded-lg shadow-lg border-2 border-gray-300">
        <QRCodeGenerator text={volumeData.id} size={150} />
        <div className="text-base mt-2 font-black text-gray-900">{volumeData.id}</div>
      </div>
      
      {/* Nota Fiscal - DESTAQUE COM ALTO CONTRASTE */}
      <div className="bg-black text-white border-4 border-gray-900 rounded-xl p-4 text-center shadow-lg">
        <div className="text-sm text-white font-black mb-2">NOTA FISCAL</div>
        <div className="text-4xl font-black text-white tracking-widest">{volumeData.notaFiscal || 'N/A'}</div>
      </div>
      
      {/* Cidade Destino - DESTAQUE COM ALTO CONTRASTE */}
      <div className="bg-black text-white border-4 border-gray-900 rounded-xl p-4 text-center shadow-lg">
        <div className="text-sm text-white font-black mb-2">CIDADE DESTINO</div>
        <div className="text-3xl font-black text-white leading-tight mb-1">{displayCidade || 'N/A'}</div>
        <div className="text-2xl font-black text-white">{volumeData.uf || 'N/A'}</div>
      </div>
      
      {/* Remetente - DESTAQUE COM ALTO CONTRASTE */}
      <div className="bg-black text-white border-4 border-gray-900 rounded-xl p-3 shadow-lg">
        <div className="text-sm text-white font-black mb-2">REMETENTE</div>
        <div className="text-xl font-black text-white leading-tight">{volumeData.remetente || 'N/A'}</div>
      </div>
      
      {/* Destinatário */}
      <div className="bg-purple-100 border-3 border-purple-600 rounded-lg p-3 shadow-md">
        <div className="text-sm text-purple-800 font-black mb-1">DESTINATÁRIO</div>
        <div className="text-lg font-bold text-purple-900 leading-tight">{volumeData.destinatario || 'N/A'}</div>
      </div>
      
      {/* Informações Adicionais */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-100 border-2 border-gray-400 p-2 rounded shadow-sm">
          <span className="text-sm text-gray-700 font-bold">Peso:</span>
          <div className="text-base font-black text-gray-900">{volumeData.pesoTotal || '0 Kg'}</div>
        </div>
        <div className="bg-gray-100 border-2 border-gray-400 p-2 rounded shadow-sm">
          <span className="text-sm text-gray-700 font-bold">Transp:</span>
          <div className="text-sm font-black text-gray-900 leading-tight">{volumeData.transportadora || 'N/D'}</div>
        </div>
      </div>
      
      {isQuimico && (
        <div className="bg-red-100 border-3 border-red-600 rounded-lg p-3 mt-auto shadow-md">
          <div className="text-center mb-2">
            <span className="text-base font-black text-red-700">⚠ PRODUTO QUÍMICO ⚠</span>
          </div>
          <div className="text-center text-sm font-bold">
            <div><span className="font-black">ONU:</span> {volumeData.codigoONU || 'N/A'}</div>
            <div><span className="font-black">RISCO:</span> {volumeData.codigoRisco || 'N/A'}</div>
            <div><span className="font-black">CLASS:</span> {getClassificacaoText()}</div>
          </div>
        </div>
      )}
      
      {volumeData.endereco && (
        <div className="text-sm text-gray-700 text-center border-t-2 border-gray-400 pt-2 mt-auto font-bold">
          <span className="font-black">End:</span> {volumeData.endereco}
        </div>
      )}
      
      {volumeData.descricao && (
        <div className="text-sm mt-1 pt-2 border-t-2 border-gray-400 font-bold">
          <span className="font-black">Descrição:</span> {volumeData.descricao}
        </div>
      )}
      
      {/* Quantidade de Volumes - DESTAQUE COM ALTO CONTRASTE (para etiqueta mãe) */}
      {isMae && (
        <div className="bg-black text-white border-4 border-gray-900 rounded-xl p-4 text-center mt-2 shadow-lg">
          <div className="text-sm text-white font-black mb-2">TOTAL DE VOLUMES</div>
          <div className="text-5xl font-black text-white tracking-widest">{volumeData.quantidade || '0'}</div>
        </div>
      )}
    </div>
  );
};

export default PortraitContrastLayout;
