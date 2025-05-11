
import React from 'react';
import DataTable from '../../../../components/common/DataTable';
import StatusBadge from '../../../../components/common/StatusBadge';
import ActionButtons from './ActionButtons';

interface CargasTableProps {
  cargas: any[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  onAlocarMotorista: (carga: any) => void;
  setSelectedCarga: (carga: any) => void;
}

const CargasTable: React.FC<CargasTableProps> = ({ 
  cargas, 
  currentPage, 
  setCurrentPage,
  onAlocarMotorista,
  setSelectedCarga
}) => {
  return (
    <DataTable
      columns={[
        { header: 'ID', accessor: 'id' },
        { header: 'Destino', accessor: 'destino' },
        { header: 'Data Prevista', accessor: 'dataPrevisao' },
        { header: 'Volumes', accessor: 'volumes' },
        { header: 'Peso', accessor: 'peso' },
        { 
          header: 'Status', 
          accessor: 'status',
          cell: (row) => {
            const statusMap: any = {
              'pending': { type: 'default', text: 'Pendente de Alocação' },
              'scheduled': { type: 'default', text: 'Agendada' },
            };
            const status = statusMap[row.status] || { type: 'default', text: 'Pendente' };
            return <StatusBadge status={status.type} text={status.text} />;
          }
        },
        { 
          header: 'Ações', 
          accessor: 'actions',
          className: "text-right w-[220px]",
          cell: (row) => (
            <ActionButtons 
              carga={row} 
              onAlocar={onAlocarMotorista} 
              setSelectedCarga={setSelectedCarga} 
            />
          )
        }
      ]}
      data={cargas}
      pagination={{
        totalPages: Math.ceil(cargas.length / 10),
        currentPage: currentPage,
        onPageChange: setCurrentPage
      }}
      onRowClick={(row) => console.log('Row clicked:', row)}
    />
  );
};

export default CargasTable;
