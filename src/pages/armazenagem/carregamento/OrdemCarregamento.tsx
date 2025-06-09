
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Search } from 'lucide-react';
import CriarOCTab from '@/components/carregamento/tabs/CriarOCTab';
import ConsultarOCTab from '@/components/carregamento/tabs/ConsultarOCTab';

const OrdemCarregamento: React.FC = () => {
  const [activeTab, setActiveTab] = useState('criar');

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <FileText className="mr-2 text-cross-blue" size={24} />
            Ordem de Carregamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="criar" className="flex items-center space-x-2">
                <FileText size={16} />
                <span>Criar OC</span>
              </TabsTrigger>
              <TabsTrigger value="consultar" className="flex items-center space-x-2">
                <Search size={16} />
                <span>Consultar OC</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="criar" className="mt-6">
              <CriarOCTab />
            </TabsContent>
            
            <TabsContent value="consultar" className="mt-6">
              <ConsultarOCTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdemCarregamento;
