
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Printer, Biohazard, LinkIcon, AlertTriangle } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import SearchFilter from '@/components/common/SearchFilter';
import { toast } from '@/hooks/use-toast';
import { Volume } from './VolumesTable';

interface ConsultaEtiquetasTabProps {
  volumes: Volume[];
  handleReimprimirEtiquetas: (volume: Volume) => void;
}

const ConsultaEtiquetasTab: React.FC<ConsultaEtiquetasTabProps> = ({
  volumes,
  handleReimprimirEtiquetas
}) => {
  const [filteredVolumes, setFilteredVolumes] = useState<Volume[]>(volumes);
  
  const handleSearch = (searchTerm: string, activeFilters?: Record<string, string[]>) => {
    if (!searchTerm && (!activeFilters || Object.keys(activeFilters).length === 0)) {
      setFilteredVolumes(volumes);
      return;
    }
    
    let filtered = volumes.filter(volume => {
      // Apply text search
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          volume.id.toLowerCase().includes(searchLower) ||
          volume.notaFiscal.toLowerCase().includes(searchLower) ||
          volume.descricao.toLowerCase().includes(searchLower) ||
          (volume.etiquetaMae?.toLowerCase().includes(searchLower) || false) ||
          (volume.chaveNF?.toLowerCase().includes(searchLower) || false);
        
        if (!matchesSearch) return false;
      }
      
      // Apply filters if any
      if (activeFilters && Object.keys(activeFilters).length > 0) {
        // Status filter
        if (activeFilters.Status && activeFilters.Status.length > 0) {
          const statusMatch = activeFilters.Status.some(status => {
            if (status === 'true') return volume.etiquetado === true;
            if (status === 'false') return volume.etiquetado === false;
            return false;
          });
          if (!statusMatch) return false;
        }
        
        // Type filter
        if (activeFilters.Tipo && activeFilters.Tipo.length > 0) {
          const typeMatch = activeFilters.Tipo.some(tipo => volume.tipoVolume === tipo);
          if (!typeMatch) return false;
        }
        
        // Etiqueta Mãe filter
        if (activeFilters['Etiqueta Mãe'] && activeFilters['Etiqueta Mãe'].length > 0) {
          const etiquetaMaeMatch = activeFilters['Etiqueta Mãe'].some(option => {
            if (option === 'comEtiquetaMae') return !!volume.etiquetaMae;
            if (option === 'semEtiquetaMae') return !volume.etiquetaMae;
            return false;
          });
          if (!etiquetaMaeMatch) return false;
        }
        
        // Period filter
        if (activeFilters.Período && activeFilters.Período.length > 0) {
          // Implementation for period filtering would go here
          // This is a placeholder for future implementation
        }
      }
      
      return true;
    });
    
    setFilteredVolumes(filtered);
  };

  const handleReimprimirClick = (volume: Volume) => {
    if (volume.etiquetado) {
      toast({
        title: "Aviso",
        description: "Esta etiqueta já foi impressa. Será gerada uma cópia de segurança.",
        variant: "default"
      });
    }
    handleReimprimirEtiquetas(volume);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Etiquetas Geradas</CardTitle>
      </CardHeader>
      <CardContent>
        <SearchFilter 
          placeholder="Buscar por ID, nota fiscal, descrição, etiqueta mãe ou chave NF..." 
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
          onSearch={handleSearch}
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
                  <StatusBadge status="default" text="Pendente" />;
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
                    onClick={() => handleReimprimirClick(row)}
                    className={row.etiquetado ? "border-yellow-500 text-yellow-600 hover:bg-yellow-50" : ""}
                  >
                    {row.etiquetado && <AlertTriangle size={16} className="mr-1 text-yellow-600" />}
                    {!row.etiquetado && <Printer size={16} className="mr-1" />}
                    {row.etiquetado ? "Reimprimir" : "Imprimir"}
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

export default ConsultaEtiquetasTab;
