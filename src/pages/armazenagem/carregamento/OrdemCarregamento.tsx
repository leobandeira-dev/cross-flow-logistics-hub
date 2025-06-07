
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '../../../components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CriarOCTab from '@/components/carregamento/tabs/CriarOCTab';
import ConsultarOCTab from '@/components/carregamento/tabs/ConsultarOCTab';
import CarregamentoIntegradoTab from '@/components/carregamento/tabs/CarregamentoIntegradoTab';

const OrdemCarregamento: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>('criar');

  useEffect(() => {
    // Get tab from URL or default to 'criar'
    const tabParam = searchParams.get('tab');
    if (tabParam && (tabParam === 'criar' || tabParam === 'consultar' || tabParam === 'integrado')) {
      setActiveTab(tabParam);
    } else {
      // Set default tab
      setActiveTab('criar');
      
      // Update URL without causing a page reload
      const newParams = new URLSearchParams(searchParams);
      newParams.set('tab', 'criar');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Handler for tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update URL without causing a page reload
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', value);
    setSearchParams(newParams, { replace: true });
  };

  return (
    <MainLayout title="Ordem de Carregamento">
      <div className="mb-6">
        <h2 className="text-2xl font-heading mb-2">Ordem de Carregamento (OC)</h2>
        <p className="text-gray-600">Crie e gerencie ordens de carregamento para expedição</p>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange} 
        className="w-full space-y-6"
      >
        <TabsList className="grid grid-cols-3 w-[600px]">
          <TabsTrigger value="criar">Criar OC</TabsTrigger>
          <TabsTrigger value="consultar">Consultar OC</TabsTrigger>
          <TabsTrigger value="integrado">Carregamento Integrado</TabsTrigger>
        </TabsList>
        
        <TabsContent value="criar" className="w-full mt-6">
          <CriarOCTab />
        </TabsContent>
        
        <TabsContent value="consultar" className="w-full mt-6">
          <ConsultarOCTab />
        </TabsContent>
        
        <TabsContent value="integrado" className="w-full mt-6">
          <CarregamentoIntegradoTab />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default OrdemCarregamento;
