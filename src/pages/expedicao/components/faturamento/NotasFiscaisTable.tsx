
import React, { useState } from 'react';
import { NotaFiscal } from '../../Faturamento';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Trash, FileText, RefreshCcw } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useHistoricoFaturas } from '../../hooks/faturamento/useHistoricoFaturas';
import DocumentGenerationDialog from './print/DocumentGenerationDialog';
import { CabecalhoValores, TotaisCalculados } from '../../hooks/faturamento/types';

interface NotasFiscaisTableProps {
  notas: NotaFiscal[];
  onDelete: (id: string) => void;
  onRecalculate: () => void;
  onExportToPDF: () => { isDialogOpen: boolean, setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>> };
  cabecalhoValores?: CabecalhoValores;
  totaisCalculados?: TotaisCalculados;
}

const NotasFiscaisTable: React.FC<NotasFiscaisTableProps> = ({ 
  notas, 
  onDelete, 
  onRecalculate, 
  onExportToPDF,
  cabecalhoValores,
  totaisCalculados
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Set default values for cabecalho and totais if not provided
  const defaultCabecalho: CabecalhoValores = cabecalhoValores || {
    fretePorTonelada: 0,
    pesoMinimo: 0,
    aliquotaICMS: 0,
    aliquotaExpresso: 0,
    valorFreteTransferencia: 0,
    valorColeta: 0,
    paletizacao: 0,
    pedagio: 0
  };
  
  const defaultTotais: TotaisCalculados = totaisCalculados || {
    fretePesoViagem: 0,
    pedagioViagem: 0,
    expressoViagem: 0,
    icmsViagem: 0,
    totalViagem: 0
  };
  
  const handleExportToPDF = () => {
    if (notas.length === 0) {
      return;
    }
    setIsDialogOpen(true);
  };

  const formatCurrency = (value: number | undefined): string => {
    if (value === undefined || isNaN(value)) return 'R$ 0,00';
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatWeight = (weight: number | undefined): string => {
    if (weight === undefined || isNaN(weight)) return '0,00 kg';
    return `${weight.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg`;
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">
            Notas Fiscais ({notas.length})
          </h2>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRecalculate}
              disabled={notas.length === 0}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Recalcular Rateio
            </Button>
            <Button 
              size="sm"
              onClick={handleExportToPDF}
              disabled={notas.length === 0}
            >
              <FileText className="h-4 w-4 mr-2" />
              Exportar para PDF
            </Button>
          </div>
        </div>

        {notas.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Peso (kg)</TableHead>
                <TableHead>Valor Frete</TableHead>
                <TableHead>Valor Exp.</TableHead>
                <TableHead>ICMS</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notas.map(nota => (
                <TableRow key={nota.id}>
                  <TableCell>{nota.cliente}</TableCell>
                  <TableCell>{format(new Date(nota.data), 'dd/MM/yyyy', { locale: ptBR })}</TableCell>
                  <TableCell>{formatWeight(nota.pesoNota)}</TableCell>
                  <TableCell>{formatCurrency(nota.fretePeso)}</TableCell>
                  <TableCell>{formatCurrency(nota.valorExpresso)}</TableCell>
                  <TableCell>{formatCurrency(nota.icms)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => onDelete(nota.id)}>
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-10 border rounded-md">
            <p className="text-muted-foreground">
              Nenhuma nota fiscal adicionada. Adicione notas para calcular o rateio de frete.
            </p>
          </div>
        )}
      </div>
      
      <DocumentGenerationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        notas={notas}
        cabecalhoValores={defaultCabecalho}
        totaisCalculados={defaultTotais}
      />
    </>
  );
};

export default NotasFiscaisTable;
