
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card'; // Add missing imports
import { Button } from '@/components/ui/button';
import { SolicitacaoColeta } from '../types/coleta.types';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface DetalhesAprovacaoDialogProps {
  isOpen: boolean;
  onClose: () => void; // Keep onClose for backward compatibility
  onOpenChange?: (open: boolean) => void; // Add onOpenChange for newer components
  solicitacao: SolicitacaoColeta | null;
}

// Helper function to format date strings
const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return dateString;
  }
};

// Status badge renderer
const StatusBadge = ({ status }: { status: string }) => {
  const variantMap: Record<string, "default" | "destructive" | "outline" | "secondary"> = {
    pending: 'outline',
    approved: 'default',
    rejected: 'destructive',
  };

  const labelMap: Record<string, string> = {
    pending: 'Pendente',
    approved: 'Aprovada',
    rejected: 'Recusada',
  };

  return (
    <Badge variant={variantMap[status] || 'outline'}>
      {labelMap[status] || status}
    </Badge>
  );
};

const DetalhesAprovacaoDialog: React.FC<DetalhesAprovacaoDialogProps> = ({
  isOpen,
  onClose,
  onOpenChange,
  solicitacao
}) => {
  if (!solicitacao) return null;

  // Use either onOpenChange or onClose for compatibility
  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Detalhes da Solicitação #{solicitacao.id}</DialogTitle>
        </DialogHeader>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium">Informações da Solicitação</h3>
                <p className="text-sm text-muted-foreground">
                  Criada em {formatDate(solicitacao.dataSolicitacao || solicitacao.data || '')}
                </p>
              </div>
              <StatusBadge status={solicitacao.status} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium">Cliente</p>
                <p className="text-muted-foreground">{solicitacao.cliente}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Solicitante</p>
                <p className="text-muted-foreground">{solicitacao.solicitante}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Origem</p>
                <p className="text-muted-foreground">{solicitacao.origem}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Destino</p>
                <p className="text-muted-foreground">{solicitacao.destino}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Volumes</p>
                <p className="text-muted-foreground">{solicitacao.volumes}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Peso</p>
                <p className="text-muted-foreground">{solicitacao.peso}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-4" />

        {solicitacao.status === 'approved' && (
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-2">Informações da Aprovação</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Aprovado por</p>
                  <p className="text-muted-foreground">{(solicitacao as any).aprovador}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Data da Aprovação</p>
                  <p className="text-muted-foreground">{formatDate((solicitacao as any).dataAprovacao)}</p>
                </div>
                {(solicitacao as any).observacoes && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium">Observações</p>
                    <p className="text-muted-foreground">{(solicitacao as any).observacoes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {solicitacao.status === 'rejected' && (
          <Card>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-2">Informações da Recusa</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Recusado por</p>
                  <p className="text-muted-foreground">{(solicitacao as any).aprovador}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Data da Recusa</p>
                  <p className="text-muted-foreground">{formatDate((solicitacao as any).dataAprovacao)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium">Motivo da Recusa</p>
                  <p className="text-muted-foreground">{(solicitacao as any).motivoRecusa}</p>
                </div>
                {(solicitacao as any).observacoes && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium">Observações</p>
                    <p className="text-muted-foreground">{(solicitacao as any).observacoes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetalhesAprovacaoDialog;
