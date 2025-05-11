
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { VolumeItem, calcularVolume, calcularPesoCubado, generateVolumeId } from '../utils/volumeCalculations';

interface VolumesInputFormProps {
  volumes: VolumeItem[];
  onChange: (volumes: VolumeItem[]) => void;
  readOnly?: boolean;
}

const VolumesInputForm: React.FC<VolumesInputFormProps> = ({ 
  volumes, 
  onChange,
  readOnly = false
}) => {
  const [novoVolume, setNovoVolume] = useState<VolumeItem>({
    id: '',
    altura: 0,
    largura: 0,
    comprimento: 0,
    peso: 0,
    quantidade: 1
  });

  const handleVolumeChange = (field: keyof VolumeItem, value: any) => {
    setNovoVolume(prev => {
      const updated = { ...prev, [field]: value };
      
      // Recalcular o volume e peso cubado
      if (['altura', 'largura', 'comprimento'].includes(field)) {
        const volume = calcularVolume(updated);
        const pesoCubado = calcularPesoCubado(volume);
        return { ...updated };
      }
      
      return updated;
    });
  };

  const adicionarVolume = () => {
    // Validar campos
    if (novoVolume.altura <= 0 || novoVolume.largura <= 0 || novoVolume.comprimento <= 0) {
      return;
    }
    
    // Adicionar ID único se não tiver
    const volumeComId = {
      ...novoVolume,
      id: novoVolume.id || generateVolumeId()
    };
    
    onChange([...volumes, volumeComId]);
    
    // Resetar form
    setNovoVolume({
      id: '',
      altura: 0,
      largura: 0,
      comprimento: 0,
      peso: 0,
      quantidade: 1
    });
  };

  const removerVolume = (indexToRemove: number) => {
    onChange(volumes.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      {volumes.length > 0 && (
        <div className="border rounded-md overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-50 text-xs">
              <tr>
                <th className="p-2 text-left">Altura (m)</th>
                <th className="p-2 text-left">Largura (m)</th>
                <th className="p-2 text-left">Comprimento (m)</th>
                <th className="p-2 text-left">Peso (kg)</th>
                <th className="p-2 text-left">Qtd</th>
                <th className="p-2 text-left">Volume (m³)</th>
                <th className="p-2 text-left">Peso Cubado (kg)</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {volumes.map((volume, index) => {
                const volumeCalculado = calcularVolume(volume);
                const pesoCubado = calcularPesoCubado(volumeCalculado);
                
                return (
                  <tr key={volume.id || index} className="border-t">
                    <td className="p-2">{volume.altura.toFixed(2)}</td>
                    <td className="p-2">{volume.largura.toFixed(2)}</td>
                    <td className="p-2">{volume.comprimento.toFixed(2)}</td>
                    <td className="p-2">{volume.peso.toFixed(2)}</td>
                    <td className="p-2">{volume.quantidade}</td>
                    <td className="p-2">{volumeCalculado.toFixed(3)}</td>
                    <td className="p-2">{pesoCubado.toFixed(2)}</td>
                    <td className="p-2">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removerVolume(index)}
                        disabled={readOnly}
                        className="h-8 w-8 text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {!readOnly && (
        <div className="grid grid-cols-6 gap-2 items-end">
          <div>
            <span className="text-xs">Altura (m)</span>
            <Input 
              type="number" 
              value={novoVolume.altura || ''} 
              onChange={(e) => handleVolumeChange('altura', parseFloat(e.target.value) || 0)}
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>
          <div>
            <span className="text-xs">Largura (m)</span>
            <Input 
              type="number" 
              value={novoVolume.largura || ''} 
              onChange={(e) => handleVolumeChange('largura', parseFloat(e.target.value) || 0)}
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>
          <div>
            <span className="text-xs">Comprimento (m)</span>
            <Input 
              type="number" 
              value={novoVolume.comprimento || ''} 
              onChange={(e) => handleVolumeChange('comprimento', parseFloat(e.target.value) || 0)}
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>
          <div>
            <span className="text-xs">Peso (kg)</span>
            <Input 
              type="number" 
              value={novoVolume.peso || ''} 
              onChange={(e) => handleVolumeChange('peso', parseFloat(e.target.value) || 0)}
              step="0.01"
              min="0"
              placeholder="0.00"
            />
          </div>
          <div>
            <span className="text-xs">Quantidade</span>
            <Input 
              type="number" 
              value={novoVolume.quantidade || ''} 
              onChange={(e) => handleVolumeChange('quantidade', parseInt(e.target.value) || 1)}
              min="1"
              placeholder="1"
            />
          </div>
          <div>
            <Button 
              type="button" 
              variant="outline"
              onClick={adicionarVolume}
              className="w-full"
              disabled={novoVolume.altura <= 0 || novoVolume.largura <= 0 || novoVolume.comprimento <= 0}
            >
              <Plus className="h-4 w-4 mr-1" /> Adicionar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolumesInputForm;
