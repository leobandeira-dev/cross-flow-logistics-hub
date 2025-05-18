
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SolicitacaoColeta } from '../types/coleta.types';
import DocumentoColetaViewer from './solicitacao/DocumentoColetaViewer';
import AprovacaoForm from './aprovacao/AprovacaoForm';

// Update the interface to match the one in AprovacoesColeta.tsx
interface DetalhesAprovacaoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRequest: SolicitacaoColeta | null;
  isRejecting: boolean;
  setIsRejecting: (value: boolean) => void;
  onApprove: (solicitacaoId: string, observacoes?: string) => void;
  onReject: (solicitacaoId: string, motivoRecusa: string) => void;
}

const DetalhesAprovacaoDialog: React.FC<DetalhesAprovacaoDialogProps> = ({
  selectedRequest,
  open,
  onOpenChange,
  isRejecting,
  setIsRejecting,
  onApprove,
  onReject
}) => {
  if (!selectedRequest) return null;

  const handleClose = () => {
    onOpenChange(false);
    setIsRejecting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Detalhes da Solicitação - {selectedRequest.id}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <DocumentoColetaViewer solicitacao={selectedRequest} />
          
          <div className="mt-8 pt-4 border-t">
            <h3 className="font-semibold text-lg mb-4">
              {isRejecting ? 'Recusar Solicitação' : 'Aprovação da Solicitação'}
            </h3>
            
            <AprovacaoForm
              selectedRequest={selectedRequest}
              isRejecting={isRejecting}
              setIsRejecting={setIsRejecting}
              onClose={handleClose}
              onApprove={onApprove}
              onReject={onReject}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetalhesAprovacaoDialog;
