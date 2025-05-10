
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import { SolicitacaoColeta } from '../types/coleta.types';

interface TabelaSolicitacoesProps {
  solicitacoes: SolicitacaoColeta[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  handleRowClick: (row: SolicitacaoColeta) => void;
  itemsPerPage: number;
}

const TabelaSolicitacoes: React.FC<TabelaSolicitacoesProps> = ({ 
  solicitacoes, 
  currentPage, 
  setCurrentPage,
  handleRowClick,
  itemsPerPage
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Todas as Solicitações</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={[
            { header: 'ID', accessor: 'id' },
            { header: 'Cliente', accessor: 'cliente' },
            { 
              header: 'Notas Fiscais', 
              accessor: 'notas', 
              cell: (row) => row.notas.join(', ') 
            },
            { header: 'Volumes', accessor: 'volumes' },
            { header: 'Peso', accessor: 'peso' },
            { header: 'Data', accessor: 'data' },
            { header: 'Origem', accessor: 'origem' },
            { header: 'Destino', accessor: 'destino' },
            { 
              header: 'Status', 
              accessor: 'status',
              cell: (row) => {
                const statusMap: any = {
                  'pending': { type: 'warning', text: 'Pendente' },
                  'approved': { type: 'success', text: 'Aprovado' },
                  'rejected': { type: 'error', text: 'Recusado' },
                };
                const status = statusMap[row.status];
                return <StatusBadge status={status.type} text={status.text} />;
              }
            }
          ]}
          data={solicitacoes}
          pagination={{
            totalPages: Math.ceil(solicitacoes.length / itemsPerPage),
            currentPage: currentPage,
            onPageChange: setCurrentPage
          }}
          onRowClick={handleRowClick}
        />
      </CardContent>
    </Card>
  );
};

export default TabelaSolicitacoes;
