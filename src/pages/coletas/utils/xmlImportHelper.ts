import xml2js from 'xml2js';

interface Endereco {
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
}

interface Empresa {
  cnpj?: string;
  cpf?: string;
  nome: string;
  endereco: Endereco;
  enderecoFormatado?: string;
}

interface Volume {
  altura: number;
  largura: number;
  comprimento: number;
  peso: number;
  quantidade: number;
}

export interface NotaFiscalInfo {
  numeroNF: string;
  volumes: Volume[];
  remetente: string;
  destinatario: string;
  valorTotal: number;
}

// Function to format address
const formatarEndereco = (endereco: Endereco): string => {
  return `${endereco.logradouro}, ${endereco.numero} ${endereco.complemento ? ` - ${endereco.complemento}` : ''}, ${endereco.bairro}, ${endereco.cidade} - ${endereco.uf}, ${endereco.cep}`;
};

// Function to extract sender (emitente) information
const extractEmitente = (emit: any): Empresa => {
  const endereco = emit.enderEmit || {};
  return {
    cnpj: emit.CNPJ || '',
    nome: emit.xNome || '',
    endereco: {
      logradouro: endereco.xLgr || '',
      numero: endereco.nro || '',
      complemento: endereco.xCpl || '',
      bairro: endereco.xBairro || '',
      cidade: endereco.xMun || '',
      uf: endereco.UF || '',
      cep: endereco.CEP || '',
    },
  };
};

// Function to extract recipient (destinatario) information
const extractDestinatario = (dest: any): Empresa => {
  const endereco = dest.enderDest || {};
  return {
    cnpj: dest.CNPJ || '',
    cpf: dest.CPF || '',
    nome: dest.xNome || '',
    endereco: {
      logradouro: endereco.xLgr || '',
      numero: endereco.nro || '',
      complemento: endereco.xCpl || '',
      bairro: endereco.xBairro || '',
      cidade: endereco.xMun || '',
      uf: endereco.UF || '',
      cep: endereco.CEP || '',
    },
  };
};

// Function to extract volume information
const extractVolumes = (nfeInfo: any): Volume[] => {
  const detalhes = Array.isArray(nfeInfo.det) ? nfeInfo.det : [nfeInfo.det].filter(Boolean);

  return detalhes.map((det: any) => {
    const prod = det.prod || {};
    return {
      altura: parseFloat(prod.qCom || 0),
      largura: parseFloat(prod.uCom || 0),
      comprimento: parseFloat(prod.cEAN || 0) ,
      peso: parseFloat(prod.pesoL || 0),
      quantidade: parseFloat(prod.qTrib || 0)
    };
  });
};

// Update the parseNFeXml function to extract remetente, destinatario, and valorTotal
export const parseNFeXml = async (xmlString: string) => {
  const parser = new xml2js.Parser({ explicitArray: false });

  try {
    const nfeData = await parser.parseStringPromise(xmlString);

    if (!nfeData) {
      throw new Error('XML inválido ou vazio.');
    }

    const nfeInfo = nfeData.nfeProc?.NFe?.infNFe || nfeData.NFe?.infNFe || {};
    const ide = nfeInfo.ide || {};
    const emit = nfeInfo.emit || {};
    const dest = nfeInfo.dest || {};
    
    // Get the nota fiscal number
    const numeroNF = ide.nNF || '';
    
    // Extract value information
    const valorTotal = extractValorTotal(nfeInfo);
    
    // Extract sender (remetente) information
    const remetente = extractEmitente(emit);
    
    // Extract recipient (destinatario) information
    const destinatario = extractDestinatario(dest);

    // Extract volume information
    const volumes = extractVolumes(nfeInfo);

    // Format addresses
    remetente.enderecoFormatado = formatarEndereco(remetente.endereco);
    destinatario.enderecoFormatado = formatarEndereco(destinatario.endereco);
    
    // Return structured data
    return {
      nfInfo: {
        numeroNF,
        volumes,
        remetente: remetente.nome,
        destinatario: destinatario.nome,
        valorTotal
      },
      remetente,
      destinatario,
    };
  } catch (error) {
    console.error('Erro ao processar XML:', error);
    throw new Error('Erro ao processar o XML. Verifique o formato e tente novamente.');
  }
};

// Extract the total value of the invoice
const extractValorTotal = (nfeInfo: any): number => {
  try {
    const icmsTot = nfeInfo.total?.ICMSTot || {};
    return parseFloat(icmsTot.vNF || '0');
  } catch (error) {
    console.warn('Erro ao extrair valor total:', error);
    return 0;
  }
};
