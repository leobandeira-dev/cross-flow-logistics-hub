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
import { supabase } from '@/integrations/supabase/client';

interface CadastroEmpresasProps {
  initialTab?: string;
}

const CadastroEmpresas: React.FC<CadastroEmpresasProps> = ({ initialTab = 'cadastro' }) => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState(initialTab);
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmpresa, setSelectedEmpresa] = useState<any>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  // Atualiza a tab quando o initialTab mudar (útil para navegação via link)
  useEffect(() => {
    setCurrentTab(initialTab);
  }, [initialTab]);
  
  // Carregar empresas do Supabase quando o componente for montado
  useEffect(() => {
    const fetchEmpresas = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('empresas')
          .select('*')
          .order('razao_social', { ascending: true });
        
        if (error) throw error;
        
        // Mapear os dados do Supabase para o formato esperado pelo componente
        const empresasFormatadas = data.map(emp => ({
          id: emp.id,
          nome: emp.nome_fantasia || emp.razao_social,
          razaoSocial: emp.razao_social,
          nomeFantasia: emp.nome_fantasia,
          cnpj: emp.cnpj,
          perfil: emp.perfil || 'Cliente',
          status: emp.status,
          endereco: emp.logradouro ? `${emp.logradouro}, ${emp.numero} - ${emp.cidade}/${emp.uf}` : null,
          email: emp.email,
          telefone: emp.telefone,
          logradouro: emp.logradouro,
          numero: emp.numero,
          complemento: emp.complemento,
          bairro: emp.bairro,
          cidade: emp.cidade,
          uf: emp.uf,
          estado: emp.estado,
          cep: emp.cep,
          inscricaoEstadual: emp.inscricao_estadual,
          transportadoraPrincipal: emp.transportadora_principal,
          dataCadastro: new Date(emp.created_at).toLocaleDateString(),
        }));
        
        console.log('Empresas carregadas:', empresasFormatadas);
        setEmpresas(empresasFormatadas);
      } catch (error: any) {
        console.error('Erro ao carregar empresas:', error);
        toast({
          title: 'Erro ao carregar empresas',
          description: error.message || 'Não foi possível carregar as empresas.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmpresas();
    
    // Configurar listener para atualizações em tempo real da tabela empresas
    const channel = supabase
      .channel('empresas-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'empresas' }, 
        () => {
          console.log('Alterações detectadas na tabela empresas. Recarregando dados...');
          fetchEmpresas();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  const handleEmpresaSubmit = async (data: Partial<Empresa>) => {
    console.log("Empresa submetida:", data);
    
    // Recarregar a lista de empresas
    try {
      const { data: empresasAtualizadas, error } = await supabase
        .from('empresas')
        .select('*')
        .order('razao_social', { ascending: true });
        
      if (error) {
        console.error('Erro ao recarregar empresas:', error);
        return;
      }
      
      // Atualizar o estado com as empresas atualizadas
      const empresasFormatadas = empresasAtualizadas.map(emp => ({
        id: emp.id,
        nome: emp.nome_fantasia || emp.razao_social,
        razaoSocial: emp.razao_social,
        nomeFantasia: emp.nome_fantasia,
        cnpj: emp.cnpj,
        perfil: emp.perfil || 'Cliente',
        status: emp.status,
        endereco: emp.logradouro ? `${emp.logradouro}, ${emp.numero} - ${emp.cidade}/${emp.uf}` : null,
        email: emp.email,
        telefone: emp.telefone,
        logradouro: emp.logradouro,
        numero: emp.numero,
        complemento: emp.complemento,
        bairro: emp.bairro,
        cidade: emp.cidade,
        uf: emp.uf,
        estado: emp.estado,
        cep: emp.cep,
        inscricaoEstadual: emp.inscricao_estadual,
        transportadoraPrincipal: emp.transportadora_principal,
        dataCadastro: new Date(emp.created_at).toLocaleDateString(),
      }));
      
      setEmpresas(empresasFormatadas);
      
      toast({
        title: "Empresa atualizada",
        description: "Os dados da empresa foram atualizados com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro ao atualizar empresas:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar os dados. Tente novamente.",
        variant: "destructive",
      });
    }
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
              <EmpresaForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="permissoes">
          <PermissoesEmpresa />
        </TabsContent>
        
        <TabsContent value="listagem">
          <EmpresasListTab 
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
