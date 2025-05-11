
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface EmpresaDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresa: any | null;
}

const EmpresaDetailsDialog: React.FC<EmpresaDetailsDialogProps> = ({
  open,
  onOpenChange,
  empresa,
}) => {
  if (!empresa) return null;

  // Helper function to render status badge
  const renderStatus = (status: string) => {
    switch (status) {
      case 'ativo':
        return <Badge className="bg-green-500">Ativo</Badge>;
      case 'inativo':
        return <Badge variant="destructive">Inativo</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes da Empresa</DialogTitle>
          <DialogDescription>
            Informações completas da empresa selecionada.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-lg">{empresa.nome || empresa.razaoSocial}</span>
            {renderStatus(empresa.status)}
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <p className="text-sm text-muted-foreground">CNPJ</p>
              <p>{empresa.cnpj || 'N/A'}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Perfil</p>
              <p>{empresa.perfil}</p>
            </div>

            {empresa.razaoSocial && empresa.razaoSocial !== empresa.nome && (
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Razão Social</p>
                <p>{empresa.razaoSocial}</p>
              </div>
            )}

            {empresa.endereco && (
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Endereço</p>
                <p>{empresa.endereco}</p>
              </div>
            )}

            {empresa.email && (
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{empresa.email}</p>
              </div>
            )}

            {empresa.telefone && (
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p>{empresa.telefone}</p>
              </div>
            )}
            
            {empresa.transportadoraPrincipal && (
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Transportadora Principal</p>
                <p>{empresa.transportadoraPrincipal ? 'Sim' : 'Não'}</p>
              </div>
            )}

            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Data de Cadastro</p>
              <p>{empresa.dataCadastro || 'N/A'}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmpresaDetailsDialog;
