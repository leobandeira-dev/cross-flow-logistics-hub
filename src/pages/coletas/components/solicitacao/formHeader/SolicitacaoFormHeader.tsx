
import React from 'react';
import { separarCidadeEstado } from '@/utils/estadoUtils';
import { SolicitacaoFormHeaderProps } from './types';
import ClienteSelect from './ClienteSelect';
import DateTimeSection from './DateTimeSection';
import AddressSection from './AddressSection';

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
  readOnlyAddresses = false
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
        <ClienteSelect 
          value={cliente} 
          onValueChange={onClienteChange} 
        />
        
        <DateTimeSection 
          dataLabel="Data da Coleta"
          horaLabel="Hora da Coleta"
          data={dataColeta}
          hora={horaColeta}
          onDataChange={onDataColetaChange}
          onHoraChange={onHoraColetaChange}
          id="coleta"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {dataInclusao && (
          <DateTimeSection 
            dataLabel="Data de Inclusão"
            horaLabel="Hora de Inclusão"
            data={dataInclusao}
            hora={horaInclusao}
            readonly={true}
            id="inclusao"
          />
        )}
        {dataAprovacao && (
          <DateTimeSection 
            dataLabel="Data de Aprovação"
            horaLabel="Hora de Aprovação"
            data={dataAprovacao}
            hora={horaAprovacao}
            readonly={true}
            id="aprovacao"
          />
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <AddressSection 
          label="Origem"
          cidade={origemCidade}
          uf={origemUF}
          endereco={origemEndereco}
          cep={origemCEP}
          readOnly={readOnlyAddresses}
          onCidadeChange={onOrigemChange}
          onUFChange={onOrigemChange}
          id="origem"
        />

        <AddressSection 
          label="Destino"
          cidade={destinoCidade}
          uf={destinoUF}
          endereco={destinoEndereco}
          cep={destinoCEP}
          readOnly={readOnlyAddresses}
          onCidadeChange={onDestinoChange}
          onUFChange={onDestinoChange}
          id="destino"
        />
      </div>
    </>
  );
};

export default SolicitacaoFormHeader;
