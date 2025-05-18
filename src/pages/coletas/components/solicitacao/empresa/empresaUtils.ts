
import { EnderecoCompleto, DadosEmpresa, EmpresaInfo } from '../SolicitacaoTypes';

// Convert DadosEmpresa to EmpresaInfo
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
    telefone: '', // Not available in DadosEmpresa
    email: '' // Not available in DadosEmpresa
  };
};

// Convert EmpresaInfo to DadosEmpresa
export const convertEmpresaInfoToDados = (info: EmpresaInfo): DadosEmpresa => {
  return {
    razaoSocial: info.razaoSocial,
    cnpj: info.cnpj,
    nomeFantasia: '',  // Not available in EmpresaInfo
    endereco: {
      logradouro: info.endereco,
      numero: info.numero,
      complemento: info.complemento,
      bairro: info.bairro,
      cidade: info.cidade,
      uf: info.uf,
      cep: info.cep
    },
    enderecoFormatado: `${info.endereco}, ${info.numero} - ${info.bairro}, ${info.cidade} - ${info.uf}, ${info.cep}`
  };
};

// Format address for display
export const formatEnderecoDisplay = (endereco: EnderecoCompleto): string => {
  return `${endereco.logradouro}, ${endereco.numero}${endereco.complemento ? ` - ${endereco.complemento}` : ''}, ${endereco.bairro}, ${endereco.cidade} - ${endereco.uf}, ${endereco.cep}`;
};
