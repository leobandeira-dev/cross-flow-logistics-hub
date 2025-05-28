
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Printer, Tag } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import SearchFilter from '@/components/common/SearchFilter';
import { buscarNotasFiscais } from '@/services/notaFiscal/fetchNotaFiscalService';
import { NotaFiscal } from '@/types/supabase.types';
import { useToast } from '@/hooks/use-toast';

// Define filter config directly inside this component instead of importing
const notasFilterConfig = [
  {
    name: "Status",
    options: [
      { label: "Todos", value: "all" },
      { label: "Processada", value: "processada" },
      { label: "Pendente", value: "pendente" },
      { label: "Rejeitada", value: "rejeitada" }
    ]
  }
];

interface ConsultaNotasProps {
  onPrintClick: (notaId: string) => void;
}

const ConsultaNotas: React.FC<ConsultaNotasProps> = ({ onPrintClick }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [notasFiscais, setNotasFiscais] = useState<NotaFiscal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar notas fiscais do Supabase
  useEffect(() => {
    const carregarNotasFiscais = async () => {
      try {
        setIsLoading(true);
        console.log('Carregando notas fiscais do Supabase...');
        
        const filtros: any = {};
        
        // Aplicar filtros de status
        if (activeFilters.Status && activeFilters.Status.length > 0 && !activeFilters.Status.includes('all')) {
          filtros.status = activeFilters.Status[0];
        }
        
        // Aplicar filtro de termo de busca
        if (searchTerm.trim()) {
          filtros.termo = searchTerm.trim();
        }
        
        const notas = await buscarNotasFiscais(filtros);
        console.log('Notas fiscais carregadas:', notas);
        setNotasFiscais(notas);
      } catch (error) {
        console.error('Erro ao carregar notas fiscais:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar notas fiscais. Tente novamente.",
          variant: "destructive"
        });
        setNotasFiscais([]);
      } finally {
        setIsLoading(false);
      }
    };

    carregarNotasFiscais();
  }, [searchTerm, activeFilters, toast]);

  const handleSearch = (value: string, filters?: Record<string, string[]>) => {
    setSearchTerm(value);
    if (filters) {
      setActiveFilters(filters);
    }
  };

  const handleGerarEtiquetasClick = (nota: NotaFiscal) => {
    console.log("Nota sendo passada para geração de etiquetas:", nota);
    
    // Calculate or extract volumesTotal based on available information
    let volumesTotal = '';
    
    if (nota.quantidade_volumes) {
      volumesTotal = String(nota.quantidade_volumes);
    }
    
    console.log("Volume total extracted for etiquetas:", volumesTotal);
    
    // Navigate to GeracaoEtiquetas with complete nota data
    navigate('/armazenagem/recebimento/etiquetas', { 
      state: {
        notaFiscal: nota.numero,
        numeroPedido: nota.numero_pedido || '',
        volumesTotal: volumesTotal,
        // Sender data
        remetente: nota.emitente_razao_social || '',
        emitente: nota.emitente_razao_social || '',
        // Recipient data - ensure all required fields are included
        destinatario: nota.destinatario_razao_social || '',
        endereco: nota.destinatario_endereco || '',
        cidade: nota.destinatario_cidade || '',
        cidadeCompleta: `${nota.destinatario_cidade || ''} - ${nota.destinatario_uf || ''}`,
        uf: nota.destinatario_uf || '',
        // Weight information
        pesoTotal: nota.peso_bruto ? `${nota.peso_bruto} Kg` : '',
        chaveNF: nota.chave_acesso || '',
        // Additional recipient address details
        enderecoDestinatario: nota.destinatario_endereco || '',
        bairroDestinatario: nota.destinatario_bairro || '',
        cidadeDestinatario: nota.destinatario_cidade || '',
        cepDestinatario: nota.destinatario_cep || '',
        ufDestinatario: nota.destinatario_uf || '',
        // Date information
        dataEmissao: nota.data_emissao || '',
      }
    });
  };

  // Converter NotaFiscal para o formato esperado pela tabela
  const formatarNotasParaTabela = (notas: NotaFiscal[]) => {
    return notas.map(nota => ({
      id: nota.id,
      numero: nota.numero,
      fornecedor: nota.emitente_razao_social || 'N/A',
      destinatarioRazaoSocial: nota.destinatario_razao_social || 'N/A',
      valor: nota.valor_total ? `R$ ${nota.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00',
      dataEmissao: nota.data_emissao ? new Date(nota.data_emissao).toLocaleDateString('pt-BR') : 'N/A',
      status: nota.status,
      // Dados originais para etiquetas
      ...nota
    }));
  };

  const notasFormatadas = formatarNotasParaTabela(notasFiscais);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Consulta de Notas Fiscais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cross-blue mx-auto mb-4"></div>
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
          placeholder="Buscar por número, chave de acesso ou razão social..." 
          filters={notasFilterConfig} 
          onSearch={handleSearch}
        />
        
        <div className="rounded-md border">
          <DataTable
            columns={[
              { header: 'Número NF', accessor: 'numero' },
              { header: 'Fornecedor', accessor: 'fornecedor' },
              { header: 'Destinatário', accessor: 'destinatarioRazaoSocial' },
              { header: 'Valor Total', accessor: 'valor' },
              { header: 'Data Emissão', accessor: 'dataEmissao' },
              { 
                header: 'Status', 
                accessor: 'status',
                cell: (row) => {
                  switch (row.status) {
                    case 'processada':
                      return <StatusBadge status="success" text="Processada" />;
                    case 'pendente':
                      return <StatusBadge status="pending" text="Pendente" />;
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
            data={notasFormatadas}
          />
        </div>
        
        {notasFormatadas.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhuma nota fiscal encontrada.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConsultaNotas;
