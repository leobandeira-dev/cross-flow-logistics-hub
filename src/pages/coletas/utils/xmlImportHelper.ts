
import { parseXmlFile } from '../../armazenagem/recebimento/utils/xmlParser';
import { NotaFiscalVolume, VolumeItem, generateVolumeId } from './volumeCalculations';
import { toast } from '@/hooks/use-toast';

// Extract data from XML file
export const extractNFInfoFromXML = async (file: File): Promise<{
  nfInfo: Partial<NotaFiscalVolume>;
  remetente: any;
  destinatario: any;
} | null> => {
  try {
    const xmlData = await parseXmlFile(file);
    if (!xmlData) {
      throw new Error('Não foi possível ler o arquivo XML');
    }
    
    // Navigate through XML structure
    const nfeProc = xmlData.nfeproc || xmlData.nfeProc || {};
    const nfe = nfeProc.nfe || nfeProc.nfe;
    const infNFe = nfe?.infnfe || nfe?.infnfe;
    
    if (!infNFe) {
      throw new Error('Estrutura do XML não reconhecida');
    }
    
    // Extract data from XML
    const ide = infNFe.ide || {};
    const emit = infNFe.emit || {};
    const dest = infNFe.dest || {};
    const total = infNFe.total || {};
    const transp = infNFe.transp || {};
    
    // Helper function to safely extract values
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

    // Extract basic information
    const numeroNF = getValue(ide, ['nnf']) || '';
    const pesoBruto = parseFloat(getValue(transp, ['vol', 'pesob']) || '0');
    const qVol = parseInt(getValue(transp, ['vol', 'qvol']) || '1', 10);
    
    // Extract remetente (sender) information
    const remetente = {
      cnpj: getValue(emit, ['cnpj']),
      nome: getValue(emit, ['xnome']),
      endereco: {
        logradouro: getValue(emit, ['enderemit', 'xlgr']),
        numero: getValue(emit, ['enderemit', 'nro']),
        complemento: getValue(emit, ['enderemit', 'xcpl']),
        bairro: getValue(emit, ['enderemit', 'xbairro']),
        cidade: getValue(emit, ['enderemit', 'xmun']),
        uf: getValue(emit, ['enderemit', 'uf']),
        cep: getValue(emit, ['enderemit', 'cep']),
      },
      enderecoFormatado: '' // Will be populated later
    };
    
    // Extract destinatario (recipient) information
    const destinatario = {
      cnpj: getValue(dest, ['cnpj']),
      cpf: getValue(dest, ['cpf']),
      nome: getValue(dest, ['xnome']),
      endereco: {
        logradouro: getValue(dest, ['enderdest', 'xlgr']),
        numero: getValue(dest, ['enderdest', 'nro']),
        complemento: getValue(dest, ['enderdest', 'xcpl']),
        bairro: getValue(dest, ['enderdest', 'xbairro']),
        cidade: getValue(dest, ['enderdest', 'xmun']),
        uf: getValue(dest, ['enderdest', 'uf']),
        cep: getValue(dest, ['enderdest', 'cep']),
      },
      enderecoFormatado: '' // Will be populated later
    };
    
    // Format addresses for display
    const formatAddress = (endereco: any) => {
      if (!endereco) return '';
      
      const parts = [
        endereco.logradouro,
        endereco.numero ? `nº ${endereco.numero}` : '',
        endereco.complemento,
        endereco.bairro ? `${endereco.bairro},` : '',
        `${endereco.cidade}/${endereco.uf}`,
        endereco.cep ? `CEP: ${endereco.cep.replace(/^(\d{5})(\d{3})$/, '$1-$2')}` : ''
      ].filter(Boolean);
      
      return parts.join(' ');
    };
    
    remetente.enderecoFormatado = formatAddress(remetente.endereco);
    destinatario.enderecoFormatado = formatAddress(destinatario.endereco);
    
    // Create volume data based on transportation information
    const defaultVolume: VolumeItem = {
      id: generateVolumeId(),
      altura: 30, // Default height in cm
      largura: 40, // Default width in cm
      profundidade: 50, // Default depth in cm
      peso: pesoBruto / qVol, // Distribute weight equally among volumes
      quantidade: qVol
    };

    return {
      nfInfo: {
        numeroNF,
        volumes: [defaultVolume]
      },
      remetente,
      destinatario
    };
  } catch (error) {
    console.error('Erro ao processar XML:', error);
    toast({
      title: 'Erro ao processar XML',
      description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido',
      variant: 'destructive'
    });
    return null;
  }
};

