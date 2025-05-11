
import React from 'react';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import ActionButtons from './ActionButtons';

interface CargasTableProps {
  cargas: any[];
  pagination: {
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
  };
}

const CargasTable: React.FC<CargasTableProps> = ({ cargas, pagination }) => {
  return (
    <DataTable
      columns={[
        { header: 'ID', accessor: 'id' },
        { header: 'Destino', accessor: 'destino' },
        { header: 'Motorista', accessor: 'motorista' },
        { header: 'Veículo', accessor: 'veiculo' },
        { header: 'Data Previsão', accessor: 'dataPrevisao' },
        { header: 'Volumes', accessor: 'volumes' },
        { header: 'Peso', accessor: 'peso' },
        { 
          header: 'Status', 
          accessor: 'status',
          cell: (row) => {
            const statusMap: any = {
              'transit': { type: 'warning', text: 'Em Trânsito' },
              'loading': { type: 'info', text: 'Em Carregamento' },
              'scheduled': { type: 'default', text: 'Agendada' }
            };
            const status = statusMap[row.status] || { type: 'default', text: 'Em Andamento' };
            return <StatusBadge status={status.type} text={status.text} />;
          }
        },
        { 
          header: 'Ações', 
          accessor: 'actions',
          className: "text-right w-[100px]",
          cell: (row) => <ActionButtons carga={row} />
        }
      ]}
      data={cargas}
      pagination={pagination}
      onRowClick={(row) => console.log('Row clicked:', row)}
    />
  );
};

export default CargasTable;
