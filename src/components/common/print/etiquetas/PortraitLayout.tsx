
import React from 'react';
import { TestTube, Biohazard } from 'lucide-react';
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
    <div className="h-full flex flex-col p-4">
      {/* Ícone químico se aplicável */}
      {isQuimico && (
        <div className="absolute top-3 right-3 bg-red-100 border-2 border-red-500 rounded-full p-2">
          <Biohazard size={32} className="text-red-600" />
        </div>
      )}
      
      {/* Header */}
      <div className="text-center text-lg font-bold border-b-2 border-gray-300 pb-2 mb-4">
        {transportadoraLogo ? (
          <div className="flex justify-center">
            <img 
              src={transportadoraLogo} 
              alt="Logo Transportadora" 
              className="max-h-12 object-contain"
              style={{ width: 'auto', height: '48px', maxWidth: '200px' }}
            />
          </div>
        ) : (
          isMae ? 'ETIQUETA MÃE' : (volumeData.transportadora || 'TRANSPORTADORA')
        )}
      </div>
      
      {/* Seção principal de informações */}
      <div className="flex-1">
        <div className="text-sm mb-2">
          <span className="font-bold">ID:</span> {volumeData.id}
        </div>
        
        <div className="text-sm mb-2">
          <span className="font-bold">NF:</span> {volumeData.notaFiscal || 'N/A'}
        </div>
        
        <div className="text-lg mb-2 font-bold">
          <span className="font-bold">Remetente:</span> {volumeData.remetente || 'N/A'}
        </div>
        
        <div className="text-sm mb-2">
          <span className="font-bold">Destinatário:</span> {volumeData.destinatario || 'N/A'}
        </div>
        
        <div className="text-sm mb-2">
          <span className="font-bold">Endereço:</span> {volumeData.endereco || 'N/A'}
        </div>
        
        <div className="text-xl mb-4 font-bold text-center p-2 bg-gray-100 rounded">
          {displayCidade}/{volumeData.uf || 'N/A'}
        </div>
        
        <div className="text-sm mb-2">
          <span className="font-bold">Peso:</span> {volumeData.pesoTotal || '0 Kg'}
        </div>
        
        {/* Quantidade - DESTAQUE MAIOR */}
        {volumeData.quantidade && (
          <div className="text-lg mb-4 font-bold text-center p-3 bg-orange-100 border-2 border-orange-300 rounded">
            <span className="font-bold">Quantidade:</span> 
            <span className="text-2xl font-black ml-2 text-orange-800">{volumeData.quantidade}</span>
          </div>
        )}
        
        {isQuimico && (
          <>
            <div className="text-sm mb-2 bg-red-100 p-2 rounded">
              <span className="font-bold">Código ONU:</span> {volumeData.codigoONU || 'N/A'}
            </div>
            <div className="text-sm mb-2 bg-red-100 p-2 rounded">
              <span className="font-bold">Código de Risco:</span> {volumeData.codigoRisco || 'N/A'}
            </div>
            <div className="text-sm mb-2 bg-red-100 p-2 rounded">
              <span className="font-bold">Classificação:</span> {getClassificacaoText()}
            </div>
          </>
        )}
      </div>
      
      {/* QR Code e Área */}
      <div className="text-center">
        <QRCodeGenerator text={volumeData.id} size={120} />
        <div className="text-xs mt-2 font-bold">{volumeData.id}</div>
        
        {/* Área - DESTAQUE MAIOR E MAIS LEGÍVEL */}
        {volumeData.area && (
          <div className="mt-4 bg-indigo-600 text-white p-5 rounded-lg text-center border-4 border-indigo-800 shadow-lg">
            <div className="text-lg font-bold mb-2">ÁREA</div>
            <div className="text-7xl font-black leading-none">{volumeData.area}</div>
          </div>
        )}
      </div>
      
      {/* Volume - DESTAQUE MAIOR (mesmo estilo do remetente) */}
      {!isMae && volumeNumber && totalVolumes && (
        <div className="text-xl mt-4 pt-2 border-t-2 border-gray-300 font-bold text-center p-3 bg-blue-100 border-2 border-blue-300 rounded">
          <span className="font-bold">Volume:</span> 
          <span className="text-2xl font-black ml-2 text-blue-800">{volumeNumber}/{totalVolumes}</span>
        </div>
      )}
      
      {volumeData.descricao && volumeData.descricao !== `Volume ${volumeNumber}/${totalVolumes}` && (
        <div className="text-sm mt-2 pt-2 border-t-2 border-gray-300">
          <span className="font-bold">Descrição:</span> {volumeData.descricao}
        </div>
      )}
      
      {/* Quantidade de Volumes - DESTAQUE MAIOR (para etiqueta mãe) */}
      {isMae && (
        <div className="text-xl mt-4 pt-2 border-t-2 border-gray-300 font-bold text-center p-3 bg-purple-100 border-2 border-purple-300 rounded">
          <span className="font-bold">Total de volumes:</span> 
          <span className="text-3xl font-black ml-2 text-purple-800">{volumeData.quantidade || '0'}</span>
        </div>
      )}
    </div>
  );
};

export default PortraitLayout;
