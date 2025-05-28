
import React from 'react';
import { TestTube, Biohazard } from 'lucide-react';
import QRCodeGenerator from '../QRCodeGenerator';
import { EtiquetaLayoutProps } from './types';

interface EnhancedReadabilityLayoutProps extends EtiquetaLayoutProps {
  transportadoraLogo?: string;
}

const EnhancedReadabilityLayout: React.FC<EnhancedReadabilityLayoutProps> = ({
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
    <div className="h-full flex p-4">
      {/* Ícone químico se aplicável */}
      {isQuimico && (
        <div className="absolute top-3 right-3 bg-red-100 border-2 border-red-500 rounded-full p-2">
          <Biohazard size={32} className="text-red-600" />
        </div>
      )}
      
      {/* Header */}
      <div className="text-center text-lg font-bold border-b-2 border-gray-300 pb-2 mb-4 w-full">
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
      
      <div className="flex flex-1">
        {/* Coluna principal com informações */}
        <div className="flex-[2] pr-4">
          <div className="text-sm mb-2">
            <span className="font-bold">ID:</span> {volumeData.id}
          </div>
          
          {/* Nota Fiscal - DESTAQUE */}
          <div className="text-sm mb-2 bg-yellow-200 p-2 rounded border-2 border-yellow-400">
            <span className="font-bold">NF:</span> <span className="text-xl font-bold">{volumeData.notaFiscal || 'N/A'}</span>
          </div>
          
          {/* Remetente - DESTAQUE */}
          <div className="text-sm mb-2 bg-blue-100 p-2 rounded border-2 border-blue-300">
            <span className="font-bold">Remetente:</span> <span className="text-base font-bold">{volumeData.remetente || 'N/A'}</span>
          </div>
          
          <div className="text-sm mb-2">
            <span className="font-bold">Destinatário:</span> {volumeData.destinatario || 'N/A'}
          </div>
          
          <div className="text-sm mb-2">
            <span className="font-bold">Endereço:</span> {volumeData.endereco || 'N/A'}
          </div>
          
          {/* Cidade Destino - DESTAQUE */}
          <div className="text-lg mb-2 bg-green-100 p-2 rounded border-2 border-green-400">
            <span className="font-bold">Cidade/UF:</span> <span className="text-xl font-bold">{displayCidade}</span>/<span className="text-xl font-bold">{volumeData.uf || 'N/A'}</span>
          </div>
          
          <div className="text-sm mb-2">
            <span className="font-bold">Peso:</span> {volumeData.pesoTotal || '0 Kg'}
          </div>
          
          <div className="text-sm mb-2">
            <span className="font-bold">Transportadora:</span> {volumeData.transportadora || 'N/D'}
          </div>
          
          {/* Quantidade - DESTAQUE MUITO MAIOR */}
          {volumeData.quantidade && (
            <div className="text-xl mb-2 bg-orange-100 p-4 rounded border-4 border-orange-400">
              <span className="font-bold text-lg">Quantidade:</span> 
              <span className="text-4xl font-black ml-2 text-orange-800">{volumeData.quantidade}</span>
            </div>
          )}
          
          {isQuimico && (
            <>
              <div className="text-sm mb-2 bg-red-100 p-2 rounded border-2 border-red-300">
                <span className="font-bold">Código ONU:</span> {volumeData.codigoONU || 'N/A'}
              </div>
              <div className="text-sm mb-2 bg-red-100 p-2 rounded border-2 border-red-300">
                <span className="font-bold">Código de Risco:</span> {volumeData.codigoRisco || 'N/A'}
              </div>
              <div className="text-sm mb-2 bg-red-100 p-2 rounded border-2 border-red-300">
                <span className="font-bold">Classificação:</span> {getClassificacaoText()}
              </div>
            </>
          )}
        </div>
        
        {/* Coluna do QR Code */}
        <div className="flex-1 flex flex-col justify-center items-center">
          <QRCodeGenerator text={volumeData.id} size={100} />
          <div className="text-center text-xs mt-2 font-bold">{volumeData.id}</div>
          
          {/* Área - APENAS O NÚMERO, DESTAQUE MUITO MAIOR */}
          {volumeData.area && (
            <div className="mt-4 bg-indigo-600 text-white p-8 rounded-lg border-4 border-indigo-800 text-center shadow-lg">
              <div className="text-xl font-bold mb-3">ÁREA</div>
              <div className="text-9xl font-black leading-none">{volumeData.area}</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Volume - DESTAQUE MAIOR com estilo igual ao remetente */}
      {!isMae && volumeNumber && totalVolumes && (
        <div className="text-xl mt-2 pt-2 border-t-2 border-gray-300 bg-blue-100 p-4 rounded border-4 border-blue-300">
          <span className="font-bold text-lg">Volume:</span> 
          <span className="text-4xl font-black ml-2 text-blue-800">{volumeNumber}/{totalVolumes}</span>
        </div>
      )}
      
      {/* Quantidade de Volumes - DESTAQUE MAIOR (para etiqueta mãe) */}
      {isMae && (
        <div className="text-xl mt-2 pt-2 border-t-2 border-gray-300 bg-purple-100 p-4 rounded border-4 border-purple-400">
          <span className="font-bold text-lg">Total de volumes:</span> 
          <span className="text-4xl font-black ml-2 text-purple-800">{volumeData.quantidade || '0'}</span>
        </div>
      )}
    </div>
  );
};

export default EnhancedReadabilityLayout;
