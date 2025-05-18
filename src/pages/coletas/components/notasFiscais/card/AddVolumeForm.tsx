
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { VolumeItem } from '../../../utils/volumeCalculations';

interface AddVolumeFormProps {
  onAddVolume: (volume: Omit<VolumeItem, 'id'>) => void;
  isReadOnly: boolean;
}

const AddVolumeForm: React.FC<AddVolumeFormProps> = ({ onAddVolume, isReadOnly }) => {
  const [newVolume, setNewVolume] = useState<Partial<VolumeItem>>({
    altura: 0,
    largura: 0,
    comprimento: 0,
    peso: 0,
    quantidade: 1
  });

  const handleVolumeChange = (field: keyof VolumeItem, value: string) => {
    setNewVolume(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleAddVolume = () => {
    if (newVolume.altura && newVolume.largura && newVolume.comprimento && newVolume.peso) {
      onAddVolume({
        altura: newVolume.altura || 0,
        largura: newVolume.largura || 0,
        comprimento: newVolume.comprimento || 0,
        peso: newVolume.peso || 0,
        quantidade: newVolume.quantidade || 1
      });
      
      // Reset form
      setNewVolume({
        altura: 0,
        largura: 0,
        comprimento: 0,
        peso: 0,
        quantidade: 1
      });
    }
  };

  if (isReadOnly) {
    return null;
  }

  return (
    <div className="grid grid-cols-8 gap-2">
      <div className="col-span-1">
        <label className="text-xs text-muted-foreground">Alt. (cm)</label>
        <Input
          value={newVolume.altura || ''}
          onChange={(e) => handleVolumeChange('altura', e.target.value)}
          className="h-8 text-xs"
          placeholder="0"
          type="number"
        />
      </div>
      <div className="col-span-1">
        <label className="text-xs text-muted-foreground">Larg. (cm)</label>
        <Input
          value={newVolume.largura || ''}
          onChange={(e) => handleVolumeChange('largura', e.target.value)}
          className="h-8 text-xs"
          placeholder="0"
          type="number"
        />
      </div>
      <div className="col-span-1">
        <label className="text-xs text-muted-foreground">Comp. (cm)</label>
        <Input
          value={newVolume.comprimento || ''}
          onChange={(e) => handleVolumeChange('comprimento', e.target.value)}
          className="h-8 text-xs"
          placeholder="0"
          type="number"
        />
      </div>
      <div className="col-span-1">
        <label className="text-xs text-muted-foreground">Peso (kg)</label>
        <Input
          value={newVolume.peso || ''}
          onChange={(e) => handleVolumeChange('peso', e.target.value)}
          className="h-8 text-xs"
          placeholder="0"
          type="number"
        />
      </div>
      <div className="col-span-1">
        <label className="text-xs text-muted-foreground">Qtde</label>
        <Input
          value={newVolume.quantidade || 1}
          onChange={(e) => handleVolumeChange('quantidade', e.target.value)}
          className="h-8 text-xs"
          placeholder="1"
          type="number"
          min="1"
        />
      </div>
      <div className="col-span-3 flex items-end">
        <Button 
          onClick={handleAddVolume}
          className="h-8"
          disabled={!newVolume.altura || !newVolume.largura || !newVolume.comprimento || !newVolume.peso}
        >
          <Plus className="h-4 w-4 mr-1" /> Adicionar Volume
        </Button>
      </div>
    </div>
  );
};

export default AddVolumeForm;
