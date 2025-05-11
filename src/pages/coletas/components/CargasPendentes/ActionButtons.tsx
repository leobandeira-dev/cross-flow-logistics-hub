
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, UserPlus, MessageSquare } from 'lucide-react';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Carga } from '../../types/coleta.types';
import CargasSupportDialog from '../../components/CargasSupportDialog';

interface ActionButtonsProps {
  carga: Carga;
  onAlocar: (carga: Carga) => void;
  setSelectedCarga: (carga: Carga) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  carga, 
  onAlocar, 
  setSelectedCarga 
}) => {
  const [supportDialogOpen, setSupportDialogOpen] = React.useState(false);
  
  return (
    <div className="flex space-x-2 justify-end">
      <Dialog open={supportDialogOpen} onOpenChange={setSupportDialogOpen}>
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
        <CargasSupportDialog 
          isOpen={supportDialogOpen} 
          onOpenChange={setSupportDialogOpen}
          selectedCarga={carga} 
        />
      </Dialog>
      
      <Button 
        variant="outline"
        size="sm"
      >
        <FileText className="h-4 w-4 mr-1" /> Detalhes
      </Button>
      
      <Button 
        variant="outline"
        size="sm"
        className="text-blue-600 border-blue-600 hover:bg-blue-50"
        onClick={() => onAlocar(carga)}
      >
        <UserPlus className="h-4 w-4 mr-1" /> Alocar
      </Button>
    </div>
  );
};

export default ActionButtons;
