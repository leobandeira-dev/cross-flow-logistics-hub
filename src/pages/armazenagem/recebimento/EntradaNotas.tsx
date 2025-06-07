import React, { useRef, useState, useEffect } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DocumentPrintModal from '@/components/common/DocumentPrintModal';
import CadastroNota from './components/CadastroNota';
import ConsultaNotas from './components/ConsultaNotas';
import NotaPrintTemplate from './components/NotaPrintTemplate';
import DANFELayout from './components/print/DANFELayout';
import { PremiumGuard } from '@/components/subscription/PremiumGuard';
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

  // Sample XML content for each nota fiscal
  // In a real application, this would come from your backend
  const getNotaXml = (notaId: string) => {
    // Mock XML content - this would be replaced with actual XML data
    return `<?xml version="1.0" encoding="UTF-8"?>
<NFe xmlns="http://www.portalfiscal.inf.br/nfe">
  <infNFe Id="NFe${notaId}" versao="4.00">
    <ide>
      <cUF>35</cUF>
      <cNF>12345678</cNF>
      <natOp>VENDA DE MERCADORIA</natOp>
      <mod>55</mod>
      <serie>1</serie>
      <nNF>${notaId}</nNF>
      <dhEmi>2023-05-15T10:30:00-03:00</dhEmi>
      <tpNF>1</tpNF>
    </ide>
    <emit>
      <CNPJ>12345678901234</CNPJ>
      <xNome>EMPRESA EMITENTE LTDA</xNome>
      <enderEmit>
        <xLgr>RUA EXEMPLO</xLgr>
        <nro>123</nro>
        <xBairro>CENTRO</xBairro>
        <cMun>3550308</cMun>
        <xMun>SAO PAULO</xMun>
        <UF>SP</UF>
        <CEP>01001000</CEP>
      </enderEmit>
      <IE>123456789012</IE>
    </emit>
    <dest>
      <CNPJ>98765432109876</CNPJ>
      <xNome>CLIENTE DESTINATARIO SA</xNome>
      <enderDest>
        <xLgr>AVENIDA CLIENTE</xLgr>
        <nro>987</nro>
        <xBairro>BAIRRO CLIENTE</xBairro>
        <cMun>3550308</cMun>
        <xMun>SAO PAULO</xMun>
        <UF>SP</UF>
        <CEP>04001000</CEP>
      </enderDest>
      <IE>987654321098</IE>
    </dest>
  </infNFe>
</NFe>`;
  };

  return (
    <MainLayout title="Entrada de Notas Fiscais">
      <PremiumGuard 
        feature="Entrada de Notas Fiscais"
        description="O módulo de entrada de notas fiscais está disponível apenas para assinantes Premium. Registre e processe notas fiscais com recursos avançados."
      >
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
          xmlData={{
            xmlContent: selectedNota ? getNotaXml(selectedNota) : null
          }}
        />
      </PremiumGuard>
    </MainLayout>
  );
};

export default EntradaNotas;
