
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '../../../components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CriarOCTab from '@/components/carregamento/tabs/CriarOCTab';
import ConsultarOCTab from '@/components/carregamento/tabs/ConsultarOCTab';

const OrdemCarregamento: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>(searchParams.get('tab') || 'criar');

  // Handler para mudança de tab
  const handleTabChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('tab', value);
    setSearchParams(newParams);
    setActiveTab(value);
  };

  // Initialize tab from URL params
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      if (tabParam === 'criar' || tabParam === 'consultar') {
        setActiveTab(tabParam);
      } else {
        // If invalid tab parameter, default to 'criar'
        const newParams = new URLSearchParams(searchParams);
        newParams.set('tab', 'criar');
        setSearchParams(newParams);
        setActiveTab('criar');
      }
    } else {
      // If no tab parameter, default to 'criar'
      const newParams = new URLSearchParams(searchParams);
      newParams.set('tab', 'criar');
      setSearchParams(newParams);
      setActiveTab('criar');
    }
  }, [searchParams, setSearchParams]);

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
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="criar">Criar OC</TabsTrigger>
          <TabsTrigger value="consultar">Consultar OC</TabsTrigger>
        </TabsList>
        
        <TabsContent value="criar" className="w-full mt-6">
          <CriarOCTab />
        </TabsContent>
        
        <TabsContent value="consultar" className="w-full mt-6">
          <ConsultarOCTab />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default OrdemCarregamento;
