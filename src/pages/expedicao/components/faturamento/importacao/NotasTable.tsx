
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { NotaFiscal } from '../../../Faturamento';

interface NotasTableProps {
  notasLote: Partial<NotaFiscal>[];
  onUpdateNota: (index: number, field: keyof NotaFiscal, value: any) => void;
  onRemoveNota: (index: number) => void;
}

const NotasTable: React.FC<NotasTableProps> = ({ notasLote, onUpdateNota, onRemoveNota }) => {
  if (notasLote.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Data</TableHead>
            <TableHead className="whitespace-nowrap">Remetente</TableHead>
            <TableHead className="whitespace-nowrap">Cliente</TableHead>
            <TableHead className="whitespace-nowrap">Nota Fiscal</TableHead>
            <TableHead className="whitespace-nowrap">Pedido</TableHead>
            <TableHead className="whitespace-nowrap">Peso (kg)</TableHead>
            <TableHead className="whitespace-nowrap">Valor NF (R$)</TableHead>
            <TableHead className="whitespace-nowrap">Frete/Ton (R$)</TableHead>
            <TableHead className="whitespace-nowrap">Peso Mín. (kg)</TableHead>
            <TableHead className="whitespace-nowrap">Alíq. ICMS (%)</TableHead>
            <TableHead className="whitespace-nowrap">Alíq. Expresso (%)</TableHead>
            <TableHead className="whitespace-nowrap">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notasLote.map((nota, index) => (
            <TableRow key={index}>
              <TableCell>
                <Input 
                  type="date" 
                  value={nota.data ? nota.data.toISOString().split('T')[0] : ''}
                  onChange={(e) => onUpdateNota(index, 'data', new Date(e.target.value))}
                />
              </TableCell>
              <TableCell>
                <Input 
                  value={nota.remetente || ''}
                  onChange={(e) => onUpdateNota(index, 'remetente', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Input 
                  value={nota.cliente || ''}
                  onChange={(e) => onUpdateNota(index, 'cliente', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Input 
                  value={nota.notaFiscal || ''}
                  onChange={(e) => onUpdateNota(index, 'notaFiscal', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Input 
                  value={nota.pedido || ''}
                  onChange={(e) => onUpdateNota(index, 'pedido', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <Input 
                  type="number" 
                  step="0.01"
                  value={nota.pesoNota || 0}
                  onChange={(e) => onUpdateNota(index, 'pesoNota', parseFloat(e.target.value))}
                />
              </TableCell>
              <TableCell>
                <Input 
                  type="number" 
                  step="0.01"
                  value={nota.valorNF || 0}
                  onChange={(e) => onUpdateNota(index, 'valorNF', parseFloat(e.target.value))}
                />
              </TableCell>
              <TableCell>
                <Input 
                  type="number" 
                  step="0.01"
                  value={nota.fretePorTonelada || 0}
                  onChange={(e) => onUpdateNota(index, 'fretePorTonelada', parseFloat(e.target.value))}
                />
              </TableCell>
              <TableCell>
                <Input 
                  type="number" 
                  step="0.01"
                  value={nota.pesoMinimo || 0}
                  onChange={(e) => onUpdateNota(index, 'pesoMinimo', parseFloat(e.target.value))}
                />
              </TableCell>
              <TableCell>
                <Input 
                  type="number" 
                  step="0.01"
                  value={nota.aliquotaICMS || 0}
                  onChange={(e) => onUpdateNota(index, 'aliquotaICMS', parseFloat(e.target.value))}
                />
              </TableCell>
              <TableCell>
                <Input 
                  type="number" 
                  step="0.01"
                  value={nota.aliquotaExpresso || 0}
                  onChange={(e) => onUpdateNota(index, 'aliquotaExpresso', parseFloat(e.target.value))}
                />
              </TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-red-500 hover:text-red-700"
                  onClick={() => onRemoveNota(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default NotasTable;
