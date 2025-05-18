
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SolicitacaoFormHeaderProps } from './SolicitacaoTypes';
import { separarCidadeEstado } from '@/utils/estadoUtils';

const SolicitacaoFormHeader: React.FC<SolicitacaoFormHeaderProps> = ({
  cliente = '',
  dataColeta = '',
  horaColeta = '',
  dataAprovacao = '',
  horaAprovacao = '',
  dataInclusao = '',
  horaInclusao = '',
  origem = '',
  origemEndereco = '',
  origemCEP = '',
  destino = '',
  destinoEndereco = '',
  destinoCEP = '',
  onClienteChange = () => {},
  onDataColetaChange = () => {},
  onHoraColetaChange = () => {},
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
      <div className="grid grid-cols-2 gap-4 mb-4">
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
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="data">Data da Coleta</Label>
            <Input 
              id="data" 
              type="date" 
              value={dataColeta}
              onChange={(e) => onDataColetaChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hora">Hora da Coleta</Label>
            <Input 
              id="hora" 
              type="time" 
              value={horaColeta}
              onChange={(e) => onHoraColetaChange && onHoraColetaChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {dataInclusao && (
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="dataInclusao">Data de Inclusão</Label>
              <Input 
                id="dataInclusao" 
                type="date" 
                value={dataInclusao}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="horaInclusao">Hora de Inclusão</Label>
              <Input 
                id="horaInclusao" 
                type="time" 
                value={horaInclusao}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>
        )}
        {dataAprovacao && (
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="dataAprovacao">Data de Aprovação</Label>
              <Input 
                id="dataAprovacao" 
                type="date" 
                value={dataAprovacao}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="horaAprovacao">Hora de Aprovação</Label>
              <Input 
                id="horaAprovacao" 
                type="time" 
                value={horaAprovacao}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-4">
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
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="origem-endereco">Endereço Origem</Label>
            <Input 
              id="origem-endereco" 
              placeholder="Endereço completo" 
              value={origemEndereco}
              readOnly={readOnlyAddresses}
              className={readOnlyAddresses ? "bg-gray-50" : ""}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="origem-cep">CEP Origem</Label>
            <Input 
              id="origem-cep" 
              placeholder="CEP" 
              value={origemCEP}
              readOnly={readOnlyAddresses}
              className={readOnlyAddresses ? "bg-gray-50" : ""}
            />
          </div>
          
          {readOnlyAddresses && (
            <p className="text-xs text-gray-500 mt-1">Endereço obtido do XML da nota fiscal</p>
          )}
        </div>

        <div className="space-y-4">
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
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="destino-endereco">Endereço Destino</Label>
            <Input 
              id="destino-endereco" 
              placeholder="Endereço completo" 
              value={destinoEndereco}
              readOnly={readOnlyAddresses}
              className={readOnlyAddresses ? "bg-gray-50" : ""}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="destino-cep">CEP Destino</Label>
            <Input 
              id="destino-cep" 
              placeholder="CEP" 
              value={destinoCEP}
              readOnly={readOnlyAddresses}
              className={readOnlyAddresses ? "bg-gray-50" : ""}
            />
          </div>
          
          {readOnlyAddresses && (
            <p className="text-xs text-gray-500 mt-1">Endereço obtido do XML da nota fiscal</p>
          )}
        </div>
      </div>
    </>
  );
};

export default SolicitacaoFormHeader;
