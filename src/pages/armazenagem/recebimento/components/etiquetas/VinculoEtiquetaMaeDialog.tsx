
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Volume } from './VolumesTable';

interface VinculoEtiquetaMaeDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (etiquetaMaeId: string) => void;
  etiquetaMae: any; // Can be null or an object with etiqueta mae data
  volumes: Volume[]; // Volumes to potentially link
}

const VinculoEtiquetaMaeDialog: React.FC<VinculoEtiquetaMaeDialogProps> = ({
  open,
  onClose,
  onSave,
  etiquetaMae,
  volumes = []
}) => {
  const [etiquetaMaeId, setEtiquetaMaeId] = useState(
    etiquetaMae ? etiquetaMae.id : `EM-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 1000)}`
  );

  const handleSave = () => {
    onSave(etiquetaMaeId);
  };

  return (
    <Dialog open={open} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Vincular Volumes à Etiqueta Mãe</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="etiqueta-mae-id">ID da Etiqueta Mãe</Label>
            <Input
              id="etiqueta-mae-id"
              value={etiquetaMaeId}
              onChange={e => setEtiquetaMaeId(e.target.value)}
              placeholder="ID da etiqueta mãe"
            />
          </div>
          
          {volumes.length > 0 ? (
            <div className="max-h-[300px] overflow-y-auto border rounded-md p-3">
              <h4 className="font-medium mb-2">Volumes selecionados ({volumes.length}):</h4>
              <ul className="space-y-2">
                {volumes.map(volume => (
                  <li key={volume.id} className="flex items-center space-x-2">
                    <div className="flex-grow">
                      <div className="text-sm">{volume.descricao}</div>
                      <div className="text-xs text-gray-500">ID: {volume.id}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Nenhum volume selecionado
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" disabled={!etiquetaMaeId.trim()} onClick={handleSave}>
            Gerar Etiqueta Mãe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VinculoEtiquetaMaeDialog;
