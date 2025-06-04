
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
import { AlertTriangle, FileText, Package, Save, X } from 'lucide-react';
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Volumes Já Gravados Encontrados
          </DialogTitle>
          <DialogDescription>
            A Nota Fiscal <strong>#{numeroNotaFiscal}</strong> já possui volumes previamente gravados no banco de dados.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert className="border-amber-200 bg-amber-50">
            <FileText className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>{duplicateData.existingVolumes} volume(s)</strong> já foram gravados para esta Nota Fiscal.
            </AlertDescription>
          </Alert>

          {duplicateData.volumes.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Package className="h-4 w-4" />
                Volumes Existentes no Banco:
              </h4>
              <div className="max-h-40 overflow-y-auto border rounded-md p-3 bg-gray-50">
                <div className="space-y-2">
                  {duplicateData.volumes.map((volume, index) => (
                    <div key={volume.id} className="flex justify-between items-center p-2 bg-white rounded border text-sm">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs text-gray-600">{volume.codigo}</span>
                        <span className="font-medium">Volume {volume.volume_numero}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        volume.status === 'gerada' ? 'bg-blue-100 text-blue-800' :
                        volume.status === 'etiquetada' ? 'bg-green-100 text-green-800' :
                        volume.status === 'impressa' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {volume.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <p className="text-sm text-gray-700 font-medium">
              ⚠️ Deseja criar <strong>novos volumes adicionais</strong> para esta Nota Fiscal?
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Os volumes existentes permanecerão inalterados.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Sim, criar novos volumes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateConfirmationDialog;
