
import React from 'react';
import StatusBadge from '@/components/common/StatusBadge';
import NotasTableActions from './NotasTableActions';
import { NotaFiscal } from '@/types/supabase.types';

interface NotasTableColumnsProps {
  onPrintClick: (notaId: string) => void;
  onGerarEtiquetasClick: (nota: NotaFiscal) => void;
}

export const createNotasTableColumns = ({ onPrintClick, onGerarEtiquetasClick }: NotasTableColumnsProps) => [
  { header: 'Número NF', accessor: 'numero' },
  { header: 'Fornecedor', accessor: 'fornecedor' },
  { header: 'Destinatário', accessor: 'destinatarioRazaoSocial' },
  { header: 'Valor Total', accessor: 'valor' },
  { header: 'Data Emissão', accessor: 'dataEmissao' },
  { 
    header: 'Status', 
    accessor: 'status',
    cell: (row: any) => {
      switch (row.status) {
        case 'processada':
          return <StatusBadge status="success" text="Processada" />;
        case 'pendente':
          return <StatusBadge status="pending" text="Pendente" />;
        case 'rejeitada':
          return <StatusBadge status="error" text="Rejeitada" />;
        default:
          return <StatusBadge status="pending" text={row.status} />;
      }
    }
  },
  {
    header: 'Ações',
    accessor: 'actions',
    cell: (row: any) => (
      <NotasTableActions
        nota={row}
        onPrintClick={onPrintClick}
        onGerarEtiquetasClick={onGerarEtiquetasClick}
      />
    )
  }
];
