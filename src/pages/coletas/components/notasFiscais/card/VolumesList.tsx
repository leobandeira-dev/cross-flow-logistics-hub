
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { VolumeItem, calcularVolume, formatarNumero, calcularTotaisNota } from '../../../utils/volumeCalculations';

interface VolumesListProps {
  volumes: VolumeItem[];
  isReadOnly: boolean;
  onUpdateVolume: (volumeId: string, field: keyof VolumeItem, value: string) => void;
  onRemoveVolume: (volumeId: string) => void;
}

const VolumesList: React.FC<VolumesListProps> = ({
  volumes,
  isReadOnly,
  onUpdateVolume,
  onRemoveVolume
}) => {
  const totais = calcularTotaisNota(volumes);
  
  if (volumes.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">Nenhum volume adicionado</p>
    );
  }

  return (
    <div className="mb-3">
      <div className="grid grid-cols-8 gap-2 text-xs font-medium text-gray-500 mb-2">
        <div className="col-span-1">Seq</div>
        <div className="col-span-1">Alt. (cm)</div>
        <div className="col-span-1">Larg. (cm)</div>
        <div className="col-span-1">Comp. (cm)</div>
        <div className="col-span-1">Peso (kg)</div>
        <div className="col-span-1">Qtde</div>
        <div className="col-span-1">Vol. (m³)</div>
        <div className="col-span-1"></div>
      </div>
      
      {volumes.map((volume, idx) => {
        const volumeCalculado = calcularVolume(volume);
        
        return (
          <div key={volume.id} className="grid grid-cols-8 gap-2 mb-2">
            <div className="col-span-1">
              <Input
                value={idx + 1}
                readOnly
                className="h-8 text-xs text-center"
              />
            </div>
            <div className="col-span-1">
              <Input
                value={volume.altura}
                onChange={(e) => onUpdateVolume(volume.id, 'altura', e.target.value)}
                className="h-8 text-xs"
                disabled={isReadOnly}
              />
            </div>
            <div className="col-span-1">
              <Input
                value={volume.largura}
                onChange={(e) => onUpdateVolume(volume.id, 'largura', e.target.value)}
                className="h-8 text-xs"
                disabled={isReadOnly}
              />
            </div>
            <div className="col-span-1">
              <Input
                value={volume.comprimento}
                onChange={(e) => onUpdateVolume(volume.id, 'comprimento', e.target.value)}
                className="h-8 text-xs"
                disabled={isReadOnly}
              />
            </div>
            <div className="col-span-1">
              <Input
                value={volume.peso}
                onChange={(e) => onUpdateVolume(volume.id, 'peso', e.target.value)}
                className="h-8 text-xs"
                disabled={isReadOnly}
              />
            </div>
            <div className="col-span-1">
              <Input
                value={volume.quantidade}
                onChange={(e) => onUpdateVolume(volume.id, 'quantidade', e.target.value)}
                className="h-8 text-xs"
                disabled={isReadOnly}
              />
            </div>
            <div className="col-span-1">
              <Input
                value={formatarNumero(volumeCalculado)}
                readOnly
                className="h-8 text-xs text-right"
              />
            </div>
            <div className="col-span-1 flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onRemoveVolume(volume.id)} 
                className="h-8 px-2" 
                disabled={isReadOnly}
              >
                <Trash className="h-3 w-3 text-red-500" />
              </Button>
            </div>
          </div>
        );
      })}
      
      {/* Totals */}
      <div className="grid grid-cols-8 gap-2 mt-4 pt-2 border-t border-gray-200">
        <div className="col-span-5 text-right pr-2 text-sm font-medium">Totais:</div>
        <div className="col-span-1 text-center">
          <span className="text-sm font-semibold">{totais.qtdVolumes}</span>
        </div>
        <div className="col-span-1 text-right">
          <span className="text-sm font-semibold">{formatarNumero(totais.volumeTotal)}</span>
        </div>
        <div className="col-span-1"></div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
        <div className="col-span-1 flex flex-col">
          <span className="font-medium">Peso Total: <span className="font-semibold">{formatarNumero(totais.pesoTotal)} kg</span></span>
        </div>
        <div className="col-span-1 flex flex-col">
          <span className="font-medium">Volume Total: <span className="font-semibold">{formatarNumero(totais.volumeTotal)} m³</span></span>
        </div>
      </div>
    </div>
  );
};

export default VolumesList;
