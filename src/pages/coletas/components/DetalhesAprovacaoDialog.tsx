
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import AprovacaoForm from './AprovacaoForm';
import { SolicitacaoColeta } from '../types/coleta.types';

interface DetalhesAprovacaoDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRequest: SolicitacaoColeta | null;
  isRejecting: boolean;
  setIsRejecting: (value: boolean) => void;
  onApprove: (solicitacaoId: string, observacoes?: string) => void;
  onReject: (solicitacaoId: string, motivoRecusa: string) => void;
}

const DetalhesAprovacaoDialog: React.FC<DetalhesAprovacaoDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedRequest,
  isRejecting,
  setIsRejecting,
  onApprove,
  onReject
}) => {
  if (!selectedRequest) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes da Solicitação {selectedRequest.id}</DialogTitle>
          <DialogDescription>
            {selectedRequest.status === 'pending' 
              ? 'Revise os detalhes da solicitação para aprovar ou recusar.'
              : 'Detalhes da solicitação processada.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Cliente</p>
              <p className="font-medium">{selectedRequest.cliente}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Solicitante</p>
              <p>{selectedRequest.solicitante}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Data Solicitação</p>
              <p>{selectedRequest.data}</p>
            </div>
            {'dataAprovacao' in selectedRequest && (
              <div>
                <p className="text-sm font-medium text-gray-500">Data Aprovação</p>
                <p>{selectedRequest.dataAprovacao}</p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Origem</p>
              <p>{selectedRequest.origem}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Destino</p>
              <p>{selectedRequest.destino}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Volumes</p>
              <p>{selectedRequest.volumes}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Peso</p>
              <p>{selectedRequest.peso}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Notas Fiscais</p>
            <p>{selectedRequest.notas.join(', ')}</p>
          </div>
          
          {'aprovador' in selectedRequest && (
            <div>
              <p className="text-sm font-medium text-gray-500">Aprovador</p>
              <p>{selectedRequest.aprovador}</p>
            </div>
          )}
          
          {'observacoes' in selectedRequest && selectedRequest.observacoes && (
            <div>
              <p className="text-sm font-medium text-gray-500">Observações</p>
              <p>{selectedRequest.observacoes}</p>
            </div>
          )}
          
          {'motivoRecusa' in selectedRequest && (
            <div>
              <p className="text-sm font-medium text-gray-500">Motivo da Recusa</p>
              <p className="text-red-600">{selectedRequest.motivoRecusa}</p>
            </div>
          )}
          
          {selectedRequest.status === 'pending' && (
            <AprovacaoForm
              selectedRequest={selectedRequest}
              isRejecting={isRejecting}
              setIsRejecting={setIsRejecting}
              onClose={() => onOpenChange(false)}
              onApprove={(observacoes) => onApprove(selectedRequest.id, observacoes)}
              onReject={(motivoRecusa) => onReject(selectedRequest.id, motivoRecusa)}
            />
          )}
        </div>
        
        {selectedRequest.status !== 'pending' && (
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Fechar</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DetalhesAprovacaoDialog;
