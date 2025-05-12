
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Printer, Biohazard, LinkIcon } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import SearchFilter from '@/components/common/SearchFilter';

interface Volume {
  id: string;
  notaFiscal: string;
  descricao: string;
  quantidade: number;
  etiquetado: boolean;
  tipoVolume?: 'geral' | 'quimico';
  etiquetaMae?: string;
  [key: string]: any;
}

interface ConsultaEtiquetasTabProps {
  volumes: Volume[];
  handleReimprimirEtiquetas: (volume: Volume) => void;
}

const ConsultaEtiquetasTab: React.FC<ConsultaEtiquetasTabProps> = ({
  volumes,
  handleReimprimirEtiquetas
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Etiquetas Geradas</CardTitle>
      </CardHeader>
      <CardContent>
        <SearchFilter 
          placeholder="Buscar por ID, nota fiscal, descrição ou etiqueta mãe..." 
          filters={[
            {
              name: "Status",
              options: [
                { label: "Etiquetado", value: "true" },
                { label: "Pendente", value: "false" }
              ]
            },
            {
              name: "Tipo",
              options: [
                { label: "Carga Geral", value: "geral" },
                { label: "Produto Químico", value: "quimico" }
              ]
            },
            {
              name: "Etiqueta Mãe",
              options: [
                { label: "Com Etiqueta Mãe", value: "comEtiquetaMae" },
                { label: "Sem Etiqueta Mãe", value: "semEtiquetaMae" }
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
            { header: 'Nota Fiscal', accessor: 'notaFiscal' },
            { header: 'Descrição', accessor: 'descricao' },
            { 
              header: 'Tipo', 
              accessor: 'tipoVolume',
              cell: (row) => {
                return row.tipoVolume === 'quimico' ? 
                  <div className="flex items-center">
                    <Biohazard size={16} className="text-red-500 mr-1" />
                    <span>Químico</span>
                  </div> : 
                  <span>Carga Geral</span>;
              }
            },
            { header: 'Quantidade', accessor: 'quantidade' },
            { 
              header: 'Etiqueta Mãe', 
              accessor: 'etiquetaMae',
              cell: (row) => {
                if (!row.etiquetaMae) return <span className="text-gray-400">-</span>;
                return (
                  <div className="flex items-center">
                    <LinkIcon size={14} className="mr-1 text-blue-500" />
                    <span>{row.etiquetaMae}</span>
                  </div>
                );
              }
            },
            { 
              header: 'Status', 
              accessor: 'etiquetado',
              cell: (row) => {
                return row.etiquetado ? 
                  <StatusBadge status="success" text="Etiquetado" /> : 
                  <StatusBadge status="warning" text="Pendente" />;
              }
            },
            {
              header: 'Ações',
              accessor: 'actions',
              cell: (row) => (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText size={16} className="mr-1" />
                    Detalhes
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleReimprimirEtiquetas(row)}
                  >
                    <Printer size={16} className="mr-1" />
                    Reimprimir
                  </Button>
                </div>
              )
            }
          ]}
          data={volumes}
        />
      </CardContent>
    </Card>
  );
};

export default ConsultaEtiquetasTab;
