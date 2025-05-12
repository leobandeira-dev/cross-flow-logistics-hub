
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, FileText, Download, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataTable from '@/components/common/DataTable';
import StatusBadge from '@/components/common/StatusBadge';
import SearchFilter from '@/components/common/SearchFilter';
import { notasFiscais } from '../data/mockData';
import { generateDANFEFromXML, createPDFDataUrl } from '../utils/danfeAPI';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ConsultaNotasProps {
  onPrintClick: (notaId: string) => void;
}

const ConsultaNotas: React.FC<ConsultaNotasProps> = ({ onPrintClick }) => {
  const navigate = useNavigate();
  const [loadingDanfe, setLoadingDanfe] = useState<string | null>(null);
  const [loadingXml, setLoadingXml] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedNota, setSelectedNota] = useState<any>(null);

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

  const handleDownloadXML = (notaId: string) => {
    const nota = notasFiscais.find(nota => nota.id === notaId);
    
    if (!nota || !nota.xmlContent) {
      toast({
        title: "Erro",
        description: "XML não disponível para esta nota fiscal.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoadingXml(notaId);
      
      // Create a Blob with the XML content
      const blob = new Blob([nota.xmlContent], { type: 'application/xml' });
      
      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary anchor element
      const a = document.createElement('a');
      a.href = url;
      a.download = `NF-${nota.numero}-${nota.fornecedor.replace(/\s+/g, '_')}.xml`;
      
      // Append to the document, click it, and then remove it
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Revoke the URL to free up memory
      URL.revokeObjectURL(url);
      
      toast({
        title: "XML baixado",
        description: "O arquivo XML foi baixado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao baixar XML:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao baixar o XML. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoadingXml(null);
    }
  };

  const handleShowDetails = (nota: any) => {
    setSelectedNota(nota);
    setDetailsOpen(true);
  };

  const handleGenerateLabels = (nota: any) => {
    // Navigate to the labels generation page with the nota fiscal data
    navigate(`/armazenagem/recebimento/etiquetas`, {
      state: {
        notaFiscal: nota.numero,
        notaFiscalId: nota.id,
        fornecedor: nota.fornecedor
      }
    });
  };

  return (
    <>
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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleShowDetails(row)}
                      title="Visualizar detalhes"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Detalhes
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleGenerateLabels(row)}
                      title="Gerar etiquetas de volume"
                    >
                      <Tag className="h-4 w-4 mr-1" />
                      Etiquetas
                    </Button>
                    <div className="flex">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDirectPrintDANFE(row.id)}
                        disabled={loadingDanfe === row.id}
                        title="Imprimir DANFE"
                        className="rounded-r-none border-r-0"
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadXML(row.id)}
                        disabled={loadingXml === row.id}
                        title="Baixar XML"
                        className="rounded-l-none"
                      >
                        {loadingXml === row.id ? (
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )
              }
            ]}
            data={notasFiscais}
          />
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Nota Fiscal</DialogTitle>
          </DialogHeader>
          {selectedNota && (
            <div className="max-h-[70vh] overflow-y-auto mt-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-medium">Informações Gerais</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Número NF</TableCell>
                        <TableCell>{selectedNota.numero}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Chave de Acesso</TableCell>
                        <TableCell>{selectedNota.chaveAcesso || 'N/A'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Data de Emissão</TableCell>
                        <TableCell>{selectedNota.data}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Valor Total</TableCell>
                        <TableCell>R$ {parseFloat(selectedNota.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Status</TableCell>
                        <TableCell>
                          {(() => {
                            const statusMap: any = {
                              'pending': { type: 'warning', text: 'Pendente' },
                              'processing': { type: 'info', text: 'Em Processamento' },
                              'completed': { type: 'success', text: 'Concluída' },
                            };
                            const status = statusMap[selectedNota.status];
                            return <StatusBadge status={status.type} text={status.text} />;
                          })()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium">Emitente / Fornecedor</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Fornecedor</TableCell>
                        <TableCell>{selectedNota.fornecedor}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">CNPJ</TableCell>
                        <TableCell>{selectedNota.cnpjFornecedor || 'N/A'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Telefone</TableCell>
                        <TableCell>{selectedNota.telefoneFornecedor || 'N/A'}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              {selectedNota.itens && selectedNota.itens.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Produtos / Itens</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Qtd.</TableHead>
                        <TableHead>Valor Unit.</TableHead>
                        <TableHead>Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedNota.itens.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{item.codigo || `#${index + 1}`}</TableCell>
                          <TableCell>{item.descricao}</TableCell>
                          <TableCell>{item.quantidade}</TableCell>
                          <TableCell>
                            R$ {parseFloat(item.valorUnitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell>
                            R$ {parseFloat(item.subtotal || (item.quantidade * item.valorUnitario).toString()).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedNota.observacoes && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Observações</h3>
                    <p className="text-sm text-gray-600 border p-3 rounded-md bg-gray-50">
                      {selectedNota.observacoes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConsultaNotas;
