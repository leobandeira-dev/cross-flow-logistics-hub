
import { useState } from 'react';
import { NotaFiscalSchemaType } from './notaFiscalSchema';
import { useToast } from "@/hooks/use-toast";
import * as xml2js from 'xml2js';

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
            const xmlContent = e.target.result as string;
            
            // Usando o método parseString diretamente sem criar instâncias
            xml2js.parseString(
              xmlContent, 
              { 
                explicitArray: false, 
                mergeAttrs: true,
                normalizeTags: true, // Normaliza tags para lowercase
                trim: true // Remove espaços em branco
              }, 
              (err, result) => {
                if (err) {
                  console.error("Erro ao fazer parse do XML:", err);
                  reject(err);
                } else {
                  console.log("XML parseado com sucesso:", result);
                  resolve(result);
                }
              }
            );
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

  const extractDataFromXml = (xmlData: any): Partial<NotaFiscalSchemaType> => {
    try {
      console.log("Tentando extrair dados do XML:", xmlData);
      
      // Tratando diferentes estruturas possíveis do XML
      // Alguns XMLs da NFe podem ter estruturas ligeiramente diferentes
      const nfeProc = xmlData.nfeproc || xmlData.nfeProc || {};
      const nfe = nfeProc.nfe || nfeProc.NFe || {};
      const infNFe = nfe.infnfe || nfe.infNFe || {};
      
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
      
      return {
        // Dados da nota
        chaveNF: infNFe.id || infNFe.Id || '',
        numeroNF: ide.nnf || ide.nNF || '',
        serieNF: ide.serie || '',
        dataHoraEmissao: ide.dhemi || ide.dhEmi ? new Date(ide.dhemi || ide.dhEmi).toISOString().split('T')[0] : '',
        valorTotal: total.icmstot?.vnf || total.ICMSTot?.vNF || '',
        
        // Dados do emitente
        emitenteCNPJ: emit.cnpj || emit.CNPJ || '',
        emitenteRazaoSocial: emit.xnome || emit.xNome || '',
        emitenteEndereco: `${(emit.enderemit?.xlgr || emit.enderEmit?.xLgr || '')}, ${emit.enderemit?.nro || emit.enderEmit?.nro || ''}`,
        emitenteBairro: emit.enderemit?.xbairro || emit.enderEmit?.xBairro || '',
        emitenteCidade: emit.enderemit?.xmun || emit.enderEmit?.xMun || '',
        emitenteUF: emit.enderemit?.uf || emit.enderEmit?.UF || '',
        emitenteCEP: emit.enderemit?.cep || emit.enderEmit?.CEP || '',
        emitenteTelefone: emit.enderemit?.fone || emit.enderEmit?.fone || '',
        
        // Dados do destinatário
        destinatarioCNPJ: dest.cnpj || dest.CNPJ || '',
        destinatarioRazaoSocial: dest.xnome || dest.xNome || '',
        destinatarioEndereco: `${(dest.enderdest?.xlgr || dest.enderDest?.xLgr || '')}, ${dest.enderdest?.nro || dest.enderDest?.nro || ''}`,
        destinatarioBairro: dest.enderdest?.xbairro || dest.enderDest?.xBairro || '',
        destinatarioCidade: dest.enderdest?.xmun || dest.enderDest?.xMun || '',
        destinatarioUF: dest.enderdest?.uf || dest.enderDest?.UF || '',
        destinatarioCEP: dest.enderdest?.cep || dest.enderDest?.CEP || '',
        destinatarioTelefone: dest.enderdest?.fone || dest.enderDest?.fone || '',
        
        // Informações de transporte
        responsavelEntrega: transp.transporta?.xnome || transp.transporta?.xNome || '',
        motorista: transp.veictransp?.placa ? `Placa: ${transp.veictransp?.placa}` : 
                  transp.veicTransp?.placa ? `Placa: ${transp.veicTransp?.placa}` : '',
        volumesTotal: transp.vol?.qvol || transp.vol?.qVol || '',
        pesoTotalBruto: transp.vol?.pesob || transp.vol?.pesoB || '',
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
