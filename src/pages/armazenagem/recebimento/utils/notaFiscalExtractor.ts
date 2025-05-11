
import { NotaFiscalSchemaType } from '../components/forms/notaFiscalSchema';

/**
 * Extract data from an XML object to populate a NotaFiscal form
 */
export const extractDataFromXml = (xmlData: any): Partial<NotaFiscalSchemaType> => {
  try {
    console.log("Tentando extrair dados do XML:", xmlData);
    
    // Navigate through the XML structure using the new approach
    const nfeProc = xmlData.nfeproc || xmlData.nfeProc || {};
    
    // Accessing the XML content in a more resilient way
    const nfe = nfeProc.nfe || nfeProc.nfe;
    const infNFe = nfe?.infnfe || nfe?.infnfe;
    
    if (!infNFe) {
      console.error("Estrutura de XML não reconhecida:", xmlData);
      return {};
    }
    
    // Extracting basic data
    const ide = infNFe.ide || {};
    const emit = infNFe.emit || {};
    const dest = infNFe.dest || {};
    const transp = infNFe.transp || {};
    const total = infNFe.total || {};
    
    console.log("Estrutura encontrada:", {
      ide: ide,
      emit: emit,
      dest: dest,
      transp: transp,
      total: total
    });
    
    // Helper function to safely extract a value
    const getValue = (obj: any, path: string[], defaultValue: string = ''): string => {
      let current = obj;
      
      for (const key of path) {
        if (current && typeof current === 'object' && key in current) {
          current = current[key];
        } else {
          return defaultValue;
        }
      }
      
      return current?.toString() || defaultValue;
    };
    
    // Extracting data with the helper function
    return {
      // Note data
      chaveNF: getValue(infNFe, ['id']) || getValue(infNFe, ['Id']),
      numeroNF: getValue(ide, ['nnf']) || getValue(ide, ['nnf']),
      serieNF: getValue(ide, ['serie']),
      dataHoraEmissao: getValue(ide, ['dhemi']) ? 
        new Date(getValue(ide, ['dhemi'])).toISOString().split('T')[0] : '',
      valorTotal: getValue(total, ['icmstot', 'vnf']) || getValue(total, ['icmstot', 'vnf']),
      
      // Sender data
      emitenteCNPJ: getValue(emit, ['cnpj']),
      emitenteRazaoSocial: getValue(emit, ['xnome']),
      emitenteEndereco: `${getValue(emit, ['enderemit', 'xlgr'])}, ${getValue(emit, ['enderemit', 'nro'])}`,
      emitenteBairro: getValue(emit, ['enderemit', 'xbairro']),
      emitenteCidade: getValue(emit, ['enderemit', 'xmun']),
      emitenteUF: getValue(emit, ['enderemit', 'uf']),
      emitenteCEP: getValue(emit, ['enderemit', 'cep']),
      emitenteTelefone: getValue(emit, ['enderemit', 'fone']),
      
      // Recipient data
      destinatarioCNPJ: getValue(dest, ['cnpj']),
      destinatarioRazaoSocial: getValue(dest, ['xnome']),
      destinatarioEndereco: `${getValue(dest, ['enderdest', 'xlgr'])}, ${getValue(dest, ['enderdest', 'nro'])}`,
      destinatarioBairro: getValue(dest, ['enderdest', 'xbairro']),
      destinatarioCidade: getValue(dest, ['enderdest', 'xmun']),
      destinatarioUF: getValue(dest, ['enderdest', 'uf']),
      destinatarioCEP: getValue(dest, ['enderdest', 'cep']),
      destinatarioTelefone: getValue(dest, ['enderdest', 'fone']),
      
      // Transport information
      responsavelEntrega: getValue(transp, ['transporta', 'xnome']),
      motorista: getValue(transp, ['veictransp', 'placa']) ? 
        `Placa: ${getValue(transp, ['veictransp', 'placa'])}` : '',
      volumesTotal: getValue(transp, ['vol', 'qvol']),
      pesoTotalBruto: getValue(transp, ['vol', 'pesob']),
    };
  } catch (error) {
    console.error("Erro ao extrair dados do XML:", error);
    return {};
  }
};

/**
 * Mock data search for a nota fiscal
 */
export const searchNotaFiscalByChave = async (chaveNF: string): Promise<Partial<NotaFiscalSchemaType>> => {
  console.log('Buscando nota fiscal pela chave:', chaveNF);
  
  // Simulate an API call with setTimeout
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate filling in some fields
      resolve({
        numeroNF: '654321',
        serieNF: '001',
        dataHoraEmissao: '2023-05-10',
        valorTotal: '1850.75',
        emitenteRazaoSocial: 'Fornecedor ABC Ltda',
        emitenteCNPJ: '12.345.678/0001-90',
      });
    }, 1500);
  });
};
