
interface CNPJResponse {
  status: string;
  cnpj: string;
  tipo: string;
  nome: string;
  fantasia: string;
  logradouro: string;
  numero: string;
  complemento: string;
  cep: string;
  bairro: string;
  municipio: string;
  uf: string;
  email: string;
  telefone: string;
  situacao: string;
  [key: string]: any;
}

/**
 * Função para consultar dados de um CNPJ na API da Receita Federal
 * @param cnpj CNPJ sem formatação (apenas números)
 * @returns Dados da empresa ou erro
 */
export const consultarCNPJ = async (cnpj: string): Promise<CNPJResponse> => {
  // Remover formatação do CNPJ, se houver
  const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
  
  if (cnpjLimpo.length !== 14) {
    throw new Error('CNPJ deve ter 14 dígitos');
  }
  
  try {
    const response = await fetch(`https://receitaws.com.br/v1/cnpj/${cnpjLimpo}`);
    
    if (response.status === 429) {
      throw new Error('Limite de requisições excedido. Tente novamente em 1 minuto.');
    }
    
    if (response.status === 504) {
      throw new Error('Tempo de resposta excedido. Tente novamente mais tarde.');
    }
    
    if (!response.ok) {
      throw new Error(`Erro na consulta: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Erro ao consultar CNPJ:', error);
    throw new Error(`Falha ao consultar CNPJ: ${error.message}`);
  }
};

/**
 * Formatar um CNPJ para exibição (XX.XXX.XXX/XXXX-XX)
 */
export const formatarCNPJ = (cnpj: string): string => {
  const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
  
  if (cnpjLimpo.length !== 14) return cnpj;
  
  return cnpjLimpo.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
};

/**
 * Remove a formatação do CNPJ, deixando apenas números
 */
export const limparCNPJ = (cnpj: string): string => {
  return cnpj.replace(/[^\d]/g, '');
};

/**
 * Função para mapear os dados da API para o formato do formulário
 */
export const mapearDadosParaFormulario = (dados: CNPJResponse) => {
  return {
    cnpj: dados.cnpj,
    razaoSocial: dados.nome,
    nomeFantasia: dados.fantasia || dados.nome,
    email: dados.email,
    telefone: dados.telefone,
    logradouro: dados.logradouro,
    numero: dados.numero,
    complemento: dados.complemento || '',
    bairro: dados.bairro,
    cidade: dados.municipio,
    uf: dados.uf,
    cep: dados.cep,
  };
};