// Process multiple XML files
export const processMultipleXMLFiles = async (files: FileList): Promise<{
  notasFiscais: NotaFiscalVolume[];
  remetente: any;
  destinatario: any;
}> => {
  const notasFiscais: NotaFiscalVolume[] = [];
  let firstRemetente: any = null;
  let firstDestinatario: any = null;
  let hasConflictingAddresses = false;
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.type === 'text/xml') {
      const result = await extractNFInfoFromXML(file);
      
      if (result && result.nfInfo && result.nfInfo.numeroNF) {
        notasFiscais.push({
          numeroNF: result.nfInfo.numeroNF,
          volumes: result.nfInfo.volumes || []
        });
        
        // Store the first remetente and destinatario for comparison
        if (!firstRemetente) {
          firstRemetente = result.remetente;
          firstDestinatario = result.destinatario;
        } else {
          // Check if the current remetente and destinatario match the first ones
          const remetenteMismatch = firstRemetente.cnpj !== result.remetente.cnpj;
          const destinatarioMismatch = firstDestinatario.cnpj !== result.destinatario.cnpj && 
                                      firstDestinatario.cpf !== result.destinatario.cpf;
          
          if (remetenteMismatch || destinatarioMismatch) {
            hasConflictingAddresses = true;
          }
        }
      }
    }
  }
  
  if (hasConflictingAddresses) {
    toast({
      title: "Atenção",
      description: "Foram detectadas notas fiscais com remetentes ou destinatários diferentes. Elas devem ser incluídas em solicitações separadas.",
      variant: "destructive"  // Changed from 'warning' to 'destructive'
    });
  }
  
  return {
    notasFiscais,
    remetente: firstRemetente || {},
    destinatario: firstDestinatario || {}
  };
};

// Generate Excel template for bulk import
export const generateExcelTemplate = (): void => {
  // Create template data
  const templateData = [
    ['Número NF', 'Altura (cm)', 'Largura (cm)', 'Profundidade (cm)', 'Peso (kg)', 'Quantidade', 'CNPJ Remetente', 'CNPJ Destinatário'],
    ['123456789', '30', '40', '50', '10', '1', '12345678000190', '98765432000110'],
    ['', '', '', '', '', '', '', ''],
    ['Observação: Você pode adicionar múltiplos volumes para a mesma NF repetindo o número da NF em linhas diferentes'],
  ];

  // Create CSV content
  const csvContent = templateData.map(row => row.join(',')).join('\n');
  
  // Create a blob with the data
  const blob = new Blob([csvContent], { type: 'text/csv' });
  
  // Create download link
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', 'modelo_importacao_notas_fiscais.csv');
  document.body.appendChild(a);
  
  // Trigger download
  a.click();
  
  // Clean up
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

// Process Excel/CSV file
export const processExcelFile = (file: File): Promise<{
  notasFiscais: NotaFiscalVolume[];
  remetente: any;
  destinatario: any;
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string;
        const lines = csvData.split('\n');
        
        // Skip header row
        const dataRows = lines.slice(1);
        
        // Group by NF number
        const nfMap = new Map<string, VolumeItem[]>();
        let remetenteCNPJ = '';
        let destinatarioCNPJ = '';
        
        dataRows.forEach(row => {
          const columns = row.split(',');
          
          // Skip empty or comment rows
          if (columns.length < 6 || !columns[0].trim() || columns[0].trim().startsWith('Observação')) {
            return;
          }
          
          const nfNumero = columns[0].trim();
          
          // Get CNPJ information from the first valid row
          if (!remetenteCNPJ && columns.length >= 7) {
            remetenteCNPJ = columns[6].trim();
          }
          
          if (!destinatarioCNPJ && columns.length >= 8) {
            destinatarioCNPJ = columns[7].trim();
          }
          
          const volumeItem: VolumeItem = {
            id: generateVolumeId(),
            altura: parseFloat(columns[1]) || 0,
            largura: parseFloat(columns[2]) || 0,
            profundidade: parseFloat(columns[3]) || 0,
            peso: parseFloat(columns[4]) || 0,
            quantidade: parseInt(columns[5]) || 1
          };
          
          if (nfMap.has(nfNumero)) {
            nfMap.get(nfNumero)?.push(volumeItem);
          } else {
            nfMap.set(nfNumero, [volumeItem]);
          }
        });
        
        // Convert map to array of NotaFiscalVolume
        const notasFiscais: NotaFiscalVolume[] = [];
        
        nfMap.forEach((volumes, numeroNF) => {
          notasFiscais.push({
            numeroNF,
            volumes
          });
        });
        
        // Simple remetente and destinatario objects based on CNPJ
        const remetente = {
          cnpj: remetenteCNPJ,
          nome: "Remetente importado via planilha",
        };
        
        const destinatario = {
          cnpj: destinatarioCNPJ,
          nome: "Destinatário importado via planilha",
        };
        
        resolve({
          notasFiscais,
          remetente,
          destinatario
        });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler o arquivo'));
    };
    
    reader.readAsText(file);
  });
};
