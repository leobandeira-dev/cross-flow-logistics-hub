
import React from 'react';
import DataTable from '@/components/common/DataTable';
import { formatDate } from '@/pages/armazenagem/utils/formatters';
import { SolicitacaoColeta } from '../types/coleta.types';
import { Badge } from '@/components/ui/badge';

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
  
  // Pagination calculation
  const totalPages = Math.ceil(solicitacoes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = solicitacoes.slice(startIndex, startIndex + itemsPerPage);
  
  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      className: 'w-20'
    },
    {
      header: 'Data',
      accessor: 'dataSolicitacao',
      cell: (row: SolicitacaoColeta) => formatDate(row.dataSolicitacao)
    },
    {
      header: 'Remetente',
      accessor: 'remetente',
      cell: (row: SolicitacaoColeta) => row.remetente?.razaoSocial || 'Não informado'
    },
    {
      header: 'Destinatário',
      accessor: 'destinatario',
      cell: (row: SolicitacaoColeta) => row.destinatario?.razaoSocial || 'Não informado'
    },
    {
      header: 'Notas Fiscais',
      accessor: 'notasFiscais',
      cell: (row: SolicitacaoColeta) => {
        if (!row.notasFiscais || row.notasFiscais.length === 0) return '-';
        
        if (row.notasFiscais.length === 1) {
          const nf = row.notasFiscais[0];
          return `${nf.numeroNF}${nf.valorTotal ? ` (R$ ${nf.valorTotal.toFixed(2)})` : ''}`;
        }
        
        return `${row.notasFiscais.length} NFs (R$ ${row.notasFiscais.reduce((acc, nf) => acc + (nf.valorTotal || 0), 0).toFixed(2)})`;
      }
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row: SolicitacaoColeta) => {
        const variant = row.status === 'pending' ? 'outline' : (row.status === 'approved' ? 'success' : 'destructive');
        const label = row.status === 'pending' ? 'Pendente' : (row.status === 'approved' ? 'Aprovada' : 'Recusada');
        
        return <Badge variant={variant as any}>{label}</Badge>;
      }
    }
  ];
  
  return (
    <DataTable 
      columns={columns} 
      data={paginatedData} 
      onRowClick={handleRowClick}
      pagination={{
        totalPages,
        currentPage,
        onPageChange: setCurrentPage
      }}
    />
  );
};

export default TabelaSolicitacoes;
