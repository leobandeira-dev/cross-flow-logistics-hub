
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Carga } from '../../types/coleta.types';

interface CargasListProps {
  currentItems: Carga[];
  selectedCargasIds: string[];
  toggleSelectCarga: (cargaId: string) => void;
  toggleSelectAll: () => void;
  filteredCargas: Carga[];
}

const CargasList: React.FC<CargasListProps> = ({
  currentItems,
  selectedCargasIds,
  toggleSelectCarga,
  toggleSelectAll,
  filteredCargas
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={selectedCargasIds.length === filteredCargas.length && filteredCargas.length > 0}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead className="w-[120px]">Número</TableHead>
            <TableHead>Origem</TableHead>
            <TableHead>Destino</TableHead>
            <TableHead>Previsão</TableHead>
            <TableHead className="text-center">Volumes</TableHead>
            <TableHead>Peso</TableHead>
            <TableHead>CEP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Nenhuma coleta pendente encontrada
              </TableCell>
            </TableRow>
          ) : (
            currentItems.map((carga) => (
              <TableRow key={carga.id} className="cursor-pointer hover:bg-muted/30">
                <TableCell>
                  <Checkbox 
                    checked={selectedCargasIds.includes(carga.id)}
                    onCheckedChange={() => toggleSelectCarga(carga.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{carga.id}</TableCell>
                <TableCell>{carga.origem || "—"}</TableCell>
                <TableCell>{carga.destino}</TableCell>
                <TableCell>{carga.dataPrevisao}</TableCell>
                <TableCell className="text-center">{carga.volumes}</TableCell>
                <TableCell>{carga.peso}</TableCell>
                <TableCell>{carga.cep || "—"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CargasList;
