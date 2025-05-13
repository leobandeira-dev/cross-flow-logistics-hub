
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
import { Trash2, Calculator } from 'lucide-react';

interface NotasFiscaisTableProps {
  notas: NotaFiscal[];
  onDelete: (id: string) => void;
  onRecalculate: () => void;
}

const NotasFiscaisTable: React.FC<NotasFiscaisTableProps> = ({ 
  notas, 
  onDelete,
  onRecalculate
}) => {
  // Calculate totals
  const totalPeso = notas.reduce((acc, nota) => acc + nota.pesoNota, 0);
  const totalFretePeso = notas.reduce((acc, nota) => acc + (nota.fretePeso || 0), 0);
  const totalValorExpresso = notas.reduce((acc, nota) => acc + (nota.valorExpresso || 0), 0);
  const totalFreteRatear = notas.reduce((acc, nota) => acc + (nota.freteRatear || 0), 0);

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
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-right">Peso (kg)</TableHead>
                <TableHead className="text-right">Frete/Ton (R$)</TableHead>
                <TableHead className="text-right">Peso Mín. (kg)</TableHead>
                <TableHead className="text-right">ICMS (%)</TableHead>
                <TableHead className="text-right">Expresso (%)</TableHead>
                <TableHead className="text-right">Frete Peso (R$)</TableHead>
                <TableHead className="text-right">Valor Expresso (R$)</TableHead>
                <TableHead className="text-right">Frete a Ratear (R$)</TableHead>
                <TableHead className="w-[80px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notas.map((nota) => (
                <TableRow key={nota.id}>
                  <TableCell>{format(nota.data, 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{nota.cliente}</TableCell>
                  <TableCell className="text-right">{formatNumber(nota.pesoNota)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(nota.fretePorTonelada)}</TableCell>
                  <TableCell className="text-right">{formatNumber(nota.pesoMinimo)}</TableCell>
                  <TableCell className="text-right">{nota.aliquotaICMS.toFixed(2)}%</TableCell>
                  <TableCell className="text-right">{nota.aliquotaExpresso.toFixed(2)}%</TableCell>
                  <TableCell className="text-right">{formatCurrency(nota.fretePeso || 0)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(nota.valorExpresso || 0)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(nota.freteRatear || 0)}</TableCell>
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
              <p className="text-muted-foreground">Total Valor Expresso:</p>
              <p className="font-medium">{formatCurrency(totalValorExpresso)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Frete a Ratear:</p>
              <p className="font-semibold">{formatCurrency(totalFreteRatear)}</p>
            </div>
          </div>
          
          <Button onClick={onRecalculate} className="ml-auto">
            <Calculator className="mr-2 h-4 w-4" />
            Recalcular Rateio
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NotasFiscaisTable;
