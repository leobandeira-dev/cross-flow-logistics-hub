
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, MessageSquare } from 'lucide-react';
import { DialogTrigger } from "@/components/ui/dialog";
import { Carga } from '../../types/coleta.types';

interface ActionButtonsProps {
  carga: Carga;
  setSelectedCarga: (carga: Carga) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  carga, 
  setSelectedCarga 
}) => {
  return (
    <div className="flex space-x-2 justify-end">
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          size="sm"
          className="bg-green-500 hover:bg-green-600 text-white border-none"
          onClick={() => setSelectedCarga(carga)}
        >
          <MessageSquare className="h-4 w-4 mr-1" /> Suporte
        </Button>
      </DialogTrigger>
      
      <Button 
        variant="outline"
        size="sm"
      >
        <FileText className="h-4 w-4 mr-1" /> Detalhes
      </Button>
    </div>
  );
};

export default ActionButtons;
