
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SolicitacaoColeta } from '../types/coleta.types';
import DocumentoColetaViewer from './solicitacao/DocumentoColetaViewer';
import AprovacaoForm from './aprovacao/AprovacaoForm';

interface DetalhesAprovacaoDialogProps {
  solicitacao: SolicitacaoColeta | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isRejecting: boolean;
  setIsRejecting: (value: boolean) => void;
  onApprove: (solicitacaoId: string, observacoes?: string) => void;
  onReject: (solicitacaoId: string, motivoRecusa: string) => void;
}

const DetalhesAprovacaoDialog: React.FC<DetalhesAprovacaoDialogProps> = ({
  solicitacao,
  open,
  onOpenChange,
  isRejecting,
  setIsRejecting,
  onApprove,
  onReject
}) => {
  if (!solicitacao) return null;

  const handleClose = () => {
    onOpenChange(false);
    setIsRejecting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Detalhes da Solicitação - {solicitacao.id}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <DocumentoColetaViewer solicitacao={solicitacao} />
          
          <div className="mt-8 pt-4 border-t">
            <h3 className="font-semibold text-lg mb-4">
              {isRejecting ? 'Recusar Solicitação' : 'Aprovação da Solicitação'}
            </h3>
            
            <AprovacaoForm
              selectedRequest={solicitacao}
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
