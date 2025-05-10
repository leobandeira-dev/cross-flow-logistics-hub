
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Truck } from 'lucide-react';

interface Volume {
  id: string;
  descricao: string;
  peso: string;
  fragil: boolean;
  posicionado: boolean;
  etiquetaMae: string;
  notaFiscal: string;
  fornecedor: string;
}

interface CellLayout {
  id: string;
  coluna: 'esquerda' | 'centro' | 'direita';
  linha: number;
  volumes: Volume[];
}

interface TruckLayoutGridProps {
  orderNumber: string;
  layout: CellLayout[];
  totalVolumes: number;
  positionedVolumes: number;
  onCellClick: (cellId: string) => void;
  onRemoveVolume: (volumeId: string, cellId: string) => void;
  hasSelectedVolumes: boolean;
  onSaveLayout: () => void;
  allVolumesPositioned: boolean;
}

const TruckLayoutGrid: React.FC<TruckLayoutGridProps> = ({
  orderNumber,
  layout,
  totalVolumes,
  positionedVolumes,
  onCellClick,
  onRemoveVolume,
  hasSelectedVolumes,
  onSaveLayout,
  allVolumesPositioned
}) => {
  // Agrupar o layout por linhas para exibição
  const layoutPorLinhas = Array.from({ length: 20 }, (_, i) => {
    const linha = i + 1;
    return {
      linha,
      celulas: layout.filter(c => c.linha === linha)
    };
  });

  // Contar volumes por nota fiscal
  const contarVolumesPorNF = (volumes: Volume[]) => {
    const notasCount: Record<string, { fornecedor: string, count: number }> = {};
    
    volumes.forEach(v => {
      if (!notasCount[v.notaFiscal]) {
        notasCount[v.notaFiscal] = { fornecedor: v.fornecedor, count: 0 };
      }
      notasCount[v.notaFiscal].count += 1;
    });

    return Object.entries(notasCount).map(([nf, info]) => ({
      nf,
      fornecedor: info.fornecedor,
      count: info.count
    }));
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Truck className="mr-2 text-cross-blue" size={20} />
          Layout do Caminhão (Visão por Células)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md p-4 bg-gray-50">
          <div className="flex justify-between mb-4">
            <div>
              <span className="text-sm font-medium">OC: {orderNumber}</span>
            </div>
            <div>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {positionedVolumes} / {totalVolumes} volumes posicionados
              </span>
            </div>
          </div>
          
          <div className="mb-2 overflow-x-auto">
            {/* Cabeçalho */}
            <div className="flex w-full min-w-[600px] mb-2 text-center font-medium border-b pb-2">
              <div className="w-[50px]">Linha</div>
              <div className="flex-1">Esquerda</div>
              <div className="flex-1">Centro</div>
              <div className="flex-1">Direita</div>
            </div>

            {/* Layout */}
            <div className="max-h-[500px] overflow-y-auto">
              {layoutPorLinhas.map(linha => (
                <div key={linha.linha} className="flex w-full min-w-[600px] mb-1 border-b pb-1">
                  <div className="w-[50px] flex items-center justify-center font-medium border-r">
                    {linha.linha}
                  </div>
                  
                  {linha.celulas.map(celula => {
                    const volumesInfo = contarVolumesPorNF(celula.volumes);
                    
                    return (
                      <div 
                        key={celula.id} 
                        className={`flex-1 border-r last:border-r-0 p-2 min-h-[80px] ${
                          hasSelectedVolumes ? 'hover:bg-blue-50 cursor-pointer' : ''
                        } ${celula.volumes.length > 0 ? 'bg-white' : ''}`}
                        onClick={() => onCellClick(celula.id)}
                      >
                        {volumesInfo.length > 0 ? (
                          <div className="text-xs space-y-1">
                            {volumesInfo.map((info, idx) => (
                              <div key={idx} className="p-1 border rounded bg-white">
                                <div className="font-medium">{info.nf}</div>
                                <div className="text-gray-600 truncate">{info.fornecedor}</div>
                                <div className="flex justify-between">
                                  <span>{info.count} vol.</span>
                                  <Button 
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 w-5 p-0 text-gray-400 hover:text-red-500"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      celula.volumes
                                        .filter(v => v.notaFiscal === info.nf)
                                        .forEach(v => onRemoveVolume(v.id, celula.id));
                                    }}
                                  >
                                    ×
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full text-xs text-gray-400">
                            {hasSelectedVolumes ? 'Clique para alocar' : 'Vazio'}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button 
            className="bg-cross-blue hover:bg-cross-blue/90"
            disabled={!allVolumesPositioned}
            onClick={onSaveLayout}
          >
            Salvar Layout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TruckLayoutGrid;
