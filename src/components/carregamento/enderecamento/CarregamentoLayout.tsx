
import React from 'react';
import OrderSelectionForm from './OrderSelectionForm';
import VolumeFilterSection from './VolumeFilterSection';
import VolumeList from './VolumeList';
import TruckLayoutGrid from './TruckLayoutGrid';
import InstructionsCard from './InstructionsCard';

interface CarregamentoLayoutProps {
  orderNumber: string | null;
  volumes: any[];
  volumesFiltrados: any[];
  selecionados: string[];
  caminhaoLayout: any[];
  onOrderFormSubmit: (data: any) => void;
  onFilter: (searchValue: string, searchType: 'volume' | 'etiquetaMae' | 'notaFiscal') => void;
  onSelectionToggle: (id: string) => void;
  onSelectAll: () => void;
  onCellClick: (cellId: string) => void;
  onRemoveVolume: (volumeId: string, cellId: string) => void;
  onSaveLayout: () => void;
  hasSelectedVolumes: boolean;
  allVolumesPositioned: boolean;
}

const CarregamentoLayout: React.FC<CarregamentoLayoutProps> = ({
  orderNumber,
  volumes,
  volumesFiltrados,
  selecionados,
  caminhaoLayout,
  onOrderFormSubmit,
  onFilter,
  onSelectionToggle,
  onSelectAll,
  onCellClick,
  onRemoveVolume,
  onSaveLayout,
  hasSelectedVolumes,
  allVolumesPositioned
}) => {
  return (
    <div className="grid grid-cols-1 gap-6">
      <OrderSelectionForm onSubmit={onOrderFormSubmit} />
      
      {orderNumber && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <VolumeFilterSection onFilter={onFilter} />
              <VolumeList 
                volumes={volumesFiltrados}
                selecionados={selecionados}
                onSelectionToggle={onSelectionToggle}
                onSelectAll={onSelectAll}
              />
            </div>
            
            <div className="lg:col-span-2">
              <TruckLayoutGrid 
                orderNumber={orderNumber}
                layout={caminhaoLayout}
                totalVolumes={volumes.length}
                positionedVolumes={volumes.filter(v => v.posicionado).length}
                onCellClick={onCellClick}
                onRemoveVolume={onRemoveVolume}
                hasSelectedVolumes={hasSelectedVolumes}
                onSaveLayout={onSaveLayout}
                allVolumesPositioned={allVolumesPositioned}
              />
              <InstructionsCard />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CarregamentoLayout;
