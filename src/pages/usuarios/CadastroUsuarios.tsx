
import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { User, UserPlus, Users, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { DataTable } from '@/components/ui/table';
import StatusBadge from '@/components/common/StatusBadge';
import CadastroForm from './components/CadastroForm';
import AprovacoesUsuario from './components/AprovacoesUsuario';

// Mock data
const usuariosMock = [
  { id: 1, nome: 'João Silva', email: 'joao@empresa.com.br', empresa: 'Empresa A', cnpj: '12.345.678/0001-90', perfil: 'Cliente', status: 'ativo' },
  { id: 2, nome: 'Maria Santos', email: 'maria@fornecedor.com.br', empresa: 'Fornecedor X', cnpj: '98.765.432/0001-10', perfil: 'Fornecedor externo', status: 'ativo' },
  { id: 3, nome: 'Pedro Oliveira', email: 'pedro@empresa.com.br', empresa: 'Empresa A', cnpj: '12.345.678/0001-90', perfil: 'Funcionário Operacional', status: 'ativo' },
  { id: 4, nome: 'Ana Sousa', email: 'ana@empresa.com.br', empresa: 'Empresa A', cnpj: '12.345.678/0001-90', perfil: 'Funcionário Supervisor', status: 'inativo' },
  { id: 5, nome: 'Carlos Mendes', email: 'carlos@empresa.com.br', empresa: 'Empresa A', cnpj: '12.345.678/0001-90', perfil: 'Administrador', status: 'pendente' },
];

const CadastroUsuarios: React.FC = () => {
  const { toast } = useToast();
  const [usuarios, setUsuarios] = useState(usuariosMock);
  const [currentTab, setCurrentTab] = useState('cadastro');

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

  return (
    <MainLayout title="Cadastro de Usuários">
      <div className="mb-6">
        <h2 className="text-2xl font-heading mb-2">Gerenciamento de Usuários</h2>
        <p className="text-gray-600">Cadastro, aprovações e listagem de usuários do sistema</p>
      </div>
      
      <Tabs defaultValue="cadastro" className="mb-6" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="cadastro">Novo Cadastro</TabsTrigger>
          <TabsTrigger value="aprovacoes">Aprovações Pendentes</TabsTrigger>
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
        
        <TabsContent value="listagem">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Users className="mr-2 text-cross-blue" size={20} />
                Listagem de Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Nome</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Empresa</th>
                      <th className="text-left py-3 px-4">CNPJ</th>
                      <th className="text-left py-3 px-4">Perfil</th>
                      <th className="text-left py-3 px-4">Status</th>
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
                          <StatusBadge 
                            status={
                              usuario.status === 'ativo' ? 'success' : 
                              usuario.status === 'pendente' ? 'warning' : 'error'
                            } 
                            text={
                              usuario.status === 'ativo' ? 'Ativo' :
                              usuario.status === 'pendente' ? 'Pendente' : 'Inativo'
                            } 
                          />
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm">Ver detalhes</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default CadastroUsuarios;
