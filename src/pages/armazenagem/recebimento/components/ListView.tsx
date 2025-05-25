
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { NotaFiscal } from '@/types/supabase/fiscal.types';

interface ListViewProps {
  data: NotaFiscal[];
  onStatusUpdate: (notaId: string, newStatus: string) => void;
  onPriorityUpdate: (notaId: string, newPriority: string) => void;
}

const ListView: React.FC<ListViewProps> = ({ 
  data, 
  onStatusUpdate, 
  onPriorityUpdate 
}) => {
  return (
    <DataTable
      columns={[
        { header: 'NF', accessor: 'numero' },
        { 
          header: 'Emitente', 
          accessor: 'remetente',
          cell: (row) => row.remetente?.razao_social || '-'
        },
        { 
          header: 'Destinatário', 
          accessor: 'destinatario',
          cell: (row) => row.destinatario?.razao_social || '-'
        },
        { 
          header: 'Data Emissão', 
          accessor: 'data_emissao',
          cell: (row) => row.data_emissao ? new Date(row.data_emissao).toLocaleDateString('pt-BR') : '-'
        },
        { 
          header: 'Valor', 
          accessor: 'valor_total',
          cell: (row) => `R$ ${row.valor_total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
        },
        { 
          header: 'Status', 
          accessor: 'status',
          cell: (row) => <StatusBadge status={row.status} />
        },
        { 
          header: 'Prioridade', 
          accessor: 'prioridade',
          cell: (row) => <PriorityBadge priority="normal" />
        },
        {
          header: 'Ações',
          accessor: 'acoes',
          cell: (row) => (
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4" />
              </Button>
              <Select 
                onValueChange={(value) => onStatusUpdate(row.id, value)}
                defaultValue={row.status}
              >
                <SelectTrigger className="h-8 w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coleta_agendada">Coleta agendada</SelectItem>
                  <SelectItem value="coletando">Coletando</SelectItem>
                  <SelectItem value="coletado">Coletado</SelectItem>
                  <SelectItem value="no_armazem">No armazém</SelectItem>
                  <SelectItem value="em_transferencia">Em transferência</SelectItem>
                  <SelectItem value="em_rota_entrega">Em rota de entrega</SelectItem>
                  <SelectItem value="entregue">Entregue</SelectItem>
                  <SelectItem value="extraviada">Extraviada</SelectItem>
                  <SelectItem value="avariada">Avariada</SelectItem>
                  <SelectItem value="sinistrada">Sinistrada</SelectItem>
                  <SelectItem value="indenizada">Indenizada</SelectItem>
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) => onPriorityUpdate(row.id, value)}
                defaultValue="normal"
              >
                <SelectTrigger className="h-8 w-[130px]">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="prioridade">Prioridade</SelectItem>
                  <SelectItem value="expressa">Expressa</SelectItem>
                  <SelectItem value="bloqueada">Bloqueada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )
        }
      ]}
      data={data}
    />
  );
};

export default ListView;
