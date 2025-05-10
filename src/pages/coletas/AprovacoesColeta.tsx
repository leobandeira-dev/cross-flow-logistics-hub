
import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SolicitacoesPendentes from './components/SolicitacoesPendentes';
import HistoricoAprovacoes from './components/HistoricoAprovacoes';
import DetalhesAprovacaoDialog from './components/DetalhesAprovacaoDialog';
import DocumentoAprovacaoRenderer from './components/DocumentoAprovacaoRenderer';
import { solicitacoesPendentes as mockPendentes, historicoAprovacoes as mockHistorico } from './data/aprovacoesMock';
import { SolicitacaoColeta } from './types/coleta.types';

const AprovacoesColeta = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SolicitacaoColeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('pendentes');
  const [isRejecting, setIsRejecting] = useState(false);
  
  // State for managing solicitations data
  const [solicitacoesPendentes, setSolicitacoesPendentes] = useState(mockPendentes);
  const [historicoAprovacoes, setHistoricoAprovacoes] = useState(mockHistorico);
  
  // Debugging: Print state whenever solicitations change
  useEffect(() => {
    console.log("Pendentes:", solicitacoesPendentes.length);
    console.log("Histórico:", historicoAprovacoes.length);
  }, [solicitacoesPendentes, historicoAprovacoes]);
  
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

  // Function to handle approval of a solicitation
  const handleApprove = (solicitacaoId: string, observacoes?: string) => {
    console.log("AprovacoesColeta: Approving solicitation:", solicitacaoId);
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString()} às ${currentDate.toLocaleTimeString()}`;
    const approverName = "Maria Oliveira"; // Normalmente viria da sessão do usuário
    
    // Find the solicitation to approve
    const solicitacaoToApprove = solicitacoesPendentes.find(s => s.id === solicitacaoId);
    
    if (solicitacaoToApprove) {
      // Remove from pending
      setSolicitacoesPendentes(prev => prev.filter(s => s.id !== solicitacaoId));
      
      // Add to history as approved
      const approvedSolicitation = {
        ...solicitacaoToApprove,
        status: 'approved' as const,
        aprovador: approverName,
        dataAprovacao: formattedDate,
        observacoes: observacoes || undefined
      };
      
      setHistoricoAprovacoes(prev => [approvedSolicitation, ...prev]);
      
      // Update the selected request if it's the one being approved
      if (selectedRequest && selectedRequest.id === solicitacaoId) {
        setSelectedRequest(approvedSolicitation);
      }
      
      // Switch to the history tab after approval
      setActiveTab('historico');
    }
    
    // Close the dialog
    setIsDialogOpen(false);
  };
  
  // Function to handle rejection of a solicitation
  const handleReject = (solicitacaoId: string, motivoRecusa: string) => {
    console.log("AprovacoesColeta: Rejecting solicitation:", solicitacaoId);
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString()} às ${currentDate.toLocaleTimeString()}`;
    const approverName = "Maria Oliveira"; // Normalmente viria da sessão do usuário
    
    // Find the solicitation to reject
    const solicitacaoToReject = solicitacoesPendentes.find(s => s.id === solicitacaoId);
    
    if (solicitacaoToReject) {
      // Remove from pending
      setSolicitacoesPendentes(prev => prev.filter(s => s.id !== solicitacaoId));
      
      // Add to history as rejected
      const rejectedSolicitation = {
        ...solicitacaoToReject,
        status: 'rejected' as const,
        aprovador: approverName,
        dataAprovacao: formattedDate,
        motivoRecusa
      };
      
      setHistoricoAprovacoes(prev => [rejectedSolicitation, ...prev]);
      
      // Update the selected request if it's the one being rejected
      if (selectedRequest && selectedRequest.id === solicitacaoId) {
        setSelectedRequest(rejectedSolicitation);
      }
      
      // Switch to the history tab after rejection
      setActiveTab('historico');
    }
    
    // Close the dialog
    setIsDialogOpen(false);
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
            solicitacoes={solicitacoesPendentes}
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
            solicitacoes={historicoAprovacoes}
          />
        </TabsContent>
      </Tabs>
      
      <DetalhesAprovacaoDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedRequest={selectedRequest}
        isRejecting={isRejecting}
        setIsRejecting={setIsRejecting}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </MainLayout>
  );
};

export default AprovacoesColeta;

// This maintains typescript global declaration in original file
declare global {
  var isRejecting: boolean;
}
