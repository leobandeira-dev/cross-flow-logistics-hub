
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SolicitacaoFormHeaderProps } from './types';

const SolicitacaoFormHeader: React.FC<SolicitacaoFormHeaderProps> = ({
  currentStep = 1,
  isLoading = false,
  tipoFrete = 'FOB',
  dataColeta = '',
  horaColeta = '',
  dataAprovacao,
  horaAprovacao,
  dataInclusao,
  horaInclusao,
  origem = '',
  origemEndereco = '',
  origemCEP = '',
  destino = '',
  destinoEndereco = '',
  destinoCEP = '',
  remetente,
  destinatario,
  onTipoFreteChange,
  onDataColetaChange,
  onHoraColetaChange,
  onOrigemChange,
  onDestinoChange,
  readOnlyAddresses = false
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tipo de Frete (FOB/CIF) */}
        <div>
          <Label htmlFor="tipoFrete" className="text-xs text-gray-600">
            Tipo de Frete
          </Label>
          <Select
            value={tipoFrete}
            onValueChange={(value) => onTipoFreteChange?.(value as 'FOB' | 'CIF')}
            disabled={isLoading}
          >
            <SelectTrigger id="tipoFrete" className="mt-1">
              <SelectValue placeholder="Selecione o tipo de frete" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FOB">FOB (Por conta do destinatário)</SelectItem>
              <SelectItem value="CIF">CIF (Por conta do remetente)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Data Coleta Field */}
        <div>
          <Label htmlFor="dataColeta" className="text-xs text-gray-600">
            Data da Coleta
          </Label>
          <Input 
            id="dataColeta"
            type="date" 
            value={dataColeta} 
            onChange={(e) => onDataColetaChange?.(e.target.value)}
            className="mt-1"
            disabled={isLoading}
          />
        </div>

        {/* Hora Coleta Field */}
        <div>
          <Label htmlFor="horaColeta" className="text-xs text-gray-600">
            Hora da Coleta
          </Label>
          <Input 
            id="horaColeta"
            type="time" 
            value={horaColeta || ''} 
            onChange={(e) => onHoraColetaChange?.(e.target.value)}
            className="mt-1"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Remetente/Destinatário Info */}
      {(remetente || destinatario) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-gray-50 rounded-md mb-3">
          {remetente && (
            <div>
              <h4 className="text-sm font-medium mb-1">Remetente</h4>
              <p className="text-sm">{remetente.razaoSocial}</p>
              <p className="text-xs text-gray-500">CNPJ: {remetente.cnpj}</p>
            </div>
          )}
          
          {destinatario && (
            <div>
              <h4 className="text-sm font-medium mb-1">Destinatário</h4>
              <p className="text-sm">{destinatario.razaoSocial}</p>
              <p className="text-xs text-gray-500">CNPJ: {destinatario.cnpj}</p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Origem Fields */}
        <div className="space-y-2">
          <div>
            <Label htmlFor="origem" className="text-xs text-gray-600">
              Origem (Cidade - UF)
            </Label>
            <Input 
              id="origem"
              value={origem} 
              onChange={(e) => onOrigemChange?.(e.target.value)}
              className="mt-1"
              placeholder="Cidade - UF"
              disabled={isLoading || readOnlyAddresses}
            />
          </div>
          
          <div>
            <Label htmlFor="origemEndereco" className="text-xs text-gray-600">
              Endereço de Origem
            </Label>
            <Input 
              id="origemEndereco"
              value={origemEndereco} 
              className="mt-1"
              placeholder="Rua, número, bairro"
              disabled={true} // Always read-only as it's populated from XML
              readOnly
            />
          </div>
          
          <div>
            <Label htmlFor="origemCEP" className="text-xs text-gray-600">
              CEP de Origem
            </Label>
            <Input 
              id="origemCEP"
              value={origemCEP} 
              className="mt-1"
              placeholder="00000-000"
              disabled={true} // Always read-only as it's populated from XML
              readOnly
            />
          </div>
        </div>

        {/* Destino Fields */}
        <div className="space-y-2">
          <div>
            <Label htmlFor="destino" className="text-xs text-gray-600">
              Destino (Cidade - UF)
            </Label>
            <Input 
              id="destino"
              value={destino} 
              onChange={(e) => onDestinoChange?.(e.target.value)}
              className="mt-1"
              placeholder="Cidade - UF"
              disabled={isLoading || readOnlyAddresses}
            />
          </div>
          
          <div>
            <Label htmlFor="destinoEndereco" className="text-xs text-gray-600">
              Endereço de Destino
            </Label>
            <Input 
              id="destinoEndereco"
              value={destinoEndereco} 
              className="mt-1"
              placeholder="Rua, número, bairro"
              disabled={true} // Always read-only as it's populated from XML
              readOnly
            />
          </div>
          
          <div>
            <Label htmlFor="destinoCEP" className="text-xs text-gray-600">
              CEP de Destino
            </Label>
            <Input 
              id="destinoCEP"
              value={destinoCEP}
              className="mt-1"
              placeholder="00000-000"
              disabled={true} // Always read-only as it's populated from XML
              readOnly
            />
          </div>
        </div>
      </div>

      {/* Display Approval and Inclusion dates if available */}
      {(dataAprovacao || dataInclusao) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 bg-gray-50 p-2 rounded text-xs">
          {dataInclusao && (
            <>
              <div>
                <span className="text-gray-500">Data de Inclusão:</span>
                <span className="ml-1 font-medium">{dataInclusao}</span>
              </div>
              {horaInclusao && (
                <div>
                  <span className="text-gray-500">Hora de Inclusão:</span>
                  <span className="ml-1 font-medium">{horaInclusao}</span>
                </div>
              )}
            </>
          )}
          
          {dataAprovacao && (
            <>
              <div>
                <span className="text-gray-500">Data de Aprovação:</span>
                <span className="ml-1 font-medium">{dataAprovacao}</span>
              </div>
              {horaAprovacao && (
                <div>
                  <span className="text-gray-500">Hora de Aprovação:</span>
                  <span className="ml-1 font-medium">{horaAprovacao}</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SolicitacaoFormHeader;
