
import React from 'react';
import DataTable from '@/components/common/DataTable';
import { formatDate } from '@/pages/armazenagem/utils/formatters';
import { SolicitacaoColeta } from '../types/coleta.types';
import { Badge } from '@/components/ui/badge';
import { extrairApenasUF } from '@/utils/estadoUtils';

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
  
  // Function to format address to show city and UF only
  const formatarEndereco = (endereco: string): string => {
    if (!endereco) return '';
    
    // Se a string já contém um padrão com UF, como "Cidade - UF"
    const match = endereco.match(/(.+)\s+-\s+([A-Za-z]{2}|[A-Za-z\s]+)$/);
    if (match) {
      const cidade = match[1];
      const uf = extrairApenasUF(match[2]);
      return `${cidade} - ${uf}`;
    }
    
    return endereco;
  };
  
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
      header: 'Origem',
      accessor: 'origem',
      cell: (row: SolicitacaoColeta) => formatarEndereco(row.origem || '')
    },
    {
      header: 'Destino',
      accessor: 'destino',
      cell: (row: SolicitacaoColeta) => formatarEndereco(row.destino || '')
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
