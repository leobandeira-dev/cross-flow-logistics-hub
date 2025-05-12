
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileOutput, Package } from 'lucide-react';

interface FormActionsProps {
  isVolumeEtiqueta: boolean;
  handleGenerateVolumes?: () => void;
  handleCreateEtiquetaMae?: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  isVolumeEtiqueta, 
  handleGenerateVolumes, 
  handleCreateEtiquetaMae 
}) => {
  return (
    <>
      {isVolumeEtiqueta ? (
        <Button
          type="button"
          className="w-full"
          onClick={handleGenerateVolumes}
        >
          <FileOutput className="mr-2 h-4 w-4" />
          Gerar Volumes
        </Button>
      ) : (
        <Button
          type="button"
          className="w-full"
          onClick={handleCreateEtiquetaMae}
        >
          <Package className="mr-2 h-4 w-4" />
          Adicionar Etiqueta Mãe
        </Button>
      )}
    </>
  );
};

export default FormActions;
