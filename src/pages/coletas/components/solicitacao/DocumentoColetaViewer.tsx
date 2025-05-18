
import React from 'react';
import { SolicitacaoColeta } from '../../types/coleta.types';
import SolicitacaoViewer from './SolicitacaoViewer';
import { InternalFormData } from './hooks/solicitacaoFormTypes';
import { Badge } from '@/components/ui/badge';

interface DocumentoColetaViewerProps {
  solicitacao: SolicitacaoColeta;
  showActions?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onAllocate?: () => void;
}

const DocumentoColetaViewer: React.FC<DocumentoColetaViewerProps> = ({
  solicitacao,
  showActions = false,
  onApprove,
  onReject,
  onAllocate
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Aprovado</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Recusado</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-500">Pendente</Badge>;
    }
  };
  
  // Convert SolicitacaoColeta to InternalFormData format
  const formData: InternalFormData = {
    remetente: solicitacao.remetente || { razaoSocial: '', cnpj: '' },
    destinatario: solicitacao.destinatario || { razaoSocial: '', cnpj: '' },
    dataColeta: solicitacao.dataColeta || solicitacao.data || '',
    horaColeta: '',
    observacoes: solicitacao.observacoes || '',
    notasFiscais: solicitacao.notasFiscais || [],
    tipoFrete: solicitacao.cliente ? 'FOB' : 'CIF',
    origem: solicitacao.origem || '',
    destino: solicitacao.destino || '',
    // Address display
    origemEndereco: solicitacao.remetente?.endereco?.logradouro || '',
    origemCEP: solicitacao.remetente?.endereco?.cep || '',
    destinoEndereco: solicitacao.destinatario?.endereco?.logradouro || '',
    destinoCEP: solicitacao.destinatario?.endereco?.cep || '',
    // Approval flow data
    dataAprovacao: solicitacao.dataAprovacao || '',
    dataInclusao: solicitacao.dataSolicitacao || solicitacao.data || '',
  };
  
  return (
    <div className="space-y-6">
      {/* Document Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Solicitação: {solicitacao.id}</h2>
          <p className="text-gray-500">Data: {solicitacao.dataSolicitacao || solicitacao.data}</p>
        </div>
        <div className="flex space-x-2 items-center">
          {getStatusBadge(solicitacao.status)}
        </div>
      </div>
      
      {/* Main Document Viewer */}
      <SolicitacaoViewer 
        formData={formData}
        readOnly={true}
        showActions={showActions}
        onApprove={onApprove}
        onReject={onReject}
        onAllocate={onAllocate}
      />
    </div>
  );
};

export default DocumentoColetaViewer;
