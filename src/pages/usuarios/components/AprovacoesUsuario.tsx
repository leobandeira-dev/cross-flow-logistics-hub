
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, User } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  empresa: string;
  cnpj: string;
  perfil: string;
  status: string;
}

interface AprovacoesUsuarioProps {
  usuarios: Usuario[];
  onApprove: (userId: number) => void;
  onReject: (userId: number) => void;
}

const AprovacoesUsuario: React.FC<AprovacoesUsuarioProps> = ({
  usuarios,
  onApprove,
  onReject
}) => {
  const [selectedUser, setSelectedUser] = React.useState<Usuario | null>(null);
  const [dialogAction, setDialogAction] = React.useState<'approve' | 'reject' | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleApprove = (user: Usuario) => {
    setSelectedUser(user);
    setDialogAction('approve');
    setDialogOpen(true);
  };

  const handleReject = (user: Usuario) => {
    setSelectedUser(user);
    setDialogAction('reject');
    setDialogOpen(true);
  };

  const confirmAction = () => {
    if (selectedUser && dialogAction) {
      if (dialogAction === 'approve') {
        onApprove(selectedUser.id);
      } else {
        onReject(selectedUser.id);
      }
      setDialogOpen(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <User className="mr-2 text-cross-blue" size={20} />
            Aprovações Pendentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {usuarios.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Nome</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Empresa</th>
                    <th className="text-left py-3 px-4">CNPJ</th>
                    <th className="text-left py-3 px-4">Perfil</th>
                    <th className="text-left py-3 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{usuario.nome}</td>
                      <td className="py-3 px-4">{usuario.email}</td>
                      <td className="py-3 px-4">{usuario.empresa}</td>
                      <td className="py-3 px-4">{usuario.cnpj}</td>
                      <td className="py-3 px-4">{usuario.perfil}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(usuario)}
                            className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800"
                          >
                            <Check size={16} />
                            Aprovar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(usuario)}
                            className="flex items-center gap-1 bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800"
                          >
                            <X size={16} />
                            Rejeitar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Não há aprovações pendentes no momento.
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === 'approve' ? 'Confirmar Aprovação' : 'Confirmar Rejeição'}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === 'approve'
                ? `Tem certeza que deseja aprovar o usuário ${selectedUser?.nome}?`
                : `Tem certeza que deseja rejeitar o usuário ${selectedUser?.nome}?`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">Nome:</p>
                <p className="text-sm">{selectedUser?.nome}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Email:</p>
                <p className="text-sm">{selectedUser?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Empresa:</p>
                <p className="text-sm">{selectedUser?.empresa}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Perfil:</p>
                <p className="text-sm">{selectedUser?.perfil}</p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={confirmAction}
              className={
                dialogAction === 'approve'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
            >
              {dialogAction === 'approve' ? 'Aprovar' : 'Rejeitar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AprovacoesUsuario;
