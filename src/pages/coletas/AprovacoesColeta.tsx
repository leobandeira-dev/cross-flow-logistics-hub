
import React, { useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SolicitacoesPendentes from './components/SolicitacoesPendentes';
import HistoricoAprovacoes from './components/HistoricoAprovacoes';
import DetalhesAprovacaoDialog from './components/DetalhesAprovacaoDialog';
import DocumentoAprovacaoRenderer from './components/DocumentoAprovacaoRenderer';
import { solicitacoesPendentes, historicoAprovacoes } from './data/aprovacoesMock';
import { SolicitacaoColeta } from './types/coleta.types';

const AprovacoesColeta = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SolicitacaoColeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('pendentes');
  const [isRejecting, setIsRejecting] = useState(false);
  
  // Combinando os dados para facilitar a busca
  const allDocuments = [...solicitacoesPendentes, ...historicoAprovacoes];
  
  const handleSearch = (value: string) => {
    console.log('Search:', value);
    // Implementar lógica de busca
  };
  
  const handleFilterChange = (filter: string, value: string) => {
    console.log(`Filter ${filter} changed to ${value}`);
    // Implementar lógica de filtro
  };
  
  const openDetailDialog = (row: SolicitacaoColeta) => {
    setSelectedRequest(row);
    setIsDialogOpen(true);
    setIsRejecting(false);
  };

  // Renderiza o conteúdo do documento para impressão
  const renderAprovacaoDocument = (documentId: string) => {
    return (
      <DocumentoAprovacaoRenderer 
        documentId={documentId}
        documents={allDocuments}
      />
    );
  };

  return (
    <MainLayout title="Aprovações de Coleta">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-heading">Gestão de Aprovações</h2>
          <p className="text-gray-500">Aprove ou recuse solicitações de coleta pendentes</p>
        </div>
      </div>
      
      <Tabs defaultValue="pendentes" className="w-full mb-6" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="pendentes">Pendentes de Aprovação</TabsTrigger>
          <TabsTrigger value="historico">Histórico de Aprovações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pendentes">
          <SolicitacoesPendentes 
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            onOpenDetail={openDetailDialog}
            renderAprovacaoDocument={renderAprovacaoDocument}
            allDocuments={allDocuments}
          />
        </TabsContent>
        
        <TabsContent value="historico">
          <HistoricoAprovacoes
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            onOpenDetail={openDetailDialog}
            renderAprovacaoDocument={renderAprovacaoDocument} 
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            allDocuments={allDocuments}
          />
        </TabsContent>
      </Tabs>
      
      <DetalhesAprovacaoDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedRequest={selectedRequest}
        isRejecting={isRejecting}
        setIsRejecting={setIsRejecting}
      />
    </MainLayout>
  );
};

export default AprovacoesColeta;

// This maintains typescript global declaration in original file
declare global {
  var isRejecting: boolean;
}
