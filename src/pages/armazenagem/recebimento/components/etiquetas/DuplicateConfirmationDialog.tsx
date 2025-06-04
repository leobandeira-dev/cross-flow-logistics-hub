
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, FileText, Package } from 'lucide-react';
import { DuplicateCheckResult } from '@/services/etiqueta/etiquetaAtomicService';

interface DuplicateConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  duplicateData: DuplicateCheckResult;
  numeroNotaFiscal?: string;
}

const DuplicateConfirmationDialog: React.FC<DuplicateConfirmationDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  duplicateData,
  numeroNotaFiscal
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Volumes Existentes Encontrados
          </DialogTitle>
          <DialogDescription>
            A Nota Fiscal {numeroNotaFiscal && `#${numeroNotaFiscal} `}já possui volumes previamente gerados.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              <strong>{duplicateData.existingVolumes} volume(s)</strong> já foram gerados para esta Nota Fiscal.
            </AlertDescription>
          </Alert>

          {duplicateData.volumes.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Package className="h-4 w-4" />
                Volumes Existentes:
              </h4>
              <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-1">
                {duplicateData.volumes.map((volume, index) => (
                  <div key={volume.id} className="text-xs bg-gray-50 p-2 rounded flex justify-between items-center">
                    <span className="font-mono">{volume.codigo}</span>
                    <span className="text-gray-500">Vol. {volume.volume_numero}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      volume.status === 'gerada' ? 'bg-blue-100 text-blue-800' :
                      volume.status === 'etiquetada' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {volume.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <p className="text-sm text-gray-600">
              Deseja gerar novos volumes para esta Nota Fiscal?
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Não, cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-amber-500 hover:bg-amber-600"
          >
            Sim, gerar novos volumes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateConfirmationDialog;
