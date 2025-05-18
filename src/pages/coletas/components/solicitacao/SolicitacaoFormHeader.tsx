
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SolicitacaoFormHeaderProps } from './SolicitacaoTypes';
import { separarCidadeEstado } from '@/utils/estadoUtils';

const SolicitacaoFormHeader: React.FC<SolicitacaoFormHeaderProps> = ({
  cliente = '',
  dataColeta = '',
  origem = '',
  destino = '',
  onClienteChange = () => {},
  onDataColetaChange = () => {},
  onOrigemChange = () => {},
  onDestinoChange = () => {},
  readOnlyAddresses = false,
  currentStep,
  isLoading
}) => {
  // Extrair cidade e UF da origem
  const origemInfo = separarCidadeEstado(origem);
  const origemCidade = origemInfo?.cidade || '';
  const origemUF = origemInfo?.estado || '';
  
  // Extrair cidade e UF do destino
  const destinoInfo = separarCidadeEstado(destino);
  const destinoCidade = destinoInfo?.cidade || '';
  const destinoUF = destinoInfo?.estado || '';
  
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-3 space-y-2">
            <Label htmlFor="origem-cidade">Cidade Origem</Label>
            <Input 
              id="origem-cidade" 
              placeholder="Cidade de origem" 
              value={origemCidade}
              onChange={(e) => {
                // Atualiza manualmente o formato "Cidade - UF"
                onOrigemChange(`${e.target.value} - ${origemUF}`);
              }}
              readOnly={readOnlyAddresses}
              className={readOnlyAddresses ? "bg-gray-50" : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="origem-uf">UF</Label>
            <Input 
              id="origem-uf" 
              placeholder="UF" 
              value={origemUF}
              onChange={(e) => {
                // Atualiza manualmente o formato "Cidade - UF"
                onOrigemChange(`${origemCidade} - ${e.target.value}`);
              }}
              readOnly={readOnlyAddresses}
              className={readOnlyAddresses ? "bg-gray-50 uppercase" : "uppercase"}
              maxLength={2}
            />
          </div>
          {readOnlyAddresses && (
            <p className="text-xs text-gray-500 mt-1 col-span-4">Endereço obtido do XML da nota fiscal</p>
          )}
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-3 space-y-2">
            <Label htmlFor="destino-cidade">Cidade Destino</Label>
            <Input 
              id="destino-cidade" 
              placeholder="Cidade de destino" 
              value={destinoCidade}
              onChange={(e) => {
                // Atualiza manualmente o formato "Cidade - UF"
                onDestinoChange(`${e.target.value} - ${destinoUF}`);
              }}
              readOnly={readOnlyAddresses}
              className={readOnlyAddresses ? "bg-gray-50" : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="destino-uf">UF</Label>
            <Input 
              id="destino-uf" 
              placeholder="UF" 
              value={destinoUF}
              onChange={(e) => {
                // Atualiza manualmente o formato "Cidade - UF"
                onDestinoChange(`${destinoCidade} - ${e.target.value}`);
              }}
              readOnly={readOnlyAddresses}
              className={readOnlyAddresses ? "bg-gray-50 uppercase" : "uppercase"}
              maxLength={2}
            />
          </div>
          {readOnlyAddresses && (
            <p className="text-xs text-gray-500 mt-1 col-span-4">Endereço obtido do XML da nota fiscal</p>
          )}
        </div>
      </div>
    </>
  );
};

export default SolicitacaoFormHeader;
