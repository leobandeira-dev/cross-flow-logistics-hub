
import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Building, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EmpresaForm from './components/EmpresaForm';
import PermissoesEmpresa from './components/PermissoesEmpresa';
import { Empresa } from './types/empresa.types';

interface CadastroEmpresasProps {
  initialTab?: string;
}

const CadastroEmpresas: React.FC<CadastroEmpresasProps> = ({ initialTab = 'cadastro' }) => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState(initialTab);
  
  // Atualiza a tab quando o initialTab mudar (útil para navegação via link)
  useEffect(() => {
    setCurrentTab(initialTab);
  }, [initialTab]);

  const handleEmpresaSubmit = (data: Partial<Empresa>) => {
    // Aqui normalmente seria feita uma chamada para API
    console.log("Empresa a cadastrar:", data);
    
    toast({
      title: "Empresa cadastrada",
      description: "A empresa foi cadastrada com sucesso.",
    });
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
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Building className="mr-2 text-cross-blue" size={20} />
                Listagem de Empresas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* TODO: Implementar tabela de listagem de empresas */}
              <p>Listagem de empresas será implementada em breve</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default CadastroEmpresas;
