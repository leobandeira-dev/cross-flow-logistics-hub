
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { SolicitacaoColeta } from '../types/coleta.types';
import AprovacaoForm from './AprovacaoForm';

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
  // Handle closing dialog (reset rejection state)
  const handleCloseDialog = () => {
    setIsRejecting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Solicitação de Coleta</DialogTitle>
          <DialogDescription>Revise as informações da solicitação</DialogDescription>
        </DialogHeader>

        {selectedRequest && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            <div className="md:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">ID da Solicitação</p>
                      <p className="text-sm font-bold">{selectedRequest.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Cliente</p>
                      <p className="text-sm font-bold">{selectedRequest.cliente}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Data da Solicitação</p>
                      <p className="text-sm">{selectedRequest.data}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Solicitante</p>
                      <p className="text-sm">{selectedRequest.solicitante}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Volumes</p>
                      <p className="text-sm">{selectedRequest.volumes}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Peso</p>
                      <p className="text-sm">{selectedRequest.peso}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-500">Notas Fiscais</p>
                      <p className="text-sm">{selectedRequest.notas.join(', ')}</p>
                    </div>
                    
                    {selectedRequest.status !== 'pending' && (
                      <>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Aprovador</p>
                          <p className="text-sm">
                            {selectedRequest.status === 'approved' 
                              ? (selectedRequest as any).aprovador 
                              : (selectedRequest as any).aprovador}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Data da Aprovação</p>
                          <p className="text-sm">
                            {selectedRequest.status === 'approved' 
                              ? (selectedRequest as any).dataAprovacao 
                              : (selectedRequest as any).dataAprovacao}
                          </p>
                        </div>
                      </>
                    )}
                    
                    {selectedRequest.status !== 'pending' && (selectedRequest as any).observacoes && (
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-gray-500">Observações</p>
                        <p className="text-sm">{(selectedRequest as any).observacoes}</p>
                      </div>
                    )}
                    
                    {selectedRequest.status === 'rejected' && (selectedRequest as any).motivoRecusa && (
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-gray-500 text-destructive">Motivo da Recusa</p>
                        <p className="text-sm">{(selectedRequest as any).motivoRecusa}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-1">
              {selectedRequest.status === 'pending' ? (
                <AprovacaoForm 
                  selectedRequest={selectedRequest}
                  isRejecting={isRejecting}
                  setIsRejecting={setIsRejecting}
                  onClose={handleCloseDialog}
                  onApprove={onApprove}
                  onReject={onReject}
                />
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="font-medium">
                        Status: {selectedRequest.status === 'approved' ? (
                          <span className="text-green-600">Aprovada</span>
                        ) : (
                          <span className="text-destructive">Recusada</span>
                        )}
                      </p>
                      {selectedRequest.status === 'approved' ? (
                        <p className="mt-2 text-sm">Esta solicitação já foi aprovada.</p>
                      ) : (
                        <p className="mt-2 text-sm">Esta solicitação foi recusada.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DetalhesAprovacaoDialog;
