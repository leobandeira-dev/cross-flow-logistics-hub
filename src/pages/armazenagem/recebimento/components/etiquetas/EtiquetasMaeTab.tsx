
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Printer } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import SearchFilter from '@/components/common/SearchFilter';

interface EtiquetaMae {
  id: string;
  notaFiscal: string;
  quantidadeVolumes: number;
  remetente: string;
  destinatario: string;
  cidade: string;
  uf: string;
  dataCriacao: string;
  status: string;
}

interface EtiquetasMaeTabProps {
  etiquetasMae: EtiquetaMae[];
  handlePrintEtiquetaMae: (etiquetaMae: EtiquetaMae) => void;
}

const EtiquetasMaeTab: React.FC<EtiquetasMaeTabProps> = ({
  etiquetasMae,
  handlePrintEtiquetaMae
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Etiquetas Mãe</CardTitle>
      </CardHeader>
      <CardContent>
        <SearchFilter 
          placeholder="Buscar por ID, nota fiscal ou remetente..." 
          filters={[
            {
              name: "Status",
              options: [
                { label: "Ativo", value: "ativo" },
                { label: "Inativo", value: "inativo" }
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
            { header: 'Volumes', accessor: 'quantidadeVolumes' },
            { header: 'Remetente', accessor: 'remetente' },
            { header: 'Destinatário', accessor: 'destinatario' },
            { header: 'Cidade/UF', accessor: 'cidade',
              cell: (row) => (
                <div>
                  {row.cidade} - <span className="font-bold">{row.uf}</span>
                </div>
              )
            },
            { header: 'Data Criação', accessor: 'dataCriacao' },
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
                    onClick={() => handlePrintEtiquetaMae(row)}
                  >
                    <Printer size={16} className="mr-1" />
                    Imprimir
                  </Button>
                </div>
              )
            }
          ]}
          data={etiquetasMae}
        />
      </CardContent>
    </Card>
  );
};

export default EtiquetasMaeTab;
