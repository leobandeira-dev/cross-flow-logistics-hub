
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DocumentosAConferir from './DocumentosAConferir';
import DocumentosEmTransito from './DocumentosEmTransito';
import DocumentosEntregues from './DocumentosEntregues';

const DocumentosTab: React.FC = () => {
  const [activeDocTab, setActiveDocTab] = useState('aConferir');

  return (
    <div className="space-y-4">
      <Tabs value={activeDocTab} onValueChange={setActiveDocTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="aConferir">A Conferir</TabsTrigger>
          <TabsTrigger value="emTransito">Em Trânsito</TabsTrigger>
          <TabsTrigger value="entregues">Entregues</TabsTrigger>
        </TabsList>

        <TabsContent value="aConferir">
          <DocumentosAConferir />
        </TabsContent>
        
        <TabsContent value="emTransito">
          <DocumentosEmTransito />
        </TabsContent>
        
        <TabsContent value="entregues">
          <DocumentosEntregues />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentosTab;
