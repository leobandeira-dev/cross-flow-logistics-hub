
import React, { useRef, useState, useEffect } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DocumentPrintModal from '@/components/common/DocumentPrintModal';
import CadastroNota from './components/CadastroNota';
import ConsultaNotas from './components/ConsultaNotas';
import NotaPrintTemplate from './components/NotaPrintTemplate';
import DANFELayout from './components/print/DANFELayout';
import { notasFiscais } from './data/mockData';

const EntradaNotas: React.FC = () => {
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [selectedNota, setSelectedNota] = useState<string>('');
  const notaFiscalRef = useRef<HTMLDivElement>(null);
  const danfeRef = useRef<HTMLDivElement>(null);
  const simplifiedDanfeRef = useRef<HTMLDivElement>(null);
  
  // Make sure refs are properly updated when content changes
  const [notaData, setNotaData] = useState<any>(null);
  
  // Find the selected nota fiscal data for DANFE
  useEffect(() => {
    if (selectedNota) {
      const foundNota = notasFiscais.find(nota => nota.id === selectedNota);
      console.log("Nota selecionada para impressão:", foundNota);
      setNotaData(foundNota);
    } else {
      setNotaData(null);
    }
  }, [selectedNota]);
  
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
      
      {/* Hidden divs that serve as print templates */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={notaFiscalRef} style={{ width: '800px', backgroundColor: '#fff' }}>
          <NotaPrintTemplate notaId={selectedNota} />
        </div>
        
        <div ref={danfeRef} style={{ width: '800px', backgroundColor: '#fff' }}>
          <DANFELayout notaFiscalData={notaData} />
        </div>
        
        <div ref={simplifiedDanfeRef} style={{ width: '800px', backgroundColor: '#fff' }}>
          <DANFELayout notaFiscalData={notaData} simplified />
        </div>
      </div>
      
      <DocumentPrintModal
        open={printModalOpen}
        onOpenChange={setPrintModalOpen}
        documentId={selectedNota}
        documentType="Nota Fiscal"
        layoutRef={notaFiscalRef}
        danfeRef={danfeRef}
        simplifiedDanfeRef={simplifiedDanfeRef}
        xmlData={notaData}
      />
    </MainLayout>
  );
};

export default EntradaNotas;
