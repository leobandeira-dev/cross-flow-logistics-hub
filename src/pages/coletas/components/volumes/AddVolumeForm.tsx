
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { VolumeItem, generateVolumeId } from '../../utils/volumeCalculations';

interface AddVolumeFormProps {
  onAddVolume: (volume: VolumeItem) => void;
}

const AddVolumeForm: React.FC<AddVolumeFormProps> = ({ onAddVolume }) => {
  const [novoVolume, setNovoVolume] = useState<Omit<VolumeItem, "id">>({
    altura: 0,
    largura: 0,
    comprimento: 0,
    peso: 0, // We'll keep this in the state but not show it in the form
    quantidade: 1
  });

  const handleVolumeChange = (field: keyof Omit<VolumeItem, "id">, value: any) => {
    setNovoVolume(prev => ({ ...prev, [field]: value }));
  };

  const adicionarVolume = () => {
    // Validate fields
    if (novoVolume.altura <= 0 || novoVolume.largura <= 0 || novoVolume.comprimento <= 0) {
      return;
    }
    
    // Add unique ID
    const volumeComId: VolumeItem = {
      ...novoVolume,
      id: generateVolumeId()
    };
    
    onAddVolume(volumeComId);
    
    // Reset form
    setNovoVolume({
      altura: 0,
      largura: 0,
      comprimento: 0,
      peso: 0,
      quantidade: 1
    });
  };

  return (
    <div className="grid grid-cols-5 gap-2 items-end">
      <div>
        <span className="text-xs">Altura (cm)</span>
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
        <span className="text-xs">Largura (cm)</span>
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
        <span className="text-xs">Comprimento (cm)</span>
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
  );
};

export default AddVolumeForm;
