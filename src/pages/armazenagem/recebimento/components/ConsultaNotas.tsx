
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import SearchFilter from '@/components/common/SearchFilter';

// Mock data
const notasFiscais = [
  { id: 'NF-2023-001', numero: '12345', fornecedor: 'Fornecedor A', data: '10/05/2023', valor: 'R$ 1.250,00', status: 'pending' },
  { id: 'NF-2023-002', numero: '12346', fornecedor: 'Fornecedor B', data: '09/05/2023', valor: 'R$ 2.150,00', status: 'processing' },
  { id: 'NF-2023-003', numero: '12347', fornecedor: 'Fornecedor C', data: '08/05/2023', valor: 'R$ 3.450,00', status: 'completed' },
];

interface ConsultaNotasProps {
  onPrintClick: (notaId: string) => void;
}

const ConsultaNotas: React.FC<ConsultaNotasProps> = ({ onPrintClick }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Notas Fiscais Registradas</CardTitle>
      </CardHeader>
      <CardContent>
        <SearchFilter 
          placeholder="Buscar por número ou fornecedor..." 
          filters={[
            {
              name: "Status",
              options: [
                { label: "Pendente", value: "pending" },
                { label: "Em Processamento", value: "processing" },
                { label: "Concluída", value: "completed" }
              ]
            },
            {
              name: "Período",
              options: [
                { label: "Hoje", value: "today" },
                { label: "Esta semana", value: "thisWeek" },
                { label: "Este mês", value: "thisMonth" }
              ]
            }
          ]}
        />
        
        <DataTable
          columns={[
            { header: 'ID', accessor: 'id' },
            { header: 'Número NF', accessor: 'numero' },
            { header: 'Fornecedor', accessor: 'fornecedor' },
            { header: 'Data', accessor: 'data' },
            { header: 'Valor', accessor: 'valor' },
            { 
              header: 'Status', 
              accessor: 'status',
              cell: (row) => {
                const statusMap: any = {
                  'pending': { type: 'warning', text: 'Pendente' },
                  'processing': { type: 'info', text: 'Em Processamento' },
                  'completed': { type: 'success', text: 'Concluída' },
                };
                const status = statusMap[row.status];
                return <StatusBadge status={status.type} text={status.text} />;
              }
            },
            {
              header: 'Ações',
              accessor: 'actions',
              cell: (row) => (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Detalhes</Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onPrintClick(row.id)}
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                </div>
              )
            }
          ]}
          data={notasFiscais}
        />
      </CardContent>
    </Card>
  );
};

export default ConsultaNotas;
