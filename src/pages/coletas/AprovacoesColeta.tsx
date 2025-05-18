import React, { useState, useEffect } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SolicitacoesPendentes from './components/SolicitacoesPendentes';
import HistoricoAprovacoes from './components/HistoricoAprovacoes';
import DetalhesAprovacaoDialog from './components/DetalhesAprovacaoDialog';
import DocumentoAprovacaoRenderer from './components/DocumentoAprovacaoRenderer';
import { solicitacoesPendentes as mockPendentes, historicoAprovacoes as mockHistorico } from './data/aprovacoesMock';
import { SolicitacaoColeta } from './types/coleta.types';
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Check the props interface for DetalhesAprovacaoDialog
export interface DetalhesAprovacaoDialogProps {
  open: boolean;  // Changed from isOpen to open to match component definition
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRequest: SolicitacaoColeta | null;
  isRejecting: boolean;
  setIsRejecting: React.Dispatch<React.SetStateAction<boolean>>;
  onApprove: (solicitacaoId: string, observacoes?: string) => void;
  onReject: (solicitacaoId: string, motivoRecusa: string) => void;
}

const AprovacoesColeta = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SolicitacaoColeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('pendentes');
  const [isRejecting, setIsRejecting] = useState(false);
  
  // Estado para gerenciamento dos dados de solicitações
  const [solicitacoesPendentes, setSolicitacoesPendentes] = useState(mockPendentes);
  const [historicoAprovacoes, setHistoricoAprovacoes] = useState(mockHistorico);
  
  // Depuração: Imprimir estado sempre que as solicitações mudarem
  useEffect(() => {
    console.log("Estado atual - Pendentes:", solicitacoesPendentes.length);
    console.log("Estado atual - Histórico:", historicoAprovacoes.length);
  }, [solicitacoesPendentes, historicoAprovacoes]);
  
  // Combinando os dados para facilitar a busca
  const allDocuments = [...solicitacoesPendentes, ...historicoAprovacoes];
  
  const handleSearch = (value: string) => {
    console.log('Busca:', value);
    // Implementar lógica de busca
  };
  
  const handleFilterChange = (filter: string, value: string) => {
    console.log(`Filtro ${filter} alterado para ${value}`);
    // Implementar lógica de filtro
  };
  
  const openDetailDialog = (row: SolicitacaoColeta) => {
    setSelectedRequest(row);
    setIsDialogOpen(true);
    setIsRejecting(false);
  };

  // Função para lidar com a aprovação de uma solicitação
  const handleApprove = (solicitacaoId: string, observacoes?: string) => {
    console.log("AprovacoesColeta: Aprovando solicitação:", solicitacaoId);
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString()} às ${currentDate.toLocaleTimeString()}`;
    const approverName = "Maria Oliveira"; // Normalmente viria da sessão do usuário
    
    // Encontrar a solicitação para aprovar
    const solicitacaoToApprove = solicitacoesPendentes.find(s => s.id === solicitacaoId);
    
    if (solicitacaoToApprove) {
      // Remover das pendentes
      setSolicitacoesPendentes(prev => prev.filter(s => s.id !== solicitacaoId));
      
      // Adicionar ao histórico como aprovada
      const approvedSolicitation = {
        ...solicitacaoToApprove,
        status: 'approved' as const,
        aprovador: approverName,
        dataAprovacao: formattedDate,
        observacoes: observacoes || undefined
      };
      
      setHistoricoAprovacoes(prev => [approvedSolicitation, ...prev]);
      
      // Atualiza a solicitação selecionada se for a que está sendo aprovada
      if (selectedRequest && selectedRequest.id === solicitacaoId) {
        setSelectedRequest(approvedSolicitation);
      }
      
      // Mudar para a aba de histórico após a aprovação
      setActiveTab('historico');
      
      console.log("Solicitação aprovada e movida para o histórico!");
    } else {
      console.error("Solicitação não encontrada:", solicitacaoId);
    }
  };
  
  // Função para lidar com a rejeição de uma solicitação
  const handleReject = (solicitacaoId: string, motivoRecusa: string) => {
    console.log("AprovacoesColeta: Recusando solicitação:", solicitacaoId);
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleDateString()} às ${currentDate.toLocaleTimeString()}`;
    const approverName = "Maria Oliveira"; // Normalmente viria da sessão do usuário
    
    // Encontrar a solicitação para recusar
    const solicitacaoToReject = solicitacoesPendentes.find(s => s.id === solicitacaoId);
    
    if (solicitacaoToReject) {
      // Remover das pendentes
      setSolicitacoesPendentes(prev => prev.filter(s => s.id !== solicitacaoId));
      
      // Adicionar ao histórico como recusada
      const rejectedSolicitation = {
        ...solicitacaoToReject,
        status: 'rejected' as const,
        aprovador: approverName,
        dataAprovacao: formattedDate,
        motivoRecusa
      };
      
      setHistoricoAprovacoes(prev => [rejectedSolicitation, ...prev]);
      
      // Atualiza a solicitação selecionada se for a que está sendo recusada
      if (selectedRequest && selectedRequest.id === solicitacaoId) {
        setSelectedRequest(rejectedSolicitation);
      }
      
      // Mudar para a aba de histórico após a rejeição
      setActiveTab('historico');
      
      console.log("Solicitação recusada e movida para o histórico!");
    } else {
      console.error("Solicitação não encontrada:", solicitacaoId);
    }
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
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedRequest={selectedRequest}
        isRejecting={isRejecting}
        setIsRejecting={setIsRejecting}
        onApprove={handleApprove}
        onReject={handleReject}
      />
      
      <Toaster />
    </MainLayout>
  );
};

export default AprovacoesColeta;

// Mantém a declaração global do typescript no arquivo original
declare global {
  var isRejecting: boolean;
}
