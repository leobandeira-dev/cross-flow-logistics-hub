
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { NotaFiscal } from '../../Faturamento';
import { formatCurrency, formatNumber } from '@/pages/armazenagem/utils/formatters';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Trash2, Calculator, FileText, Download } from 'lucide-react';

interface NotasFiscaisTableProps {
  notas: NotaFiscal[];
  onDelete: (id: string) => void;
  onRecalculate: () => void;
  onExportToPDF?: () => void;
}

const NotasFiscaisTable: React.FC<NotasFiscaisTableProps> = ({ 
  notas, 
  onDelete,
  onRecalculate,
  onExportToPDF
}) => {
  // Calculate totals
  const totalPeso = notas.reduce((acc, nota) => acc + nota.pesoNota, 0);
  const totalFretePeso = notas.reduce((acc, nota) => acc + (nota.fretePeso || 0), 0);
  const totalValorExpresso = notas.reduce((acc, nota) => acc + (nota.valorExpresso || 0), 0);
  const totalFreteRatear = notas.reduce((acc, nota) => acc + (nota.freteRatear || 0), 0);
  const totalPaletizacao = notas.reduce((acc, nota) => acc + (nota.paletizacao || 0), 0);
  const totalPedagio = notas.reduce((acc, nota) => acc + (nota.pedagio || 0), 0);
  const totalValorNF = notas.reduce((acc, nota) => acc + (nota.valorNF || 0), 0);
  const totalValorColeta = notas.reduce((acc, nota) => acc + (nota.valorColeta || 0), 0);
  const totalValorFreteTransferencia = notas.reduce((acc, nota) => acc + (nota.valorFreteTransferencia || 0), 0);
  const totalICMS = notas.reduce((acc, nota) => {
    const valorBase = (nota.fretePeso || 0) + (nota.paletizacao || 0) + (nota.pedagio || 0);
    return acc + (valorBase * (nota.aliquotaICMS / 100));
  }, 0);
  const totalPrestacao = notas.reduce((acc, nota) => acc + (nota.totalPrestacao || 0), 0);

  if (notas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground mb-4">Nenhuma nota fiscal encontrada.</p>
        <p className="text-sm text-muted-foreground">
          Adicione notas fiscais para visualizar o cálculo de rateio.
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="whitespace-nowrap font-bold">Data</TableHead>
                <TableHead className="whitespace-nowrap font-bold">Remetente</TableHead>
                <TableHead className="whitespace-nowrap font-bold">Destinatário</TableHead>
                <TableHead className="whitespace-nowrap font-bold">Nota Fiscal</TableHead>
                <TableHead className="whitespace-nowrap font-bold">Pedido</TableHead>
                <TableHead className="whitespace-nowrap font-bold">Data Emissão</TableHead>
                <TableHead className="whitespace-nowrap font-bold text-right">Valor NF (R$)</TableHead>
                <TableHead className="whitespace-nowrap font-bold text-right">Peso (kg)</TableHead>
                <TableHead className="whitespace-nowrap font-bold text-right">Frete/Ton (R$)</TableHead>
                <TableHead className="whitespace-nowrap font-bold text-right">Frete Transf. (R$)</TableHead>
                <TableHead className="whitespace-nowrap font-bold">CTE Coleta</TableHead>
                <TableHead className="whitespace-nowrap font-bold text-right">Valor Coleta (R$)</TableHead>
                <TableHead className="whitespace-nowrap font-bold">CTE Transf.</TableHead>
                <TableHead className="whitespace-nowrap font-bold text-right">Paletização (R$)</TableHead>
                <TableHead className="whitespace-nowrap font-bold text-right">Pedágio (R$)</TableHead>
                <TableHead className="whitespace-nowrap font-bold text-right">ICMS (%)</TableHead>
                <TableHead className="whitespace-nowrap font-bold text-right">Frete Peso (R$)</TableHead>
                <TableHead className="whitespace-nowrap font-bold text-right">Valor Expresso (R$)</TableHead>
                <TableHead className="whitespace-nowrap font-bold text-right">Total Prestação (R$)</TableHead>
                <TableHead className="whitespace-nowrap font-bold w-[80px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notas.map((nota) => (
                <TableRow key={nota.id}>
                  <TableCell>{format(nota.data, 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{nota.remetente || '-'}</TableCell>
                  <TableCell>{nota.cliente}</TableCell>
                  <TableCell>{nota.notaFiscal || '-'}</TableCell>
                  <TableCell>{nota.pedido || '-'}</TableCell>
                  <TableCell>{nota.dataEmissao ? format(nota.dataEmissao, 'dd/MM/yyyy') : '-'}</TableCell>
                  <TableCell className="text-right">{nota.valorNF ? formatCurrency(nota.valorNF) : '-'}</TableCell>
                  <TableCell className="text-right">{formatNumber(nota.pesoNota)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(nota.fretePorTonelada)}</TableCell>
                  <TableCell className="text-right">{nota.valorFreteTransferencia ? formatCurrency(nota.valorFreteTransferencia) : '-'}</TableCell>
                  <TableCell>{nota.cteColeta || '-'}</TableCell>
                  <TableCell className="text-right">{nota.valorColeta ? formatCurrency(nota.valorColeta) : '-'}</TableCell>
                  <TableCell>{nota.cteTransferencia || '-'}</TableCell>
                  <TableCell className="text-right">{nota.paletizacao ? formatCurrency(nota.paletizacao) : '-'}</TableCell>
                  <TableCell className="text-right">{nota.pedagio ? formatCurrency(nota.pedagio) : '-'}</TableCell>
                  <TableCell className="text-right">{nota.aliquotaICMS.toFixed(2)}%</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(nota.fretePeso || 0)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(nota.valorExpresso || 0)}</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(nota.totalPrestacao || 0)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onDelete(nota.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/30 font-semibold">
                <TableCell colSpan={6} className="text-right">Totais:</TableCell>
                <TableCell className="text-right">{formatCurrency(totalValorNF)}</TableCell>
                <TableCell className="text-right">{formatNumber(totalPeso)} kg</TableCell>
                <TableCell className="text-right">-</TableCell>
                <TableCell className="text-right">{formatCurrency(totalValorFreteTransferencia)}</TableCell>
                <TableCell>-</TableCell>
                <TableCell className="text-right">{formatCurrency(totalValorColeta)}</TableCell>
                <TableCell>-</TableCell>
                <TableCell className="text-right">{formatCurrency(totalPaletizacao)}</TableCell>
                <TableCell className="text-right">{formatCurrency(totalPedagio)}</TableCell>
                <TableCell className="text-right">-</TableCell>
                <TableCell className="text-right">{formatCurrency(totalFretePeso)}</TableCell>
                <TableCell className="text-right">{formatCurrency(totalValorExpresso)}</TableCell>
                <TableCell className="text-right">{formatCurrency(totalPrestacao)}</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <div className="flex flex-col md:flex-row w-full justify-between items-center gap-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Peso Total:</p>
              <p className="font-medium">{formatNumber(totalPeso)} kg</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Frete Peso:</p>
              <p className="font-medium">{formatCurrency(totalFretePeso)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Paletização:</p>
              <p className="font-medium">{formatCurrency(totalPaletizacao)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Pedágio:</p>
              <p className="font-medium">{formatCurrency(totalPedagio)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total ICMS:</p>
              <p className="font-medium">{formatCurrency(totalICMS)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total da Prestação:</p>
              <p className="font-semibold">{formatCurrency(totalPrestacao)}</p>
            </div>
          </div>
          
          <div className="flex gap-2 ml-auto">
            {onExportToPDF && (
              <Button variant="outline" onClick={onExportToPDF} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar PDF
              </Button>
            )}
            <Button onClick={onRecalculate} className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Recalcular Rateio
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NotasFiscaisTable;
