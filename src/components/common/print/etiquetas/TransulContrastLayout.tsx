
import React from 'react';
import { Card } from '@/components/ui/card';
import { QrCode, Biohazard, TestTube } from 'lucide-react';
import TransulLogo from './TransulLogo';
import EmpresaLogo from './EmpresaLogo';

interface TransulContrastLayoutProps {
  volumeData: any;
  volumeNumber?: number;
  totalVolumes?: number;
  isMae?: boolean;
  isQuimico?: boolean;
  displayCidade?: string;
  getClassificacaoText?: () => string;
  transportadoraLogo?: string;
}

const TransulContrastLayout: React.FC<TransulContrastLayoutProps> = ({
  volumeData,
  volumeNumber = 1,
  totalVolumes = 1,
  isMae = false,
  isQuimico = false,
  displayCidade,
  transportadoraLogo
}) => {
  return (
    <div className="bg-white">
      {/* Header preto com logos */}
      <div className="bg-black text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <EmpresaLogo className="max-h-10 object-contain bg-white p-1 rounded" />
          <div className="border-l-2 border-white pl-4">
            <TransulLogo 
              className="object-contain bg-white p-2 rounded"
              style={{ width: '140px', height: '42px' }}
            />
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-black">
            {isMae ? 'ETIQUETA MÃE' : `VOLUME ${volumeNumber}/${totalVolumes}`}
          </div>
          <div className="text-sm">
            {new Date().toLocaleDateString('pt-BR')}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Grid principal */}
        <div className="grid grid-cols-3 gap-6">
          {/* Coluna 1: QR Code */}
          <div className="flex flex-col items-center space-y-3">
            <div className="bg-white p-4 rounded border-4 border-black shadow-lg">
              <QrCode size={90} className="mx-auto" />
            </div>
            <div className="text-center bg-black text-white p-2 rounded w-full">
              <div className="text-sm font-bold">CÓDIGO</div>
              <div className="text-xl font-black font-mono">
                {volumeData.codigo || volumeData.id}
              </div>
            </div>
          </div>

          {/* Coluna 2: Informações principais */}
          <div className="space-y-4">
            {/* Nota Fiscal - CONTAINER PRETO */}
            <div className="bg-black border-4 border-gray-800 rounded-xl p-4 text-center shadow-xl">
              <div className="text-sm text-white font-black">NOTA FISCAL</div>
              <div className="text-4xl font-black text-white mt-2 tracking-wider">
                {volumeData.chave_nf || volumeData.notaFiscal || 'N/A'}
              </div>
            </div>

            {/* Peso Total */}
            <div className="bg-black border-4 border-gray-800 rounded-xl p-3 text-center shadow-xl">
              <div className="text-sm text-white font-black">PESO TOTAL</div>
              <div className="text-2xl font-black text-white mt-1">
                {volumeData.peso_total_bruto || volumeData.pesoTotal || '0 Kg'}
              </div>
            </div>

            {/* Produto Químico */}
            {isQuimico && (
              <div className="bg-red-600 border-4 border-red-800 rounded-xl p-3 text-white shadow-xl">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <TestTube size={24} className="text-white" />
                  <span className="text-lg font-black">QUÍMICO</span>
                  <Biohazard size={24} className="text-white" />
                </div>
                {volumeData.codigo_onu && (
                  <div className="text-center text-sm font-bold">
                    <div>ONU: {volumeData.codigo_onu}</div>
                    {volumeData.codigo_risco && (
                      <div>RISCO: {volumeData.codigo_risco}</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Coluna 3: Destino */}
          <div className="space-y-4">
            {/* Cidade Destino - CONTAINER PRETO */}
            <div className="bg-black border-4 border-gray-800 rounded-xl p-4 text-center shadow-xl">
              <div className="text-sm text-white font-black">CIDADE DESTINO</div>
              <div className="text-3xl font-black text-white mt-2 leading-tight">
                {displayCidade || `${volumeData.cidade || 'N/A'}`}
              </div>
              <div className="text-2xl font-black text-white mt-1">
                {volumeData.uf || ''}
              </div>
            </div>

            {/* Quantidade de Volumes para Etiqueta Mãe */}
            {isMae && (
              <div className="bg-black border-4 border-gray-800 rounded-xl p-4 text-center shadow-xl">
                <div className="text-sm text-white font-black">QTD VOLUMES</div>
                <div className="text-4xl font-black text-white mt-2">
                  {volumeData.quantidade || totalVolumes}
                </div>
              </div>
            )}

            {/* Área */}
            <div className="bg-gray-200 border-3 border-gray-600 rounded-lg p-3 text-center">
              <div className="text-sm text-gray-700 font-bold">ÁREA</div>
              <div className="text-xl font-black text-gray-900">
                {volumeData.area || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Remetente e Destinatário */}
        <div className="grid grid-cols-2 gap-4">
          {/* Remetente - CONTAINER PRETO */}
          <div className="bg-black border-4 border-gray-800 rounded-xl p-4 shadow-xl">
            <div className="text-sm text-white font-black">REMETENTE</div>
            <div className="text-lg font-black text-white leading-tight mt-2">
              {volumeData.remetente || 'N/A'}
            </div>
          </div>

          {/* Destinatário */}
          <div className="bg-gray-200 border-3 border-gray-600 rounded-lg p-4">
            <div className="text-sm text-gray-700 font-bold">DESTINATÁRIO</div>
            <div className="text-lg font-bold text-gray-900 leading-tight mt-2">
              {volumeData.destinatario || 'N/A'}
            </div>
          </div>
        </div>

        {/* Footer com informações adicionais */}
        <div className="bg-gray-100 border-2 border-gray-400 rounded-lg p-3">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-700 font-bold">Endereço:</span>
              <div className="text-gray-900 font-medium">{volumeData.endereco || 'N/A'}</div>
            </div>
            <div>
              <span className="text-gray-700 font-bold">Descrição:</span>
              <div className="text-gray-900 font-medium">{volumeData.descricao || 'N/A'}</div>
            </div>
            <div>
              <span className="text-gray-700 font-bold">Quantidade:</span>
              <div className="text-gray-900 font-medium">{volumeData.quantidade || '1'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransulContrastLayout;
