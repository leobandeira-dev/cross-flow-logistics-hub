
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import SearchFilter from '@/components/common/SearchFilter';
import { notasFiscais } from '../data/mockData';
import { generateDANFEFromXML, createPDFDataUrl } from '../utils/danfeAPI';
import { toast } from '@/hooks/use-toast';

interface ConsultaNotasProps {
  onPrintClick: (notaId: string) => void;
}

const ConsultaNotas: React.FC<ConsultaNotasProps> = ({ onPrintClick }) => {
  const [loadingDanfe, setLoadingDanfe] = useState<string | null>(null);

  const handleDirectPrintDANFE = async (notaId: string) => {
    // Find the nota with XML content
    const nota = notasFiscais.find(nota => nota.id === notaId);
    
    if (!nota || !nota.xmlContent) {
      // If no XML content, use the regular print dialog
      onPrintClick(notaId);
      return;
    }
    
    try {
      setLoadingDanfe(notaId);
      toast({
        title: "Gerando DANFE",
        description: "Aguarde enquanto o DANFE está sendo gerado...",
      });
      
      // Generate DANFE directly from stored XML content
      const pdfBase64 = await generateDANFEFromXML(nota.xmlContent);
      
      if (pdfBase64) {
        // Open PDF in new window
        const dataUrl = createPDFDataUrl(pdfBase64);
        window.open(dataUrl, '_blank');
        
        toast({
          title: "DANFE gerado",
          description: "O DANFE foi aberto em uma nova janela.",
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível gerar o DANFE.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro ao gerar DANFE:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao gerar o DANFE. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoadingDanfe(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Notas Fiscais Registradas</CardTitle>
      </CardHeader>
      <CardContent>
        <SearchFilter 
          placeholder="Buscar por número ou fornecedor..." 
          filters={[
            {
              name: "Status",
              options: [
                { label: "Pendente", value: "pending" },
                { label: "Em Processamento", value: "processing" },
                { label: "Concluída", value: "completed" }
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
            { header: 'Número NF', accessor: 'numero' },
            { header: 'Fornecedor', accessor: 'fornecedor' },
            { header: 'Data', accessor: 'data' },
            { header: 'Valor', accessor: 'valor', 
              cell: (row) => `R$ ${parseFloat(row.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
            },
            { 
              header: 'Status', 
              accessor: 'status',
              cell: (row) => {
                const statusMap: any = {
                  'pending': { type: 'warning', text: 'Pendente' },
                  'processing': { type: 'info', text: 'Em Processamento' },
                  'completed': { type: 'success', text: 'Concluída' },
                };
                const status = statusMap[row.status];
                return <StatusBadge status={status.type} text={status.text} />;
              }
            },
            {
              header: 'Ações',
              accessor: 'actions',
              cell: (row) => (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Detalhes</Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDirectPrintDANFE(row.id)}
                    disabled={loadingDanfe === row.id}
                    title="Imprimir DANFE"
                  >
                    {loadingDanfe === row.id ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Gerando
                      </span>
                    ) : (
                      <Printer className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )
            }
          ]}
          data={notasFiscais}
        />
      </CardContent>
    </Card>
  );
};

export default ConsultaNotas;
