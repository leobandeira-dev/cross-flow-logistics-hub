
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import CarregamentoLayout from '@/components/carregamento/enderecamento/CarregamentoLayout';
import { useEnderecamento } from '@/hooks/useEnderecamento';

const Enderecamento: React.FC = () => {
  const {
    ordemSelecionada,
    volumes,
    volumesFiltrados,
    selecionados,
    caminhaoLayout,
    handleOrderFormSubmit,
    filtrarVolumes,
    toggleSelecao,
    selecionarTodos,
    moverVolumesSelecionados,
    removerVolume,
    saveLayout,
    allVolumesPositioned
  } = useEnderecamento();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <MapPin className="mr-2 text-cross-blue" size={24} />
            Endereçamento de Carregamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CarregamentoLayout
            orderNumber={ordemSelecionada}
            volumes={volumes}
            volumesFiltrados={volumesFiltrados}
            selecionados={selecionados}
            caminhaoLayout={caminhaoLayout}
            onOrderFormSubmit={handleOrderFormSubmit}
            onFilter={filtrarVolumes}
            onSelectionToggle={toggleSelecao}
            onSelectAll={selecionarTodos}
            onCellClick={moverVolumesSelecionados}
            onRemoveVolume={removerVolume}
            onSaveLayout={saveLayout}
            hasSelectedVolumes={selecionados.length > 0}
            allVolumesPositioned={allVolumesPositioned}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Enderecamento;
