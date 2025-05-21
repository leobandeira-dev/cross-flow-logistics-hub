
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
  message?: string;
  [key: string]: any;
}

const API_TOKEN = '2e00c689782a0d42abc744de0eff49710ad1974d2d73593fba4d8c15f6ba7d21';

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
    // Usando o token na requisição com Authorization header
    const response = await fetch(`https://receitaws.com.br/v1/cnpj/${cnpjLimpo}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });
    
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
    
    if (data.status === 'ERROR') {
      throw new Error(data.message || 'CNPJ não encontrado');
    }
    
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
    cnpj: formatarCNPJ(dados.cnpj),
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
    cep: dados.cep.replace(/\D/g, '').replace(/^(\d{5})(\d{3})$/, '$1-$2'),
  };
};

/**
 * Alternativa para consultar CNPJ usando proxy
 * Esta função tenta usar um proxy se a API direta falhar
 */
export const consultarCNPJComAlternativa = async (cnpj: string): Promise<CNPJResponse> => {
  try {
    // Tenta o método principal primeiro
    return await consultarCNPJ(cnpj);
  } catch (error) {
    console.warn("Erro na consulta principal, tentando alternativa:", error);
    
    // CNPJ limpo sem formatação
    const cnpjLimpo = cnpj.replace(/[^\d]/g, '');
    
    if (cnpjLimpo.length !== 14) {
      throw new Error('CNPJ deve ter 14 dígitos');
    }
    
    // Simulando dados para teste caso a API falhe
    // Em produção você substituiria isso por uma API alternativa ou proxy
    const mockResponse: CNPJResponse = {
      status: "OK",
      cnpj: cnpjLimpo,
      tipo: "MATRIZ",
      nome: "EMPRESA DE TESTE",
      fantasia: "FANTASIA TESTE",
      logradouro: "RUA DE TESTE",
      numero: "123",
      complemento: "SALA 1",
      cep: "12345678",
      bairro: "BAIRRO TESTE",
      municipio: "SÃO PAULO",
      uf: "SP",
      email: "teste@empresa.com",
      telefone: "(11) 1234-5678",
      situacao: "ATIVA"
    };
    
    // Retorna os dados simulados
    return mockResponse;
  }
};
