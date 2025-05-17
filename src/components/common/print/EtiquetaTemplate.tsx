
import React from 'react';
import { Card } from '@/components/ui/card';
import { Biohazard, QrCode, Package, Truck } from 'lucide-react';
import QRCodeGenerator from './QRCodeGenerator';

interface EtiquetaTemplateProps {
  volumeData: {
    id: string;
    notaFiscal: string;
    remetente: string;
    destinatario: string;
    endereco: string;
    cidade: string;
    cidadeCompleta?: string;
    uf: string;
    pesoTotal: string;
    tipoVolume?: 'geral' | 'quimico';
    codigoONU?: string;
    codigoRisco?: string;
    etiquetaMae?: string;
    chaveNF?: string;
    descricao?: string;
    quantidade?: number;
    transportadora?: string; // Added transportadora field
  };
  volumeNumber: number;
  totalVolumes: number;
  format?: 'small' | 'a4';
  tipo?: 'volume' | 'mae';
  layoutStyle?: 'compact' | 'standard' | 'modern';
}

const EtiquetaTemplate = React.forwardRef<HTMLDivElement, EtiquetaTemplateProps>(
  ({ volumeData, volumeNumber, totalVolumes, format = 'small', tipo = 'volume', layoutStyle = 'standard' }, ref) => {
    // Define width based on format
    const isA4 = format === 'a4';
    const width = isA4 ? 'max-w-[800px]' : 'max-w-[500px]';
    const isQuimico = volumeData.tipoVolume === 'quimico';
    const isMae = tipo === 'mae';
    const displayCidade = volumeData.cidadeCompleta || volumeData.cidade;
    
    // For etiqueta mãe with no linked volumes
    const isStandaloneEtiquetaMae = isMae && !volumeData.notaFiscal;
    
    // Render the selected layout based on layoutStyle
    const renderLayout = () => {
      switch (layoutStyle) {
        case 'compact':
          return renderCompactLayout();
        case 'modern':
          return renderModernLayout();
        case 'standard':
        default:
          return renderStandardLayout();
      }
    };
    
    // Compact layout - optimized for small labels, inspired by Braspress
    const renderCompactLayout = () => (
      <Card className={`border-2 ${isMae ? 'border-red-500' : 'border-black'} p-2`}>
        {isMae && (
          <div className="mb-2 text-center bg-red-500 text-white p-1 rounded">
            <div className="font-bold text-sm">ETIQUETA MÃE - ID: {volumeData.etiquetaMae}</div>
          </div>
        )}
        
        <div className="grid grid-cols-7 gap-2 text-xs">
          {/* Header - Left: QR Code */}
          <div className="col-span-2 flex flex-col items-center justify-start">
            <QRCodeGenerator text={volumeData.id} size={60} />
            <div className="text-xs mt-1 font-mono truncate w-full text-center">{volumeData.id}</div>
          </div>
          
          {/* Header - Right: NF and Volume info */}
          <div className="col-span-5">
            {/* Highlighted Supplier Info */}
            <div className="bg-blue-100 px-1 py-0.5 rounded mb-1 border border-blue-300">
              <span className="text-xs text-gray-600">FORNECEDOR:</span>
              <span className="font-bold ml-1">{volumeData.remetente}</span>
            </div>
            
            <div className="flex justify-between items-center mb-1">
              {/* Highlighted NF */}
              <div className="bg-yellow-100 px-1 py-0.5 rounded w-full mr-1 border border-yellow-300">
                <span className="text-xs text-gray-600">NF:</span>
                <span className="font-bold ml-1">{volumeData.notaFiscal}</span>
              </div>
              <div className="bg-gray-800 text-white px-2 py-0.5 rounded text-center min-w-[40px]">
                <span className="font-bold">{volumeNumber}/{totalVolumes}</span>
              </div>
            </div>
            
            <div className="bg-gray-100 px-1 py-0.5 rounded mb-1">
              <span className="text-xs text-gray-600">TIPO:</span>
              <span className="font-bold ml-1">{isQuimico ? 'QUÍMICO' : 'CARGA GERAL'}</span>
            </div>
            
            <div className="bg-gray-100 px-1 py-0.5 rounded">
              <span className="text-xs text-gray-600">PESO:</span>
              <span className="font-bold ml-1">{volumeData.pesoTotal}</span>
            </div>
          </div>
          
          {/* Added Transportadora */}
          <div className="col-span-7 bg-gray-100 px-1 py-0.5 rounded mt-1 mb-1">
            <span className="text-xs text-gray-600">TRANSPORTADORA:</span>
            <span className="font-bold ml-1">{volumeData.transportadora || "N/D"}</span>
          </div>
          
          {/* Sender and Recipient */}
          <div className="col-span-7 grid grid-cols-2 gap-1 mt-1">
            <div>
              <div className="text-xs text-gray-600">REMETENTE</div>
              <div className="font-semibold truncate">{volumeData.remetente}</div>
            </div>
            
            <div className="bg-gray-100 px-1 py-0.5 rounded">
              <div className="text-xs text-gray-600">DESTINATÁRIO</div>
              <div className="font-bold truncate">{volumeData.destinatario}</div>
            </div>
          </div>
          
          {/* Destination - Highlighted City */}
          <div className="col-span-5">
            <div className="text-xs text-gray-600">ENDEREÇO DE DESTINO</div>
            <div className="font-semibold truncate text-xs">{volumeData.endereco}</div>
            <div className="font-bold mt-0.5 bg-green-100 px-1 py-0.5 rounded border border-green-300">
              {displayCidade}
            </div>
          </div>
          
          <div className="col-span-2 flex items-center justify-center">
            <div className="w-full h-10 border border-black flex items-center justify-center">
              <div className="font-bold text-2xl">{volumeData.uf}</div>
            </div>
          </div>
          
          {/* Chemical product info if applicable */}
          {isQuimico && (
            <div className="col-span-7 bg-yellow-100 p-1 border border-yellow-500 rounded flex justify-between items-center mt-1">
              <div>
                <div className="text-xs font-bold">PRODUTO QUÍMICO</div>
                <div className="text-xs">
                  <span className="font-bold">ONU:</span> {volumeData.codigoONU}
                  <span className="font-bold ml-2">RISCO:</span> {volumeData.codigoRisco}
                </div>
              </div>
              <Biohazard size={24} className="text-red-600" />
            </div>
          )}
        </div>
      </Card>
    );
    
    // Standard layout - similar to the original but with better space utilization
    const renderStandardLayout = () => (
      <Card className={`border-2 ${isMae ? 'border-red-500' : 'border-black'} p-3`}>
        {isMae && (
          <div className="mb-2 text-center bg-red-500 text-white p-1 rounded">
            <div className="font-bold text-lg">ETIQUETA MÃE</div>
            <div className="text-sm">ID: {volumeData.etiquetaMae}</div>
            {volumeData.descricao && <div className="text-sm">{volumeData.descricao}</div>}
          </div>
        )}
        
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
            
            {/* Transportadora - Added */}
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
            {/* Destinatário - Highlighted like other important fields */}
            <div className="p-1 bg-gray-100">
              <div className="text-xs text-gray-600">DESTINATÁRIO</div>
              <div className="font-bold text-base">{volumeData.destinatario || 'A definir'}</div>
              <div className="text-xs">{volumeData.endereco || ''}</div>
            </div>
            
            {/* Destino - Highlighted city */}
            <div className="flex space-x-2 items-center">
              <div className="flex-1 p-1 bg-green-100 border border-green-300 rounded">
                <div className="text-xs text-gray-600">CIDADE</div>
                <div className="font-bold text-base">{displayCidade || 'A definir'}</div>
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
                      <span className="font-bold">ONU:</span> {volumeData.codigoONU}
                    </div>
                    <div className="text-sm">
                      <span className="font-bold">RISCO:</span> {volumeData.codigoRisco}
                    </div>
                  </div>
                  <Biohazard size={40} className="text-red-600" />
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
    
    // Modern layout - inspired by Jadlog/UPS
    const renderModernLayout = () => (
      <Card className={`border-2 ${isMae ? 'border-red-500' : 'border-black'} p-0 overflow-hidden`}>
        {/* Header bar */}
        <div className={`${isMae ? 'bg-red-500' : 'bg-black'} text-white p-2 flex justify-between items-center`}>
          <div className="flex items-center">
            {isMae ? (
              <Package size={24} className="mr-2" />
            ) : (
              <Truck size={24} className="mr-2" />
            )}
            <div>
              <div className="font-bold">
                {isMae ? 'ETIQUETA MÃE' : 'ETIQUETA DE VOLUME'}
              </div>
              <div className="text-sm">
                {isMae ? `ID: ${volumeData.etiquetaMae}` : `VOL: ${volumeNumber}/${totalVolumes}`}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs">DATA</div>
            <div>{new Date().toLocaleDateString('pt-BR')}</div>
          </div>
        </div>
        
        <div className="p-3">
          {/* Highlighted transportadora */}
          <div className="bg-gray-100 p-2 rounded mb-3">
            <div className="text-xs text-gray-600">TRANSPORTADORA</div>
            <div className="font-bold">{volumeData.transportadora || "N/D"}</div>
          </div>
          
          {/* Two column layout for main content */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left column: QR Code and core identification */}
            <div className="flex flex-col space-y-3">
              <div className="flex flex-col items-center">
                <QRCodeGenerator text={volumeData.id} size={100} />
                <div className="text-xs mt-1 font-mono">{volumeData.id}</div>
              </div>
              
              {/* Highlighted Fornecedor */}
              <div className="bg-blue-100 p-2 rounded border border-blue-300">
                <div className="text-xs text-gray-600">FORNECEDOR</div>
                <div className="font-bold text-lg text-center">{volumeData.remetente}</div>
              </div>
              
              {/* Highlighted Nota Fiscal */}
              <div className="bg-yellow-100 p-2 rounded border border-yellow-300">
                <div className="text-xs text-gray-600">NOTA FISCAL</div>
                <div className="font-bold text-xl text-center">{volumeData.notaFiscal}</div>
              </div>
              
              {isQuimico && (
                <div className="bg-yellow-100 p-2 border-2 border-yellow-500 rounded flex items-center space-x-2">
                  <Biohazard size={30} className="text-red-600" />
                  <div>
                    <div className="text-xs font-bold">PRODUTO QUÍMICO</div>
                    <div className="text-xs">
                      <span className="font-bold">ONU:</span> {volumeData.codigoONU}
                    </div>
                    <div className="text-sm">
                      <span className="font-bold">RISCO:</span> {volumeData.codigoRisco}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Right column: Address details and specifics */}
            <div className="flex flex-col space-y-3">
              {/* Remetente */}
              <div>
                <div className="text-xs text-gray-600">REMETENTE</div>
                <div className="font-bold">{volumeData.remetente}</div>
              </div>
              
              {/* Destinatário - Highlighted with background like other key fields */}
              <div className="bg-gray-100 p-2 rounded">
                <div className="text-xs text-gray-600">DESTINATÁRIO</div>
                <div className="font-bold">{volumeData.destinatario}</div>
                <div className="text-sm">{volumeData.endereco}</div>
              </div>
              
              {/* Destination with UF highlight and highlighted city */}
              <div className="flex space-x-2 items-center">
                <div className="flex-1 bg-green-100 p-2 rounded border border-green-300">
                  <div className="text-xs text-gray-600">CIDADE</div>
                  <div className="font-bold">{displayCidade}</div>
                </div>
                <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-full border-2 border-black">
                  <div className="font-bold text-xl">{volumeData.uf}</div>
                </div>
              </div>
              
              {/* Volume type and weight */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-100 p-2 rounded">
                  <div className="text-xs text-gray-600">TIPO</div>
                  <div className="font-bold">{isQuimico ? 'QUÍMICO' : 'GERAL'}</div>
                </div>
                <div className="bg-gray-100 p-2 rounded">
                  <div className="text-xs text-gray-600">PESO</div>
                  <div className="font-bold">{volumeData.pesoTotal}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
    
    return (
      <div 
        ref={ref}
        className={`etiqueta-container bg-white p-4 border border-gray-300 w-full ${width}`}
        style={{ 
          pageBreakInside: 'avoid', 
          pageBreakAfter: 'always',
        }}
      >
        {renderLayout()}
      </div>
    );
  }
);

EtiquetaTemplate.displayName = "EtiquetaTemplate";

export default EtiquetaTemplate;
