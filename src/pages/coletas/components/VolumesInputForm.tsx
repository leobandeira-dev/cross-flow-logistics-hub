
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VolumeItem, calcularVolume, calcularPesoCubado, generateVolumeId } from '../utils/volumeCalculations';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface VolumesInputFormProps {
  volumes: VolumeItem[];
  onChange: (volumes: VolumeItem[]) => void;
}

const VolumesInputForm: React.FC<VolumesInputFormProps> = ({ volumes, onChange }) => {
  const adicionarVolume = () => {
    const novoVolume: VolumeItem = {
      id: generateVolumeId(),
      altura: 0,
      largura: 0,
      profundidade: 0,
      peso: 0,
      quantidade: 1
    };
    onChange([...volumes, novoVolume]);
  };

  const removerVolume = (id: string) => {
    onChange(volumes.filter(vol => vol.id !== id));
  };

  const atualizarVolume = (id: string, campo: keyof VolumeItem, valor: number) => {
    const novosVolumes = volumes.map(vol => {
      if (vol.id === id) {
        return { ...vol, [campo]: valor };
      }
      return vol;
    });
    onChange(novosVolumes);
  };

  // Calculate volume for a single item considering quantity
  const calcularVolumeTotalItem = (item: VolumeItem): number => {
    const volumeUnitario = calcularVolume(item.altura, item.largura, item.profundidade);
    return volumeUnitario * item.quantidade;
  };

  // Calculate total weight for a single item considering quantity
  const calcularPesoTotalItem = (item: VolumeItem): number => {
    return item.peso * item.quantidade;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-lg font-medium">Volumes</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={adicionarVolume}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Adicionar Volume
        </Button>
      </div>
      
      {volumes.length === 0 ? (
        <div className="text-gray-500 text-center py-4">
          Nenhum volume cadastrado. Clique em "Adicionar Volume" para começar.
        </div>
      ) : (
        <div className="space-y-3">
          {volumes.map((volume, index) => (
            <Card key={volume.id} className="bg-gray-50">
              <CardContent className="pt-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">Volume {index + 1}</div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-red-500 hover:text-red-700"
                    onClick={() => removerVolume(volume.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor={`altura-${volume.id}`}>Altura (cm)</Label>
                    <Input 
                      id={`altura-${volume.id}`}
                      type="number" 
                      min="0"
                      value={volume.altura || ''} 
                      onChange={(e) => atualizarVolume(volume.id, 'altura', Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor={`largura-${volume.id}`}>Largura (cm)</Label>
                    <Input 
                      id={`largura-${volume.id}`}
                      type="number" 
                      min="0"
                      value={volume.largura || ''} 
                      onChange={(e) => atualizarVolume(volume.id, 'largura', Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor={`profundidade-${volume.id}`}>Profundidade (cm)</Label>
                    <Input 
                      id={`profundidade-${volume.id}`}
                      type="number" 
                      min="0"
                      value={volume.profundidade || ''} 
                      onChange={(e) => atualizarVolume(volume.id, 'profundidade', Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor={`peso-${volume.id}`}>Peso (kg)</Label>
                    <Input 
                      id={`peso-${volume.id}`}
                      type="number" 
                      min="0" 
                      step="0.01"
                      value={volume.peso || ''} 
                      onChange={(e) => atualizarVolume(volume.id, 'peso', Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor={`quantidade-${volume.id}`}>Quantidade</Label>
                    <Input 
                      id={`quantidade-${volume.id}`}
                      type="number" 
                      min="1"
                      value={volume.quantidade} 
                      onChange={(e) => atualizarVolume(volume.id, 'quantidade', Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-1 flex flex-col">
                    <Label>Subtotais</Label>
                    <div className="text-sm mt-auto pb-2">
                      <div>Volume: {calcularVolumeTotalItem(volume).toFixed(3)} m³</div>
                      <div>Peso: {calcularPesoTotalItem(volume).toFixed(2)} kg</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="flex justify-end pt-2">
            <div className="text-right">
              <div className="font-medium">Total destes volumes:</div>
              <div className="text-sm">
                <div>Volume: {volumes.reduce((acc, vol) => acc + calcularVolumeTotalItem(vol), 0).toFixed(3)} m³</div>
                <div>Peso: {volumes.reduce((acc, vol) => acc + calcularPesoTotalItem(vol), 0).toFixed(2)} kg</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolumesInputForm;
