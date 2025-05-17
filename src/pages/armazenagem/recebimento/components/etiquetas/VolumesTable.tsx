import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Biohazard, Printer, Edit, LinkIcon } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';

// Updated Volume interface to include all necessary properties
export interface Volume {
  id: string;
  notaFiscal: string;
  descricao: string;
  quantidade: number;
  etiquetado: boolean;
  remetente?: string;
  destinatario?: string;
  endereco?: string;
  cidade?: string;
  cidadeCompleta?: string;
  uf?: string;
  pesoTotal?: string;
  chaveNF?: string;
  etiquetaMae?: string;
  tipoEtiquetaMae?: 'geral' | 'palete';
  tipoVolume?: 'geral' | 'quimico';
  codigoONU?: string;
  codigoRisco?: string;
  classificacaoQuimica?: 'nao_perigosa' | 'perigosa' | 'nao_classificada';
  transportadora?: string;
}

interface VolumesTableProps {
  volumes: Volume[];
  notaFiscalFilter?: string;
  handlePrintEtiquetas: (volume: Volume) => void;
  handleClassifyVolume?: (volume: Volume) => void;
  showEtiquetaMaeColumn?: boolean;
}

const VolumesTable: React.FC<VolumesTableProps> = ({
  volumes,
  notaFiscalFilter,
  handlePrintEtiquetas,
  handleClassifyVolume,
  showEtiquetaMaeColumn = false
}) => {
  // Filter volumes based on the nota fiscal if provided
  const filteredVolumes = notaFiscalFilter
    ? volumes.filter(vol => vol.notaFiscal === notaFiscalFilter)
    : volumes;

  // Create columns array, conditionally including the etiquetaMae column
  const columns = [
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
  ];
  
  // Add etiquetaMae column if showEtiquetaMaeColumn is true
  if (showEtiquetaMaeColumn) {
    columns.push({ 
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
    });
  }
  
  // Add status column
  columns.push({ 
    header: 'Status', 
    accessor: 'etiquetado',
    cell: (row) => {
      return row.etiquetado ? 
        <StatusBadge status="success" text="Etiquetado" /> : 
        <StatusBadge status="warning" text="Pendente" />;
    }
  });
  
  // Add actions column
  columns.push({
    header: 'Ações',
    accessor: 'actions',
    cell: (row) => (
      <div className="flex gap-2">
        {handleClassifyVolume && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleClassifyVolume(row)}
          >
            <Edit size={16} className="mr-1" />
            Classificar
          </Button>
        )}
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
  });

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-lg">Volumes para Etiquetar</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={filteredVolumes}
        />
      </CardContent>
    </Card>
  );
};

export default VolumesTable;
