
import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import EmpresaDetailsDialog from './components/EmpresaDetailsDialog';
import { useEmpresasList } from './hooks/useEmpresasList';
import NovaEmpresaTab from './components/tabs/NovaEmpresaTab';
import PermissoesTabWrapper from './components/tabs/PermissoesTabWrapper';
import EmpresasListTabWrapper from './components/tabs/EmpresasListTabWrapper';

interface CadastroEmpresasProps {
  initialTab?: string;
}

const CadastroEmpresas: React.FC<CadastroEmpresasProps> = ({ initialTab = 'cadastro' }) => {
  const [currentTab, setCurrentTab] = useState(initialTab);
  const { 
    empresas, 
    isLoading, 
    selectedEmpresa, 
    detailsDialogOpen, 
    setDetailsDialogOpen, 
    handleVerDetalhes, 
    handleEmpresaSubmit 
  } = useEmpresasList();
  
  // Atualiza a tab quando o initialTab mudar (útil para navegação via link)
  useEffect(() => {
    setCurrentTab(initialTab);
  }, [initialTab]);

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
          <NovaEmpresaTab />
        </TabsContent>
        
        <TabsContent value="permissoes">
          <PermissoesTabWrapper />
        </TabsContent>
        
        <TabsContent value="listagem">
          <EmpresasListTabWrapper 
            empresas={empresas}
            isLoading={isLoading}
            onViewDetails={handleVerDetalhes}
          />
        </TabsContent>
      </Tabs>
      
      <EmpresaDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        empresa={selectedEmpresa}
        onSubmit={handleEmpresaSubmit}
      />
    </MainLayout>
  );
};

export default CadastroEmpresas;
