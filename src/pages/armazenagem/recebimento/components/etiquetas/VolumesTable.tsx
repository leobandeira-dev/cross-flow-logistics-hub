
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Biohazard, Printer } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';

interface Volume {
  id: string;
  notaFiscal: string;
  descricao: string;
  quantidade: number;
  etiquetado: boolean;
  tipoVolume?: 'geral' | 'quimico';
  [key: string]: any;
}

interface VolumesTableProps {
  volumes: Volume[];
  notaFiscalFilter?: string;
  handlePrintEtiquetas: (volume: Volume) => void;
}

const VolumesTable: React.FC<VolumesTableProps> = ({
  volumes,
  notaFiscalFilter,
  handlePrintEtiquetas
}) => {
  // Filter volumes based on the nota fiscal if provided
  const filteredVolumes = notaFiscalFilter
    ? volumes.filter(vol => vol.notaFiscal === notaFiscalFilter)
    : volumes;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Volumes para Etiquetar</CardTitle>
      </CardHeader>
      <CardContent>
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={row.etiquetado}
                    onClick={() => handlePrintEtiquetas(row)}
                    className={`${!row.etiquetado ? 'bg-cross-blue text-white hover:bg-cross-blue/90' : ''}`}
                  >
                    <Printer size={16} className="mr-1" />
                    Imprimir
                  </Button>
                </div>
              )
            }
          ]}
          data={filteredVolumes}
        />
      </CardContent>
    </Card>
  );
};

export default VolumesTable;
