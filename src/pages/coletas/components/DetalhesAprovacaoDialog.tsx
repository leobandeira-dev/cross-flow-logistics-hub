
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SolicitacaoColeta } from '../types/coleta.types';

export interface DetalhesAprovacaoDialogProps {
  isOpen: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRequest: SolicitacaoColeta | null;
  isRejecting: boolean;
  setIsRejecting: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [motivoRecusa, setMotivoRecusa] = React.useState('');
  const [observacoes, setObservacoes] = React.useState('');
  
  // Reset form when dialog opens with new data
  React.useEffect(() => {
    if (isOpen && selectedRequest) {
      setMotivoRecusa('');
      setObservacoes(selectedRequest.observacoes || '');
    }
  }, [isOpen, selectedRequest]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    return dateString;
  };

  const handleConfirmReject = () => {
    if (selectedRequest) {
      onReject(selectedRequest.id, motivoRecusa);
      onOpenChange(false);
      setIsRejecting(false);
    }
  };

  if (!selectedRequest) return null;

  return (
    <>
      <Dialog open={isOpen && !isRejecting} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Solicitação {selectedRequest.id}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-3">Informações da Solicitação</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">ID da Solicitação:</dt>
                    <dd>{selectedRequest.id}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Data da Solicitação:</dt>
                    <dd>{formatDate(selectedRequest.dataSolicitacao)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Cliente:</dt>
                    <dd>{selectedRequest.cliente}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Solicitante:</dt>
                    <dd>{selectedRequest.solicitante}</dd>
                  </div>
                  {selectedRequest.status !== 'pending' && (
                    <>
                      <div className="flex justify-between">
                        <dt className="font-medium text-gray-500">Aprovador:</dt>
                        <dd>{selectedRequest.status === 'approved' || selectedRequest.status === 'rejected' 
                          ? (selectedRequest as any).aprovador 
                          : '—'}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-gray-500">Data de Aprovação:</dt>
                        <dd>{selectedRequest.status === 'approved' || selectedRequest.status === 'rejected'
                          ? formatDate((selectedRequest as any).dataAprovacao)
                          : '—'}</dd>
                      </div>
                    </>
                  )}
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-3">Detalhes da Coleta</h3>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Data da Coleta:</dt>
                    <dd>{selectedRequest.data}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Origem:</dt>
                    <dd>{selectedRequest.origem}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Destino:</dt>
                    <dd>{selectedRequest.destino}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium text-gray-500">Prioridade:</dt>
                    <dd className={`font-medium ${
                      selectedRequest.status === 'pending' && (selectedRequest as any).prioridade === 'Alta' 
                        ? 'text-red-500' 
                        : 'text-gray-700'
                    }`}>
                      {selectedRequest.status === 'pending' ? (selectedRequest as any).prioridade : '—'}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-3">Notas Fiscais e Volumes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Notas Fiscais:</h4>
                    <ul className="list-disc list-inside">
                      {selectedRequest.notas && selectedRequest.notas.map((nota, index) => (
                        <li key={index}>{nota}</li>
                      ))}
                      {!selectedRequest.notas?.length && <li className="text-gray-400">Nenhuma nota fiscal informada</li>}
                    </ul>
                  </div>
                  <div>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="font-medium text-gray-500">Volumes:</dt>
                        <dd>{selectedRequest.volumes}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="font-medium text-gray-500">Peso:</dt>
                        <dd>{selectedRequest.peso}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Observações */}
          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Observações</h3>
            <textarea
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Observações para a aprovação (opcional)"
            />
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            {selectedRequest.status === 'pending' && (
              <>
                <Button variant="outline" onClick={() => setIsRejecting(true)}>
                  Recusar
                </Button>
                <Button onClick={() => onApprove(selectedRequest.id, observacoes)}>
                  Aprovar
                </Button>
              </>
            )}
            {selectedRequest.status !== 'pending' && (
              <Button onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de recusa */}
      <AlertDialog open={isRejecting} onOpenChange={setIsRejecting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Recusar solicitação?</AlertDialogTitle>
            <AlertDialogDescription>
              Por favor, informe o motivo da recusa:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <textarea
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            value={motivoRecusa}
            onChange={(e) => setMotivoRecusa(e.target.value)}
            placeholder="Motivo da recusa (obrigatório)"
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsRejecting(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmReject}
              disabled={!motivoRecusa.trim()}
              className={!motivoRecusa.trim() ? 'opacity-50 cursor-not-allowed' : ''}
            >
              Confirmar Recusa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DetalhesAprovacaoDialog;
