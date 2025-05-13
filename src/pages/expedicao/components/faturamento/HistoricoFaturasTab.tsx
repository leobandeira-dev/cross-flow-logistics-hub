
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Printer, Search } from 'lucide-react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import DocumentPDFGenerator from '@/components/common/DocumentPDFGenerator';
import FaturaDocumentLayout from './print/FaturaDocumentLayout';
import { NotaFiscal } from '../../Faturamento';
import { useHistoricoFaturas } from '../../hooks/faturamento/useHistoricoFaturas';

const HistoricoFaturasTab: React.FC = () => {
  const { faturas, isLoading, searchFaturas } = useHistoricoFaturas();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchFaturas(searchTerm);
  };

  const renderFaturaDocument = (documentId: string) => {
    const fatura = faturas.find(f => f.id === documentId);
    
    if (!fatura) return <div>Documento não encontrado</div>;
    
    return (
      <FaturaDocumentLayout
        documentId={documentId}
        notas={fatura.notas || []}
        totais={fatura.totais || {
          pesoTotal: 0,
          freteTotal: 0,
          expressoTotal: 0,
          icmsTotal: 0,
          totalViagem: 0
        }}
        cabecalho={fatura.cabecalho || {}}
      />
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Histórico de Faturas
        </h2>
      </div>
      
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input 
          placeholder="Buscar por número, cliente, transportadora..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" variant="outline">
          <Search className="h-4 w-4 mr-2" /> Buscar
        </Button>
      </form>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº Documento</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Transportadora</TableHead>
              <TableHead>Notas</TableHead>
              <TableHead>Valor Total</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">Carregando faturas...</TableCell>
              </TableRow>
            ) : faturas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">Nenhuma fatura encontrada</TableCell>
              </TableRow>
            ) : (
              faturas.map((fatura) => (
                <TableRow key={fatura.id}>
                  <TableCell className="font-medium">{fatura.cabecalho?.numeroDocumento || fatura.id}</TableCell>
                  <TableCell>{format(new Date(fatura.data), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{fatura.cabecalho?.tipoDocumento || 'Não especificado'}</TableCell>
                  <TableCell>{fatura.cabecalho?.transportadora || 'Não especificada'}</TableCell>
                  <TableCell>{fatura.notas?.length || 0}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    }).format(fatura.totais?.totalViagem || 0)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DocumentPDFGenerator
                      documentId={fatura.id}
                      documentType="Fatura"
                      renderDocument={renderFaturaDocument}
                      buttonVariant="ghost"
                      buttonSize="sm"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HistoricoFaturasTab;
