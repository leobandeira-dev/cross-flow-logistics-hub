
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Printer, Tag } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import SearchFilter from '@/components/common/SearchFilter';
import { notasFiscais } from '../data/mockData';
import { filterConfig } from '../filterConfig';

interface ConsultaNotasProps {
  onPrintClick: (notaId: string) => void;
}

const ConsultaNotas: React.FC<ConsultaNotasProps> = ({ onPrintClick }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  // Filter the notes based on search term and filters
  const filteredNotas = notasFiscais.filter(nota => {
    // Apply search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        nota.id.toLowerCase().includes(searchLower) ||
        nota.fornecedor.toLowerCase().includes(searchLower) ||
        nota.destinatario.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }
    
    // Apply status filter
    if (activeFilters.Status && activeFilters.Status.length > 0) {
      if (!activeFilters.Status.includes(nota.status)) {
        return false;
      }
    }
    
    // Apply fornecedor filter
    if (activeFilters.Fornecedor && activeFilters.Fornecedor.length > 0) {
      if (!activeFilters.Fornecedor.includes(nota.fornecedor)) {
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

  const handleGerarEtiquetasClick = (nota: any) => {
    // Navigate to GeracaoEtiquetas with complete nota data
    navigate('/armazenagem/recebimento/etiquetas', { 
      state: {
        notaFiscal: nota.id,
        // Pass all the necessary data from the nota fiscal to populate the etiqueta fields
        numeroPedido: nota.numeroPedido || '',
        volumesTotal: nota.volumesTotal || '',
        remetente: nota.fornecedor || '',
        destinatario: nota.destinatario || '',
        endereco: nota.enderecoDestinatario || '',
        cidade: nota.cidadeDestinatario || '',
        cidadeCompleta: `${nota.cidadeDestinatario || ''} - ${nota.ufDestinatario || ''}`,
        uf: nota.ufDestinatario || '',
        pesoTotal: nota.pesoTotal || '',
        chaveNF: nota.chaveNF || '',
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consulta de Notas Fiscais</CardTitle>
      </CardHeader>
      <CardContent>
        <SearchFilter 
          placeholder="Buscar por número, fornecedor ou destinatário..." 
          filters={filterConfig}
          onSearch={handleSearch}
        />
        
        <div className="rounded-md border">
          <DataTable
            columns={[
              { header: 'Número NF', accessor: 'id' },
              { header: 'Fornecedor', accessor: 'fornecedor' },
              { header: 'Destinatário', accessor: 'destinatario' },
              { header: 'Valor Total', accessor: 'valor' },
              { header: 'Data Emissão', accessor: 'dataEmissao' },
              { 
                header: 'Status', 
                accessor: 'status',
                cell: (row) => {
                  switch (row.status) {
                    case 'processada':
                      return <StatusBadge status="success" text="Processada" />;
                    case 'aguardando':
                      return <StatusBadge status="pending" text="Aguardando" />;
                    case 'rejeitada':
                      return <StatusBadge status="error" text="Rejeitada" />;
                    default:
                      return <StatusBadge status="pending" text={row.status} />;
                  }
                }
              },
              {
                header: 'Ações',
                accessor: 'actions',
                cell: (row) => (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onPrintClick(row.id)}
                    >
                      <Printer className="h-4 w-4 mr-1" />
                      DANFE
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Detalhes
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGerarEtiquetasClick(row)}
                    >
                      <Tag className="h-4 w-4 mr-1" />
                      Etiquetas
                    </Button>
                  </div>
                )
              }
            ]}
            data={filteredNotas}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsultaNotas;
