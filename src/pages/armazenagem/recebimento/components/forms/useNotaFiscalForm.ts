
import { useState } from 'react';
import { NotaFiscalSchemaType } from './notaFiscalSchema';
import { useToast } from "@/hooks/use-toast";

export const useNotaFiscalForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (data: NotaFiscalSchemaType) => {
    console.log('Formulário enviado:', data);
    // Aqui você pode adicionar a lógica para salvar os dados
    toast({
      title: "Nota fiscal enviada",
      description: "Os dados da nota fiscal foram enviados com sucesso.",
    });
  };

  const parseXmlFile = async (file: File): Promise<Record<string, any> | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          try {
            // Usando uma abordagem mais simples para fazer o parse do XML
            const xmlContent = e.target.result as string;
            
            // Parse XML de forma manual
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
            
            if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
              console.error("Erro ao fazer parse do XML: Formato inválido");
              reject(new Error("Formato de XML inválido"));
              return;
            }
            
            console.log("XML parseado com sucesso usando DOMParser");
            const result = xmlToJson(xmlDoc);
            console.log("Convertido para objeto:", result);
            resolve(result);
          } catch (error) {
            console.error("Erro ao processar o XML:", error);
            reject(error);
          }
        } else {
          reject(new Error("Não foi possível ler o conteúdo do arquivo"));
        }
      };
      
      reader.onerror = () => {
        reject(new Error("Erro na leitura do arquivo"));
      };
      
      reader.readAsText(file);
    });
  };
  
  // Função para converter um documento XML em um objeto JavaScript
  const xmlToJson = (xml: Document): Record<string, any> => {
    // Criar uma função para transformar um nó XML em um objeto JSON
    const convertNodeToJson = (node: Node): any => {
      // Elemento básico
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue?.trim();
        return text ? text : null;
      }
      
      // Se for um elemento
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const obj: Record<string, any> = {};
        
        // Adicionar atributos
        if (element.attributes && element.attributes.length > 0) {
          for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            obj[attr.name] = attr.value;
          }
        }
        
        // Processar nós filhos
        for (let i = 0; i < element.childNodes.length; i++) {
          const child = element.childNodes[i];
          
          // Pular nós de texto vazios
          if (child.nodeType === Node.TEXT_NODE && (!child.nodeValue || !child.nodeValue.trim())) {
            continue;
          }
          
          if (child.nodeType === Node.ELEMENT_NODE) {
            const childElement = child as Element;
            const tagName = childElement.tagName.toLowerCase();
            
            // Se o nó já existe, transformá-lo em array
            if (obj[tagName]) {
              if (!Array.isArray(obj[tagName])) {
                obj[tagName] = [obj[tagName]];
              }
              obj[tagName].push(convertNodeToJson(child));
            } else {
              // Caso contrário, adicionar normalmente
              obj[tagName] = convertNodeToJson(child);
            }
          } else if (child.nodeType === Node.TEXT_NODE && child.nodeValue && child.nodeValue.trim()) {
            // Se há apenas texto, usar o valor diretamente
            if (element.childNodes.length === 1) {
              return child.nodeValue.trim();
            }
          }
        }
        
        return obj;
      }
      
      return null;
    };
    
    // Começar com o elemento raiz
    const rootElement = xml.documentElement;
    const result: Record<string, any> = {};
    result[rootElement.tagName.toLowerCase()] = convertNodeToJson(rootElement);
    
    return result;
  };

  const extractDataFromXml = (xmlData: any): Partial<NotaFiscalSchemaType> => {
    try {
      console.log("Tentando extrair dados do XML:", xmlData);
      
      // Navegando pela estrutura do XML usando a nova abordagem
      const nfeProc = xmlData.nfeproc || xmlData.nfeProc || {};
      
      // Acessando o conteúdo do XML de forma mais resiliente
      const nfe = nfeProc.nfe || nfeProc.nfe;
      const infNFe = nfe?.infnfe || nfe?.infnfe;
      
      if (!infNFe) {
        console.error("Estrutura de XML não reconhecida:", xmlData);
        return {};
      }
      
      // Extraindo dados básicos
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
      
      // Função auxiliar para extrair um valor de forma segura
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
      
      // Extraindo dados com a função auxiliar
      return {
        // Dados da nota
        chaveNF: getValue(infNFe, ['id']) || getValue(infNFe, ['Id']),
        numeroNF: getValue(ide, ['nnf']) || getValue(ide, ['nnf']),
        serieNF: getValue(ide, ['serie']),
        dataHoraEmissao: getValue(ide, ['dhemi']) ? 
          new Date(getValue(ide, ['dhemi'])).toISOString().split('T')[0] : '',
        valorTotal: getValue(total, ['icmstot', 'vnf']) || getValue(total, ['icmstot', 'vnf']),
        
        // Dados do emitente
        emitenteCNPJ: getValue(emit, ['cnpj']),
        emitenteRazaoSocial: getValue(emit, ['xnome']),
        emitenteEndereco: `${getValue(emit, ['enderemit', 'xlgr'])}, ${getValue(emit, ['enderemit', 'nro'])}`,
        emitenteBairro: getValue(emit, ['enderemit', 'xbairro']),
        emitenteCidade: getValue(emit, ['enderemit', 'xmun']),
        emitenteUF: getValue(emit, ['enderemit', 'uf']),
        emitenteCEP: getValue(emit, ['enderemit', 'cep']),
        emitenteTelefone: getValue(emit, ['enderemit', 'fone']),
        
        // Dados do destinatário
        destinatarioCNPJ: getValue(dest, ['cnpj']),
        destinatarioRazaoSocial: getValue(dest, ['xnome']),
        destinatarioEndereco: `${getValue(dest, ['enderdest', 'xlgr'])}, ${getValue(dest, ['enderdest', 'nro'])}`,
        destinatarioBairro: getValue(dest, ['enderdest', 'xbairro']),
        destinatarioCidade: getValue(dest, ['enderdest', 'xmun']),
        destinatarioUF: getValue(dest, ['enderdest', 'uf']),
        destinatarioCEP: getValue(dest, ['enderdest', 'cep']),
        destinatarioTelefone: getValue(dest, ['enderdest', 'fone']),
        
        // Informações de transporte
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setValue: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        console.log('Arquivo XML selecionado:', file.name);
        
        const xmlData = await parseXmlFile(file);
        if (xmlData) {
          console.log("XML processado com sucesso, extraindo dados...");
          const extractedData = extractDataFromXml(xmlData);
          console.log("Dados extraídos:", extractedData);
          
          // Preenche os campos do formulário com os dados extraídos
          Object.entries(extractedData).forEach(([field, value]) => {
            if (value) {
              console.log(`Preenchendo campo ${field} com valor:`, value);
              setValue(field, value);
            }
          });
          
          toast({
            title: "XML processado",
            description: "O arquivo XML foi carregado e processado com sucesso.",
          });
        }
      } catch (error) {
        console.error("Erro ao processar o arquivo XML:", error);
        toast({
          title: "Erro",
          description: "Não foi possível processar o arquivo XML. Verifique se o formato está correto.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeySearch = (getValues: any, setValue: any) => {
    const chaveNF = getValues('chaveNF');
    setIsLoading(true);
    
    if (chaveNF) {
      // Simulando uma chamada de API com setTimeout
      setTimeout(() => {
        console.log('Buscando nota fiscal pela chave:', chaveNF);
        // Simular preenchimento de alguns campos
        setValue('numeroNF', '654321');
        setValue('serieNF', '001');
        setValue('dataHoraEmissao', '2023-05-10');
        setValue('valorTotal', '1850.75');
        setValue('emitenteRazaoSocial', 'Fornecedor ABC Ltda');
        setValue('emitenteCNPJ', '12.345.678/0001-90');
        
        toast({
          title: "Nota fiscal encontrada",
          description: "A nota fiscal foi encontrada e os dados foram carregados.",
        });
        setIsLoading(false);
      }, 1500);
    } else {
      toast({
        title: "Erro",
        description: "Por favor, informe a chave de acesso da nota fiscal.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  return {
    handleSubmit,
    handleFileUpload,
    handleKeySearch,
    isLoading
  };
};
