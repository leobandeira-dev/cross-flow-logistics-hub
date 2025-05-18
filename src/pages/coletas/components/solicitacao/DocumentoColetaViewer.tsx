
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SolicitacaoColeta } from '../../types/coleta.types';
import { formatarNumero } from '../../utils/volumes/formatters';
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
      
      {/* Main Content - Split into columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Origin and Destination */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-4">Informações da Coleta</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Tipo de Frete</p>
                <p className="font-medium">{solicitacao.cliente ? 'FOB' : 'CIF'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Origem</p>
                <p className="font-medium">{solicitacao.origem || (solicitacao.remetente?.razaoSocial)}</p>
                {solicitacao.remetente && (
                  <p className="text-sm text-gray-400">CNPJ: {solicitacao.remetente.cnpj}</p>
                )}
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Destino</p>
                <p className="font-medium">{solicitacao.destino || (solicitacao.destinatario?.razaoSocial)}</p>
                {solicitacao.destinatario && (
                  <p className="text-sm text-gray-400">CNPJ: {solicitacao.destinatario.cnpj}</p>
                )}
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Data de Coleta</p>
                <p className="font-medium">{solicitacao.dataColeta || solicitacao.data}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Right Column - Volume Details */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-4">Detalhes dos Volumes</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Volumes</p>
                <p className="font-medium">{solicitacao.volumes || 0}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Peso Total</p>
                <p className="font-medium">
                  {formatarNumero(parseFloat(solicitacao.peso || '0'))} kg
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Notas Fiscais</p>
                <p className="font-medium">{solicitacao.notas?.join(', ') || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Observations */}
      {solicitacao.observacoes && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-4">Observações</h3>
            <p className="text-gray-700">{solicitacao.observacoes}</p>
          </CardContent>
        </Card>
      )}
      
      {/* Approval Information */}
      {'dataAprovacao' in solicitacao && solicitacao.dataAprovacao && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-4">Informações de Aprovação</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Data de Aprovação</p>
                <p className="font-medium">{solicitacao.dataAprovacao}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Aprovado por</p>
                <p className="font-medium">{'aprovador' in solicitacao ? solicitacao.aprovador : 'N/A'}</p>
              </div>
              
              {'motivoRecusa' in solicitacao && solicitacao.motivoRecusa && (
                <div>
                  <p className="text-sm text-gray-500 text-red-600">Motivo da Recusa</p>
                  <p className="font-medium text-red-600">{solicitacao.motivoRecusa}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Action Buttons for various stages */}
      {showActions && (
        <div className="flex justify-end space-x-4">
          {solicitacao.status === 'pending' && onApprove && onReject && (
            <>
              <button 
                onClick={onReject} 
                className="px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
              >
                Recusar
              </button>
              <button 
                onClick={onApprove} 
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Aprovar
              </button>
            </>
          )}
          
          {solicitacao.status === 'approved' && onAllocate && (
            <button 
              onClick={onAllocate} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Alocar Carga
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentoColetaViewer;
