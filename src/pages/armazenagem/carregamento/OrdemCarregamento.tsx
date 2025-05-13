
import React from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CriarOCTab from '@/components/carregamento/tabs/CriarOCTab';
import ConsultarOCTab from '@/components/carregamento/tabs/ConsultarOCTab';

const OrdemCarregamento: React.FC = () => {
  return (
    <MainLayout title="Ordem de Carregamento">
      <div className="mb-6">
        <h2 className="text-2xl font-heading mb-2">Ordem de Carregamento (OC)</h2>
        <p className="text-gray-600">Crie e gerencie ordens de carregamento para expedição</p>
      </div>
      
      <Tabs defaultValue="criar" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="criar">Criar OC</TabsTrigger>
          <TabsTrigger value="consultar">Consultar OC</TabsTrigger>
        </TabsList>
        
        <TabsContent value="criar">
          <CriarOCTab />
        </TabsContent>
        
        <TabsContent value="consultar">
          <ConsultarOCTab />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default OrdemCarregamento;
