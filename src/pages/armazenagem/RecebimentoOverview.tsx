
import React from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import RecebimentoTabContent from './recebimento/components/RecebimentoTabContent';
import MovimentacoesTabContent from './recebimento/components/MovimentacoesTabContent';
import CarregamentoTabContent from './recebimento/components/CarregamentoTabContent';

const RecebimentoOverview: React.FC = () => {
  return (
    <MainLayout title="Armazenagem - Recebimento">
      <div className="mb-6">
        <h2 className="text-2xl font-heading mb-2">Módulo de Armazenagem</h2>
        <p className="text-gray-600">Gerencie recebimentos, movimentações internas e carregamentos</p>
      </div>

      <Tabs defaultValue="recebimento" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="recebimento">Recebimento</TabsTrigger>
          <TabsTrigger value="movimentacoes">Movimentações</TabsTrigger>
          <TabsTrigger value="carregamento">Carregamento</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recebimento">
          <RecebimentoTabContent />
        </TabsContent>
        
        <TabsContent value="movimentacoes">
          <MovimentacoesTabContent />
        </TabsContent>
        
        <TabsContent value="carregamento">
          <CarregamentoTabContent />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default RecebimentoOverview;
