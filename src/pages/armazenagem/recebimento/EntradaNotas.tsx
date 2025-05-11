
import React, { useRef, useState } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PrintLayoutModal from '@/components/carregamento/enderecamento/PrintLayoutModal';
import CadastroNota from './components/CadastroNota';
import ConsultaNotas from './components/ConsultaNotas';
import NotaPrintTemplate from './components/NotaPrintTemplate';

const EntradaNotas: React.FC = () => {
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [selectedNota, setSelectedNota] = useState<string>('');
  const notaFiscalRef = useRef<HTMLDivElement>(null);
  
  const handlePrintClick = (notaId: string) => {
    setSelectedNota(notaId);
    setPrintModalOpen(true);
  };

  return (
    <MainLayout title="Entrada de Notas Fiscais">
      <div className="mb-6">
        <h2 className="text-2xl font-heading mb-2">Entrada de Notas Fiscais</h2>
        <p className="text-gray-600">Registre e processe notas fiscais de entrada de mercadorias</p>
      </div>
      
      <Tabs defaultValue="cadastrar" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="cadastrar">Cadastrar Nota</TabsTrigger>
          <TabsTrigger value="consultar">Consultar Notas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cadastrar">
          <CadastroNota />
        </TabsContent>
        
        <TabsContent value="consultar">
          <ConsultaNotas onPrintClick={handlePrintClick} />
        </TabsContent>
      </Tabs>
      
      {/* Hidden div that serves as print template */}
      <div className="hidden">
        <div ref={notaFiscalRef}>
          <NotaPrintTemplate notaId={selectedNota} />
        </div>
      </div>
      
      <PrintLayoutModal
        open={printModalOpen}
        onOpenChange={setPrintModalOpen}
        orderNumber={selectedNota}
        layoutRef={notaFiscalRef}
      />
    </MainLayout>
  );
};

export default EntradaNotas;
