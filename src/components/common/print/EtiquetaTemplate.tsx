
import React from 'react';
import { Card } from '@/components/ui/card';

interface EtiquetaTemplateProps {
  volumeData: {
    id: string;
    notaFiscal: string;
    remetente: string;
    destinatario: string;
    endereco: string;
    cidade: string;
    uf: string;
    pesoTotal: string;
  };
  volumeNumber: number;
  totalVolumes: number;
}

const EtiquetaTemplate = React.forwardRef<HTMLDivElement, EtiquetaTemplateProps>(
  ({ volumeData, volumeNumber, totalVolumes }, ref) => {
    return (
      <div 
        ref={ref}
        className="etiqueta-container bg-white p-4 border border-gray-300 w-full max-w-[380px]"
        style={{ pageBreakInside: 'avoid', pageBreakAfter: 'always' }}
      >
        <Card className="border-2 border-black p-3">
          {/* Cabeçalho */}
          <div className="border-b-2 border-black pb-2 mb-2">
            <div className="flex justify-between items-center">
              <div className="text-xs">ETIQUETA DE VOLUME</div>
              <div className="font-bold text-lg">
                {volumeNumber}/{totalVolumes}
              </div>
            </div>
          </div>
          
          {/* Remetente */}
          <div className="mb-3">
            <div className="text-xs text-gray-600">REMETENTE</div>
            <div className="font-bold text-base">{volumeData.remetente}</div>
          </div>
          
          {/* Nota Fiscal */}
          <div className="mb-3 p-1 bg-gray-100">
            <div className="text-xs text-gray-600">NOTA FISCAL</div>
            <div className="font-bold text-lg">{volumeData.notaFiscal}</div>
          </div>
          
          {/* Destinatário */}
          <div className="mb-3">
            <div className="text-xs text-gray-600">DESTINATÁRIO</div>
            <div className="text-sm">{volumeData.destinatario}</div>
            <div className="text-xs">{volumeData.endereco}</div>
          </div>
          
          {/* Destino */}
          <div className="flex justify-between mb-3">
            <div className="flex-1 mr-2">
              <div className="text-xs text-gray-600">CIDADE</div>
              <div className="font-bold text-base">{volumeData.cidade}</div>
            </div>
            <div className="w-16 p-1 border border-black flex items-center justify-center">
              <div className="font-bold text-xl">{volumeData.uf}</div>
            </div>
          </div>
          
          {/* Peso total */}
          <div className="p-1 bg-gray-100">
            <div className="text-xs text-gray-600">PESO TOTAL</div>
            <div className="font-bold text-base">{volumeData.pesoTotal}</div>
          </div>
          
          {/* Código do volume */}
          <div className="mt-3 pt-2 border-t-2 border-black text-center">
            <div className="font-mono font-bold">{volumeData.id}</div>
          </div>
        </Card>
      </div>
    );
  }
);

EtiquetaTemplate.displayName = "EtiquetaTemplate";

export default EtiquetaTemplate;
