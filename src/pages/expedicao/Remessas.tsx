
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, Truck, FileCheck } from 'lucide-react';
import DocumentosTab from './components/faturamento/documentos/DocumentosTab';

const Remessas: React.FC = () => {
  const [activeTab, setActiveTab] = useState('documentos');

  return (
    <MainLayout title="Gestão de Documentos">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Documentação Fiscal</CardTitle>
                <CardDescription>
                  Gerencie os documentos fiscais emitidos por carga
                </CardDescription>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="documentos">
                  <FileCheck className="h-4 w-4 mr-2" />
                  Documentos
                </TabsTrigger>
                <TabsTrigger value="entregas">
                  <Truck className="h-4 w-4 mr-2" />
                  Entregas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="documentos">
                <DocumentosTab />
              </TabsContent>
              
              <TabsContent value="entregas">
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-muted-foreground mb-4">Funcionalidade em desenvolvimento.</p>
                  <p className="text-sm text-muted-foreground">
                    O módulo de controle de entregas estará disponível em breve.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Remessas;
