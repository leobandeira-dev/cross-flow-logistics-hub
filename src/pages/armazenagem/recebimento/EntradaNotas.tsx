
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
  const [importedNotas, setImportedNotas] = useState<any[]>([]);
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

  const handleNotasImported = (notas: any[]) => {
    setImportedNotas(prev => [...prev, ...notas]);
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
          <TabsTrigger value="importar">Importar XMLs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cadastrar">
          <CadastroNota />
        </TabsContent>
        
        <TabsContent value="consultar">
          <ConsultaNotas onPrintClick={handlePrintClick} />
        </TabsContent>
        
        <TabsContent value="importar">
          <div className="space-y-6">
            <Tabs defaultValue="unico" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="unico">Importar XML Único</TabsTrigger>
                <TabsTrigger value="lote">Importar XML em Lote</TabsTrigger>
              </TabsList>
              
              <TabsContent value="unico">
                <ImportarViaXMLWithSave onNotasImported={handleNotasImported} />
              </TabsContent>
              
              <TabsContent value="lote">
                <ImportarXMLEmLoteWithSave onNotasImported={handleNotasImported} />
              </TabsContent>
            </Tabs>
            
            {importedNotas.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-4">
                    Notas Fiscais Importadas ({importedNotas.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {importedNotas.map((nota, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">NF: {nota.numero}</h4>
                          <Badge variant="outline">{nota.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">Valor: R$ {nota.valor_total?.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">Volumes: {nota.quantidade_volumes || 'N/A'}</p>
                        {nota.peso_bruto && (
                          <p className="text-sm text-gray-600">Peso: {nota.peso_bruto} kg</p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
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
