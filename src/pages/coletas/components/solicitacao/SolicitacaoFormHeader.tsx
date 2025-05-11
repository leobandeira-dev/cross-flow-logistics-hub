
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SolicitacaoFormHeaderProps {
  cliente: string;
  dataColeta: string;
  origem: string;
  destino: string;
  onClienteChange: (value: string) => void;
  onDataColetaChange: (value: string) => void;
  onOrigemChange: (value: string) => void;
  onDestinoChange: (value: string) => void;
}

const SolicitacaoFormHeader: React.FC<SolicitacaoFormHeaderProps> = ({
  cliente,
  dataColeta,
  origem,
  destino,
  onClienteChange,
  onDataColetaChange,
  onOrigemChange,
  onDestinoChange,
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cliente">Cliente</Label>
          <Select
            value={cliente}
            onValueChange={onClienteChange}
          >
            <SelectTrigger id="cliente">
              <SelectValue placeholder="Selecione o cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="abc">Indústria ABC Ltda</SelectItem>
                <SelectItem value="xyz">Distribuidora XYZ</SelectItem>
                <SelectItem value="rapidos">Transportes Rápidos</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="data">Data da Coleta</Label>
          <Input 
            id="data" 
            type="date" 
            value={dataColeta}
            onChange={(e) => onDataColetaChange(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="origem">Origem</Label>
          <Input 
            id="origem" 
            placeholder="Endereço de origem" 
            value={origem}
            onChange={(e) => onOrigemChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="destino">Destino</Label>
          <Input 
            id="destino" 
            placeholder="Endereço de destino" 
            value={destino}
            onChange={(e) => onDestinoChange(e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default SolicitacaoFormHeader;
