
import { EnderecoCompleto, DadosEmpresa } from '../../../types/coleta.types';
import { EmpresaInfo } from '../SolicitacaoTypes';

// Convert from EmpresaInfo to DadosEmpresa
export const convertEmpresaInfoToDados = (info: EmpresaInfo): DadosEmpresa => {
  const endereco: EnderecoCompleto = {
    logradouro: info.endereco,
    numero: info.numero,
    complemento: info.complemento || '',
    bairro: info.bairro,
    cidade: info.cidade,
    uf: info.uf,
    cep: info.cep
  };

  return {
    cnpj: info.cnpj,
    razaoSocial: info.razaoSocial,
    nomeFantasia: info.razaoSocial, // Using razaoSocial as fallback
    endereco,
    enderecoFormatado: `${endereco.logradouro}, ${endereco.numero}${endereco.complemento ? ', ' + endereco.complemento : ''}, ${endereco.bairro}, ${endereco.cidade}/${endereco.uf}, CEP: ${endereco.cep}`
  };
};

// Convert from DadosEmpresa to EmpresaInfo
export const convertDadosToEmpresaInfo = (dados: DadosEmpresa): EmpresaInfo => {
  return {
    razaoSocial: dados.razaoSocial,
    cnpj: dados.cnpj,
    endereco: dados.endereco.logradouro,
    numero: dados.endereco.numero,
    complemento: dados.endereco.complemento,
    bairro: dados.endereco.bairro,
    cidade: dados.endereco.cidade,
    uf: dados.endereco.uf,
    cep: dados.endereco.cep,
    telefone: '', // Default values for fields not in DadosEmpresa
    email: ''     // Default values for fields not in DadosEmpresa
  };
};
