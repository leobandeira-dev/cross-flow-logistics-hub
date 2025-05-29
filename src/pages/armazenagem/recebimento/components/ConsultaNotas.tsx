
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Printer, Tag, Trash2 } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import SearchFilter from '@/components/common/SearchFilter';
import { useNotasFiscaisData } from '../hooks/useNotasFiscaisData';
import { format } from 'date-fns';

// Define filter config
const notasFilterConfig = [
  {
    name: "Status",
    options: [
      { label: "Todos", value: "all" },
      { label: "Pendente", value: "pendente" },
      { label: "Em Processamento", value: "em_processamento" },
      { label: "Conferida", value: "conferida" },
      { label: "Divergente", value: "divergente" },
      { label: "Finalizada", value: "finalizada" }
    ]
  },
  {
    name: "Fornecedor",
    options: [
      { label: "Todos", value: "all" }
    ]
  }
];

interface ConsultaNotasProps {
  onPrintClick: (notaId: string) => void;
}

const ConsultaNotas: React.FC<ConsultaNotasProps> = ({ onPrintClick }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  
  const {
    notasFiscais,
    isLoading,
    error,
    aplicarFiltros,
    deleteNota,
    isDeleting
  } = useNotasFiscaisData();

  // Filter the notes based on search term and filters
  const filteredNotas = notasFiscais.filter(nota => {
    // Apply search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        nota.numero.toLowerCase().includes(searchLower) ||
        (nota.emitente_razao_social?.toLowerCase().includes(searchLower)) ||
        (nota.destinatario_razao_social?.toLowerCase().includes(searchLower)) ||
        (nota.chave_acesso?.toLowerCase().includes(searchLower));
      
      if (!matchesSearch) return false;
    }
    
    // Apply status filter
    if (activeFilters.Status && activeFilters.Status.length > 0 && !activeFilters.Status.includes('all')) {
      if (!activeFilters.Status.includes(nota.status)) {
        return false;
      }
    }
    
    return true;
  });

  const handleSearch = (value: string, filters?: Record<string, string[]>) => {
    setSearchTerm(value);
    if (filters) {
      setActiveFilters(filters);
      
      // Apply filters to the data hook
      const filtrosData = {
        status: filters.Status && !filters.Status.includes('all') ? filters.Status[0] : undefined,
        termo: value || undefined
      };
      aplicarFiltros(filtrosData);
    }
  };

  const handleGerarEtiquetasClick = (nota: any) => {
    console.log("Nota sendo passada para geração de etiquetas:", nota);
    
    navigate('/armazenagem/recebimento/etiquetas', { 
      state: {
        notaFiscal: nota.numero,
        numeroPedido: nota.numero_pedido || '',
        volumesTotal: nota.quantidade_volumes?.toString() || '1',
        remetente: nota.emitente_razao_social || '',
        emitente: nota.emitente_razao_social || '',
        destinatario: nota.destinatario_razao_social || '',
        endereco: nota.destinatario_endereco || '',
        cidade: nota.destinatario_cidade || '',
        cidadeCompleta: `${nota.destinatario_cidade || ''} - ${nota.destinatario_uf || ''}`,
        uf: nota.destinatario_uf || '',
        pesoTotal: nota.peso_bruto?.toString() || '',
        chaveNF: nota.chave_acesso || '',
        enderecoDestinatario: nota.destinatario_endereco || '',
        bairroDestinatario: nota.destinatario_bairro || '',
        cidadeDestinatario: nota.destinatario_cidade || '',
        cepDestinatario: nota.destinatario_cep || '',
        ufDestinatario: nota.destinatario_uf || '',
        dataEmissao: nota.data_emissao || '',
      }
    });
  };

  const handleDeleteNota = async (notaId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta nota fiscal?')) {
      deleteNota(notaId);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'finalizada':
      case 'conferida':
        return <StatusBadge status="success" text="Processada" />;
      case 'pendente':
        return <StatusBadge status="pending" text="Aguardando" />;
      case 'divergente':
        return <StatusBadge status="error" text="Divergente" />;
      case 'em_processamento':
        return <StatusBadge status="warning" text="Em Processamento" />;
      default:
        return <StatusBadge status="pending" text={status} />;
    }
  };

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Erro ao Carregar Notas Fiscais</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Consulta de Notas Fiscais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p>Carregando notas fiscais...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consulta de Notas Fiscais</CardTitle>
      </CardHeader>
      <CardContent>
        <SearchFilter 
          placeholder="Buscar por número, fornecedor ou destinatário..." 
          filters={notasFilterConfig} 
          onSearch={handleSearch}
        />
        
        <div className="rounded-md border">
          <DataTable
            columns={[
              { header: 'Número NF', accessor: 'numero' },
              { 
                header: 'Emitente', 
                accessor: 'emitente_razao_social',
                cell: (row) => row.emitente_razao_social || '-'
              },
              { 
                header: 'Destinatário', 
                accessor: 'destinatario_razao_social',
                cell: (row) => row.destinatario_razao_social || '-'
              },
              { 
                header: 'Valor Total', 
                accessor: 'valor_total',
                cell: (row) => `R$ ${row.valor_total?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}`
              },
              { 
                header: 'Data Emissão', 
                accessor: 'data_emissao',
                cell: (row) => {
                  try {
                    return format(new Date(row.data_emissao), 'dd/MM/yyyy');
                  } catch {
                    return '-';
                  }
                }
              },
              { 
                header: 'Status', 
                accessor: 'status',
                cell: (row) => getStatusBadge(row.status)
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
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteNota(row.id)}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Excluir
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
