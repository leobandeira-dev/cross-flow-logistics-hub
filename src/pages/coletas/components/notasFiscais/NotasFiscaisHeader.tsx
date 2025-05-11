
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface NotasFiscaisHeaderProps {
  onAddNF: () => void;
}

const NotasFiscaisHeader: React.FC<NotasFiscaisHeaderProps> = ({ onAddNF }) => {
  return (
    <div className="flex justify-between items-center">
      <Label className="text-lg font-medium">Notas Fiscais</Label>
      <Button 
        type="button" 
        variant="outline" 
        onClick={onAddNF}
        className="flex items-center gap-1"
      >
        <Plus className="h-4 w-4" /> Adicionar Nota Fiscal
      </Button>
    </div>
  );
};

export default NotasFiscaisHeader;
