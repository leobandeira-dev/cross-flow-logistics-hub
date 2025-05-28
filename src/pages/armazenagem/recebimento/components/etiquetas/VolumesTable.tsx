import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Printer, Settings, CheckCircle, AlertTriangle } from 'lucide-react';

export interface Volume {
  id: string;
  notaFiscal: string;
  descricao: string;
  quantidade: number;
  etiquetado: boolean;
  remetente: string;
  destinatario: string;
  endereco: string;
  cidade: string;
  cidadeCompleta?: string;
  uf: string;
  pesoTotal: string;
  chaveNF: string;
  etiquetaMae?: string;
  tipoEtiquetaMae?: 'geral' | 'palete';
  tipoVolume?: 'geral' | 'quimico';
  codigoONU?: string;
  codigoRisco?: string;
  classificacaoQuimica?: 'nao_perigosa' | 'perigosa' | 'nao_classificada';
  transportadora?: string;
  area?: string;
}

interface VolumesTableProps {
  volumes: Volume[];
  handlePrintEtiquetas: (volume: Volume) => void;
  handleClassifyVolume: (volume: Volume) => void;
}

const VolumesTable: React.FC<VolumesTableProps> = ({ volumes, handlePrintEtiquetas, handleClassifyVolume }) => {
  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nota Fiscal</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Área</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {volumes.map((volume) => (
            <TableRow key={volume.id}>
              <TableCell className="font-medium">{volume.id}</TableCell>
              <TableCell>{volume.notaFiscal}</TableCell>
              <TableCell>{volume.descricao}</TableCell>
              <TableCell>{volume.area}</TableCell>
              <TableCell>
                {volume.etiquetado ? (
                  <Badge variant="outline">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Etiquetado
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Pendente
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePrintEtiquetas(volume)}
                  disabled={volume.etiquetado}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleClassifyVolume(volume)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Classificar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VolumesTable;
