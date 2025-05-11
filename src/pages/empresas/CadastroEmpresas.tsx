import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Building, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CadastroEmpresas: React.FC = () => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState('cadastro');

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
              {/* Empresa form content goes here */}
              <p>Formulário de cadastro de empresa será implementado aqui</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="permissoes">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Users className="mr-2 text-cross-blue" size={20} />
                Permissões de Empresas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Permissões content goes here */}
              <p>Gerenciamento de permissões de empresas será implementado aqui</p>
            </CardContent>
          </Card>
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
              {/* Empresa list content goes here */}
              <p>Listagem de empresas será implementada aqui</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default CadastroEmpresas;
