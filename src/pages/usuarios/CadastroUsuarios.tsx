
import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { User, UserPlus, Users, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CadastroForm from './components/CadastroForm';
import AprovacoesUsuario from './components/AprovacoesUsuario';
import PermissoesUsuario from './components/PermissoesUsuario';
import UsersListTab from './components/UsersListTab';
import UserDetailsDialog from './components/UserDetailsDialog';

// Updated mock data with new terminology
const usuariosMock = [
  { id: 1, nome: 'João Silva', email: 'joao@empresa.com.br', empresa: 'Empresa A', cnpj: '12.345.678/0001-90', perfil: 'Cliente', status: 'ativo' },
  { id: 2, nome: 'Maria Santos', email: 'maria@fornecedor.com.br', empresa: 'Fornecedor X', cnpj: '98.765.432/0001-10', perfil: 'Fornecedor', status: 'ativo' },
  { id: 3, nome: 'Pedro Oliveira', email: 'pedro@empresa.com.br', empresa: 'Empresa A', cnpj: '12.345.678/0001-90', perfil: 'Funcionário Operacional', status: 'ativo' },
  { id: 4, nome: 'Ana Sousa', email: 'ana@empresa.com.br', empresa: 'Empresa A', cnpj: '12.345.678/0001-90', perfil: 'Funcionário Supervisor', status: 'inativo' },
  { id: 5, nome: 'Carlos Mendes', email: 'carlos@empresa.com.br', empresa: 'Empresa A', cnpj: '12.345.678/0001-90', perfil: 'Administrador', status: 'pendente' },
];

interface CadastroUsuariosProps {
  initialTab?: string;
}

const CadastroUsuarios: React.FC<CadastroUsuariosProps> = ({ initialTab = 'cadastro' }) => {
  const { toast } = useToast();
  const [usuarios, setUsuarios] = useState(usuariosMock);
  const [currentTab, setCurrentTab] = useState(initialTab);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Atualiza a tab quando o initialTab mudar (útil para navegação via link)
  useEffect(() => {
    setCurrentTab(initialTab);
  }, [initialTab]);

  const handleUsuarioSubmit = (data: any) => {
    // Normalmente aqui teríamos uma chamada para API
    const newUsuario = {
      id: usuarios.length + 1,
      nome: data.nome,
      email: data.email,
      empresa: data.empresa,
      cnpj: data.cnpj,
      perfil: data.perfil,
      status: 'pendente'
    };

    setUsuarios([...usuarios, newUsuario]);
    
    toast({
      title: "Cadastro realizado",
      description: "Seu cadastro foi enviado e está aguardando aprovação.",
    });
  };

  const handleApprove = (userId: number) => {
    setUsuarios(usuarios.map(user => 
      user.id === userId ? {...user, status: 'ativo'} : user
    ));
    
    toast({
      title: "Usuário aprovado",
      description: "O usuário foi aprovado com sucesso.",
    });
  };

  const handleReject = (userId: number) => {
    setUsuarios(usuarios.map(user => 
      user.id === userId ? {...user, status: 'rejeitado'} : user
    ));
    
    toast({
      title: "Usuário rejeitado",
      description: "O usuário foi rejeitado.",
    });
  };

  const handleVerDetalhes = (usuario: any) => {
    setSelectedUser(usuario);
    setDetailsDialogOpen(true);
  };

  return (
    <MainLayout title="Cadastro de Usuários">
      <div className="mb-6">
        <h2 className="text-2xl font-heading mb-2">Gerenciamento de Usuários</h2>
        <p className="text-gray-600">Cadastro, aprovações, permissões e listagem de usuários do sistema</p>
      </div>
      
      <Tabs defaultValue="cadastro" className="mb-6" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="cadastro">Novo Cadastro</TabsTrigger>
          <TabsTrigger value="aprovacoes">Aprovações Pendentes</TabsTrigger>
          <TabsTrigger value="permissoes">Permissões</TabsTrigger>
          <TabsTrigger value="listagem">Usuários</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cadastro">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <UserPlus className="mr-2 text-cross-blue" size={20} />
                Cadastro de Novo Usuário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CadastroForm onSubmit={handleUsuarioSubmit} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="aprovacoes">
          <AprovacoesUsuario 
            usuarios={usuarios.filter(u => u.status === 'pendente')}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </TabsContent>
        
        <TabsContent value="permissoes">
          <PermissoesUsuario />
        </TabsContent>
        
        <TabsContent value="listagem">
          <UsersListTab 
            users={usuarios}
            onViewDetails={handleVerDetalhes}
          />
        </TabsContent>
      </Tabs>

      {/* Dialog para detalhes do usuário */}
      <UserDetailsDialog 
        open={detailsDialogOpen} 
        onOpenChange={setDetailsDialogOpen} 
        user={selectedUser} 
      />
    </MainLayout>
  );
};

export default CadastroUsuarios;
