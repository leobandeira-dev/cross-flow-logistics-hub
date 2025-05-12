
import React, { useRef, useState, useEffect } from 'react';
import MainLayout from '../../../components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DocumentPrintModal from '@/components/common/DocumentPrintModal';
import CadastroNota from './components/CadastroNota';
import ConsultaNotas from './components/ConsultaNotas';
import NotaPrintTemplate from './components/NotaPrintTemplate';
import DANFELayout from './components/print/DANFELayout';
import { notasFiscais } from './data/mockData';
import { generateDANFEFromXML, createPDFDataUrl } from './utils/danfeAPI';
import { toast } from '@/hooks/use-toast';

const EntradaNotas: React.FC = () => {
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [selectedNota, setSelectedNota] = useState<string>('');
  const [isGeneratingDANFE, setIsGeneratingDANFE] = useState(false);
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
  
  const handlePrintClick = async (notaId: string) => {
    setSelectedNota(notaId);
    
    // Obter a nota fiscal correspondente
    const nota = notasFiscais.find(nota => nota.id === notaId);
    
    // Se tiver conteúdo XML, tentar gerar via API
    if (nota && nota.xmlContent) {
      try {
        setIsGeneratingDANFE(true);
        toast({
          title: "Gerando DANFE",
          description: "Aguarde enquanto o DANFE está sendo gerado...",
        });
        
        // Gerar DANFE via API
        const pdfBase64 = await generateDANFEFromXML(nota.xmlContent);
        
        if (pdfBase64) {
          // Abrir PDF em nova janela
          const dataUrl = createPDFDataUrl(pdfBase64);
          window.open(dataUrl, '_blank');
          
          toast({
            title: "DANFE gerado",
            description: "O DANFE foi aberto em uma nova janela.",
          });
          return; // Se gerou com sucesso, não precisa abrir o modal
        }
      } catch (error) {
        console.error("Erro ao gerar DANFE via API:", error);
        // Continue para abrir o modal de impressão como fallback
      } finally {
        setIsGeneratingDANFE(false);
      }
    }
    
    // Fallback: abrir o modal de impressão com o DANFE renderizado
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
          <ConsultaNotas 
            onPrintClick={handlePrintClick}
            isGeneratingDANFE={isGeneratingDANFE}
          />
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
    </MainLayout>
  );
};

export default EntradaNotas;
