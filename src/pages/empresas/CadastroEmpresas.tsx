
import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Building, BuildingAdd, List, Check, X, Settings, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import StatusBadge from '@/components/common/StatusBadge';
import EmpresaForm from './components/EmpresaForm';
import PermissoesEmpresa from './components/PermissoesEmpresa';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Empresa, PerfilEmpresa } from './types/empresa.types';

// Mock data for testing
const empresasMock: Empresa[] = [
  { 
    id: '1', 
    cnpj: '12.345.678/0001-90', 
    razao_social: 'Transportes Rápidos Ltda', 
    nome_fantasia: 'Trans Rápidos',
    email: 'contato@transportesrapidos.com.br',
    telefone: '(11) 3333-4444',
    endereco: 'Av. Paulista, 1000',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01310-100',
    ativo: true,
    data_cadastro: '2023-01-15',
    perfis: ['transportadora']
  },
  { 
    id: '2', 
    cnpj: '98.765.432/0001-10', 
    razao_social: 'Filial SP Transportes Rápidos', 
    nome_fantasia: 'Trans Rápidos SP',
    email: 'sp@transportesrapidos.com.br',
    telefone: '(11) 3333-5555',
    endereco: 'Av. Ibirapuera, 2000',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '04029-200',
    ativo: true,
    data_cadastro: '2023-02-20',
    transportadora_principal_id: '1',
    perfis: ['filial']
  },
  { 
    id: '3', 
    cnpj: '45.678.901/0001-23', 
    razao_social: 'Indústria ABC Ltda', 
    nome_fantasia: 'Ind. ABC',
    email: 'contato@industriaabc.com.br',
    telefone: '(11) 2222-3333',
    endereco: 'Rua Industrial, 500',
    cidade: 'Guarulhos',
    estado: 'SP',
    cep: '07000-000',
    ativo: true,
    data_cadastro: '2023-03-10',
    perfis: ['cliente_direto']
  },
  { 
    id: '4', 
    cnpj: '56.789.012/0001-34', 
    razao_social: 'Fornecedora XYZ S.A.', 
    nome_fantasia: 'Forn. XYZ',
    email: 'contato@fornecedoraxyz.com.br',
    telefone: '(11) 4444-5555',
    endereco: 'Av. das Indústrias, 1200',
    cidade: 'Diadema',
    estado: 'SP',
    cep: '09000-000',
    ativo: true,
    data_cadastro: '2023-04-05',
    perfis: ['cliente_indireto']
  },
];

const traduzirPerfil = (perfil: PerfilEmpresa): string => {
  switch(perfil) {
    case 'transportadora': return 'Transportadora';
    case 'filial': return 'Filial';
    case 'cliente_direto': return 'Cliente Direto';
    case 'cliente_indireto': return 'Cliente Indireto';
    default: return perfil;
  }
};

const CadastroEmpresas: React.FC = () => {
  const { toast } = useToast();
  const [empresas, setEmpresas] = useState(empresasMock);
  const [currentTab, setCurrentTab] = useState('cadastro');
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const handleEmpresaSubmit = (data: Partial<Empresa>) => {
    // Normalmente aqui teríamos uma chamada para API
    const newEmpresa: Empresa = {
      id: (empresas.length + 1).toString(),
      cnpj: data.cnpj || '',
      razao_social: data.razao_social || '',
      nome_fantasia: data.nome_fantasia || '',
      email: data.email || '',
      telefone: data.telefone || '',
      endereco: data.endereco || '',
      cidade: data.cidade || '',
      estado: data.estado || '',
      cep: data.cep || '',
      ativo: true,
      data_cadastro: new Date().toISOString().split('T')[0],
      perfis: data.perfis || []
    };

    setEmpresas([...empresas, newEmpresa]);
    
    toast({
      title: "Cadastro realizado",
      description: "Empresa cadastrada com sucesso.",
    });
  };

  const handleVerDetalhes = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setDetailsDialogOpen(true);
  };

  return (
    <MainLayout title="Cadastro de Empresas">
      <div className="mb-6">
        <h2 className="text-2xl font-heading mb-2">Gerenciamento de Empresas</h2>
        <p className="text-gray-600">Cadastro, permissões e listagem de empresas no sistema</p>
      </div>
      
      <Tabs defaultValue="cadastro" className="mb-6" value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="cadastro">Novo Cadastro</TabsTrigger>
          <TabsTrigger value="permissoes">Permissões</TabsTrigger>
          <TabsTrigger value="listagem">Empresas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cadastro">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BuildingAdd className="mr-2 text-cross-blue" size={20} />
                Cadastro de Nova Empresa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EmpresaForm onSubmit={handleEmpresaSubmit} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="permissoes">
          <PermissoesEmpresa />
        </TabsContent>
        
        <TabsContent value="listagem">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Building className="mr-2 text-cross-blue" size={20} />
                Listagem de Empresas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>CNPJ</TableHead>
                      <TableHead>Razão Social</TableHead>
                      <TableHead>Nome Fantasia</TableHead>
                      <TableHead>Perfil</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {empresas.map((empresa) => (
                      <TableRow key={empresa.id}>
                        <TableCell>{empresa.cnpj}</TableCell>
                        <TableCell>{empresa.razao_social}</TableCell>
                        <TableCell>{empresa.nome_fantasia}</TableCell>
                        <TableCell>
                          {empresa.perfis.map(perfil => (
                            <div key={perfil} className="mb-1">
                              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                {traduzirPerfil(perfil)}
                              </span>
                            </div>
                          ))}
                        </TableCell>
                        <TableCell>
                          <StatusBadge 
                            status={empresa.ativo ? 'success' : 'error'} 
                            text={empresa.ativo ? 'Ativo' : 'Inativo'} 
                          />
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleVerDetalhes(empresa)}
                            className="flex items-center gap-1"
                          >
                            <Eye size={14} />
                            Ver detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para detalhes da empresa */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes da Empresa</DialogTitle>
            <DialogDescription>
              Informações completas da empresa selecionada
            </DialogDescription>
          </DialogHeader>
          
          {selectedEmpresa && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">CNPJ</p>
                  <p>{selectedEmpresa.cnpj}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Razão Social</p>
                  <p>{selectedEmpresa.razao_social}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Nome Fantasia</p>
                  <p>{selectedEmpresa.nome_fantasia}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p>{selectedEmpresa.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Telefone</p>
                  <p>{selectedEmpresa.telefone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Endereço</p>
                  <p>{selectedEmpresa.endereco}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Cidade/Estado</p>
                  <p>{selectedEmpresa.cidade}/{selectedEmpresa.estado}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">CEP</p>
                  <p>{selectedEmpresa.cep}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Perfil</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedEmpresa.perfis.map(perfil => (
                      <span key={perfil} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {traduzirPerfil(perfil)}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <StatusBadge 
                    status={selectedEmpresa.ativo ? 'success' : 'error'} 
                    text={selectedEmpresa.ativo ? 'Ativo' : 'Inativo'} 
                  />
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <DialogClose asChild>
                  <Button variant="outline">Fechar</Button>
                </DialogClose>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default CadastroEmpresas;
