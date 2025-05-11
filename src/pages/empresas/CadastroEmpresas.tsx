
import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Building, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EmpresaForm from './components/EmpresaForm';
import PermissoesEmpresa from './components/PermissoesEmpresa';
import { Empresa } from './types/empresa.types';
import EmpresasListTab from './components/EmpresasListTab';
import EmpresaDetailsDialog from './components/EmpresaDetailsDialog';
import SearchFilter from '@/components/common/SearchFilter';
import { FilterConfig } from '@/components/common/SearchFilter';

// Mock data for companies
const empresasMock = [
  { 
    id: 1, 
    nome: "Transportes Rápidos Ltda", 
    razaoSocial: "Transportes Rápidos Logística Ltda",
    cnpj: "12.345.678/0001-90", 
    perfil: "Transportadora", 
    status: "ativo",
    transportadoraPrincipal: true,
    dataCadastro: "10/01/2023"
  },
  { 
    id: 2, 
    nome: "Filial SP Transportes", 
    razaoSocial: "Transportes Rápidos Logística Ltda - Filial SP",
    cnpj: "12.345.678/0002-71", 
    perfil: "Filial", 
    status: "ativo",
    dataCadastro: "15/03/2023"
  },
  { 
    id: 3, 
    nome: "Indústria ABC", 
    razaoSocial: "Indústria ABC S.A.",
    cnpj: "45.678.901/0001-23", 
    perfil: "Cliente", 
    status: "ativo",
    dataCadastro: "22/07/2023"
  },
  { 
    id: 4, 
    nome: "Fornecedor XYZ", 
    razaoSocial: "Fornecedor XYZ S.A.",
    cnpj: "56.789.012/0001-34", 
    perfil: "Fornecedor", 
    status: "ativo",
    dataCadastro: "05/05/2023"
  },
];

interface CadastroEmpresasProps {
  initialTab?: string;
}

const CadastroEmpresas: React.FC<CadastroEmpresasProps> = ({ initialTab = 'cadastro' }) => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState(initialTab);
  const [empresas, setEmpresas] = useState(empresasMock);
  const [selectedEmpresa, setSelectedEmpresa] = useState<any>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  // Atualiza a tab quando o initialTab mudar (útil para navegação via link)
  useEffect(() => {
    setCurrentTab(initialTab);
  }, [initialTab]);

  const handleEmpresaSubmit = (data: Partial<Empresa>) => {
    // Aqui normalmente seria feita uma chamada para API
    console.log("Empresa a cadastrar:", data);
    
    const novaEmpresa = {
      id: empresas.length + 1,
      nome: data.nomeFantasia || data.razaoSocial,
      razaoSocial: data.razaoSocial,
      cnpj: data.cnpj,
      perfil: data.perfil || "Cliente",
      status: "ativo",
      endereco: `${data.logradouro}, ${data.numero} - ${data.cidade}/${data.uf}`,
      email: data.email,
      telefone: data.telefone,
      dataCadastro: new Date().toLocaleDateString(),
    };
    
    setEmpresas([...empresas, novaEmpresa]);
    
    toast({
      title: "Empresa cadastrada",
      description: "A empresa foi cadastrada com sucesso.",
    });
  };

  const handleVerDetalhes = (empresa: any) => {
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
          <TabsTrigger value="cadastro">Nova Empresa</TabsTrigger>
          <TabsTrigger value="permissoes">Permissões</TabsTrigger>
          <TabsTrigger value="listagem">Empresas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cadastro">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Building className="mr-2 text-cross-blue" size={20} />
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
          <EmpresasListTab 
            empresas={empresas}
            onViewDetails={handleVerDetalhes}
          />
        </TabsContent>
      </Tabs>
      
      <EmpresaDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        empresa={selectedEmpresa}
      />
    </MainLayout>
  );
};

export default CadastroEmpresas;
