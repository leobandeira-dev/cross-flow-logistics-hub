
import React from 'react';
import { SolicitacaoColeta } from '../types/coleta.types';

interface DocumentoAprovacaoRendererProps {
  documentId: string;
  documents: SolicitacaoColeta[];
}

const DocumentoAprovacaoRenderer: React.FC<DocumentoAprovacaoRendererProps> = ({
  documentId,
  documents
}) => {
  const documento = documents.find(doc => doc.id === documentId);
  
  if (!documento) return <div>Documento não encontrado</div>;
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Detalhes da Solicitação</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Cliente</p>
          <p>{documento.cliente}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Solicitante</p>
          <p>{documento.solicitante}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Data Solicitação</p>
          <p>{documento.data}</p>
        </div>
        {'dataAprovacao' in documento && (
          <div>
            <p className="text-sm font-medium text-gray-500">Data Aprovação</p>
            <p>{documento.dataAprovacao}</p>
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-500">Status</p>
          <p>{documento.status === 'approved' ? 'Aprovado' : documento.status === 'rejected' ? 'Recusado' : 'Pendente'}</p>
        </div>
        {'aprovador' in documento && (
          <div>
            <p className="text-sm font-medium text-gray-500">Aprovador</p>
            <p>{documento.aprovador}</p>
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Notas Fiscais</p>
        <p>{documento.notas.join(', ')}</p>
      </div>
      {'motivoRecusa' in documento && (
        <div>
          <p className="text-sm font-medium text-gray-500">Motivo da Recusa</p>
          <p className="text-red-600">{documento.motivoRecusa}</p>
        </div>
      )}
    </div>
  );
};

export default DocumentoAprovacaoRenderer;
