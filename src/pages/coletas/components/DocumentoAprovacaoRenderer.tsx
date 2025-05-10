
import React from 'react';
import { SolicitacaoColeta } from '../types/coleta.types';
import DocumentInfo from '@/components/common/print/DocumentInfo';

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
    <div className="space-y-6 p-6">
      <DocumentInfo 
        documentType="Solicitação de Coleta"
        documentId={documento.id}
        status={documento.status}
      />
      
      <h3 className="text-2xl font-bold text-center border-b pb-2">Detalhes da Solicitação</h3>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Cliente</p>
          <p className="font-semibold">{documento.cliente}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Solicitante</p>
          <p className="font-semibold">{documento.solicitante}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Data Solicitação</p>
          <p>{documento.data}</p>
        </div>
        {'dataAprovacao' in documento && (
          <div>
            <p className="text-sm font-medium text-gray-500">Data Aprovação/Recusa</p>
            <p>{documento.dataAprovacao}</p>
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-500">Status</p>
          <p className={documento.status === 'approved' ? 'text-green-600 font-semibold' : 
                         documento.status === 'rejected' ? 'text-red-600 font-semibold' : 
                         'text-blue-600 font-semibold'}>
            {documento.status === 'approved' ? 'Aprovado' : 
             documento.status === 'rejected' ? 'Recusado' : 'Pendente'}
          </p>
        </div>
        {'aprovador' in documento && (
          <div>
            <p className="text-sm font-medium text-gray-500">Aprovador/Rejeitante</p>
            <p className="font-semibold">{documento.aprovador}</p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Origem</p>
          <p>{documento.origem}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Destino</p>
          <p>{documento.destino}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Volumes</p>
          <p>{documento.volumes}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Peso</p>
          <p>{documento.peso}</p>
        </div>
      </div>
      
      <div>
        <p className="text-sm font-medium text-gray-500">Notas Fiscais</p>
        <p>{documento.notas.join(', ')}</p>
      </div>
      
      {'observacoes' in documento && documento.observacoes && (
        <div className="border-t pt-4">
          <p className="text-sm font-medium text-gray-500">Observações</p>
          <p className="italic">{documento.observacoes}</p>
        </div>
      )}
      
      {'motivoRecusa' in documento && (
        <div className="border-t pt-4">
          <p className="text-sm font-medium text-gray-500 text-red-600 font-bold">Motivo da Recusa</p>
          <p className="text-red-600 bg-red-50 p-3 border border-red-200 rounded-md">{documento.motivoRecusa}</p>
        </div>
      )}
      
      <div className="mt-8 border-t pt-4 text-center text-sm text-gray-500">
        <p>Documento gerado em {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default DocumentoAprovacaoRenderer;
