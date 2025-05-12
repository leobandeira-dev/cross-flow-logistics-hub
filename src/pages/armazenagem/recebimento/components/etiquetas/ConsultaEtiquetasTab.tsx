
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Printer } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import SearchFilter from '@/components/common/SearchFilter';
import { Volume } from './VolumesTable';

interface ConsultaEtiquetasTabProps {
  volumes: Volume[];
  handleReimprimirEtiquetas: (etiqueta: Volume) => void;
}

const ConsultaEtiquetasTab: React.FC<ConsultaEtiquetasTabProps> = ({
  volumes,
  handleReimprimirEtiquetas
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  // Filter volumes based on search and filters
  const filteredVolumes = volumes.filter(volume => {
    // Apply search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        volume.id.toLowerCase().includes(searchLower) ||
        volume.notaFiscal.toLowerCase().includes(searchLower) ||
        volume.descricao.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }
    
    // Apply status filter
    if (activeFilters.Status && activeFilters.Status.length > 0) {
      const status = volume.etiquetado ? 'etiquetado' : 'pendente';
      if (!activeFilters.Status.includes(status)) {
        return false;
      }
    }
    
    // Apply tipo filter
    if (activeFilters.Tipo && activeFilters.Tipo.length > 0) {
      const tipo = volume.tipoVolume || 'geral';
      if (!activeFilters.Tipo.includes(tipo)) {
        return false;
      }
    }
    
    return true;
  });

  const handleSearch = (value: string, filters?: Record<string, string[]>) => {
    setSearchTerm(value);
    if (filters) {
      setActiveFilters(filters);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consulta de Etiquetas</CardTitle>
      </CardHeader>
      <CardContent>
        <SearchFilter 
          placeholder="Buscar por ID, nota fiscal..." 
          filters={[
            {
              name: "Status",
              options: [
                { label: "Todos", value: "all" },
                { label: "Etiquetado", value: "etiquetado" },
                { label: "Pendente", value: "pendente" }
              ]
            },
            {
              name: "Tipo",
              options: [
                { label: "Todos", value: "all" },
                { label: "Carga Geral", value: "geral" },
                { label: "Químico", value: "quimico" }
              ]
            }
          ]}
          onSearch={handleSearch}
        />
        
        <div className="rounded-md border mt-4">
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
                      <span className="text-red-500 mr-1">●</span>
                      <span>Químico</span>
                    </div> : 
                    <span>Carga Geral</span>;
                }
              },
              { 
                header: 'Etiqueta Mãe', 
                accessor: 'etiquetaMae',
                cell: (row) => row.etiquetaMae || '-'
              },
              { 
                header: 'Status', 
                accessor: 'etiquetado',
                cell: (row) => row.etiquetado ? 'Etiquetado' : 'Pendente'
              },
              {
                header: 'Ações',
                accessor: 'actions',
                cell: (row) => (
                  <div className="flex space-x-2">
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleReimprimirEtiquetas(row)}
                    >
                      <Printer className="h-4 w-4 mr-1" />
                      Reimprimir
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Detalhes
                    </Button>
                  </div>
                )
              }
            ]}
            data={filteredVolumes}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsultaEtiquetasTab;
