
import React from 'react';
import { Card } from '@/components/ui/card';
import DataTable from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';

const HistoricoLayout: React.FC = () => {
  return (
    <Card>
      <DataTable
        columns={[
          { header: 'OC', accessor: 'id' },
          { header: 'Data', accessor: 'data' },
          { header: 'Veículo', accessor: 'veiculo' },
          { header: 'Volumes', accessor: 'volumes' },
          { header: 'Responsável', accessor: 'responsavel' },
          {
            header: 'Ações',
            accessor: 'actions',
            cell: () => (
              <Button variant="outline" size="sm">
                Ver Detalhes
              </Button>
            )
          }
        ]}
        data={[
          { id: 'OC-2023-001', data: '10/05/2023', veiculo: 'Caminhão Truck', volumes: 25, responsavel: 'João Silva' },
          { id: 'OC-2023-002', data: '11/05/2023', veiculo: 'Van', volumes: 12, responsavel: 'Maria Oliveira' },
          { id: 'OC-2023-003', data: '12/05/2023', veiculo: 'Carreta', volumes: 48, responsavel: 'Carlos Santos' },
        ]}
      />
    </Card>
  );
};

export default HistoricoLayout;
