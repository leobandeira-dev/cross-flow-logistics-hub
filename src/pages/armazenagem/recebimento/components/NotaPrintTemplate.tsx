
import React from 'react';

// Mock data
const notasFiscais = [
  { id: 'NF-2023-001', numero: '12345', fornecedor: 'Fornecedor A', data: '10/05/2023', valor: 'R$ 1.250,00', status: 'pending' },
  { id: 'NF-2023-002', numero: '12346', fornecedor: 'Fornecedor B', data: '09/05/2023', valor: 'R$ 2.150,00', status: 'processing' },
  { id: 'NF-2023-003', numero: '12347', fornecedor: 'Fornecedor C', data: '08/05/2023', valor: 'R$ 3.450,00', status: 'completed' },
];

interface NotaPrintTemplateProps {
  notaId: string;
}

const NotaPrintTemplate: React.FC<NotaPrintTemplateProps> = ({ notaId }) => {
  const nota = notasFiscais.find(nota => nota.id === notaId);
  
  return (
    <div className="p-4 bg-white">
      <h2 className="text-xl font-bold mb-4">Nota Fiscal - {notaId}</h2>
      <div className="border p-4">
        <p>Detalhes da Nota Fiscal {notaId}</p>
        <div className="mt-4 space-y-2">
          {notaId && nota && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Número:</p>
                  <p>{nota.numero}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fornecedor:</p>
                  <p>{nota.fornecedor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data:</p>
                  <p>{nota.data}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Valor:</p>
                  <p>{nota.valor}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">Status:</p>
                <p>{nota.status === 'pending' ? 'Pendente' : 
                   nota.status === 'processing' ? 'Em Processamento' : 'Concluída'}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotaPrintTemplate;
