
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
      
      reader.onload = async (e) => {
        if (e.target?.result) {
          try {
            const parser = new xml2js.Parser({ 
              explicitArray: false,
              mergeAttrs: true 
            });
            
            parser.parseString(e.target.result as string, (err: Error | null, result: any) => {
              if (err) {
                console.error("Erro ao fazer parse do XML:", err);
                reject(err);
              } else {
                console.log("XML parseado:", result);
                resolve(result);
              }
            });
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
      // Mapeamento de dados do XML para o schema da nota fiscal
      // Este é um exemplo simplificado, adapte conforme a estrutura real do seu XML
      const nfe = xmlData.nfeProc?.NFe?.infNFe || {};
      const ide = nfe.ide || {};
      const emit = nfe.emit || {};
      const dest = nfe.dest || {};
      const transp = nfe.transp || {};
      
      return {
        // Dados da nota
        numeroNF: ide.nNF || '',
        serieNF: ide.serie || '',
        dataHoraEmissao: ide.dhEmi ? new Date(ide.dhEmi).toISOString().split('T')[0] : '',
        valorTotal: nfe.total?.ICMSTot?.vNF || '',
        
        // Dados do emitente
        emitenteCNPJ: emit.CNPJ || '',
        emitenteRazaoSocial: emit.xNome || '',
        emitenteEndereco: `${emit.enderEmit?.xLgr || ''}, ${emit.enderEmit?.nro || ''}`,
        emitenteBairro: emit.enderEmit?.xBairro || '',
        emitenteCidade: emit.enderEmit?.xMun || '',
        emitenteUF: emit.enderEmit?.UF || '',
        emitenteCEP: emit.enderEmit?.CEP || '',
        
        // Dados do destinatário
        destinatarioCNPJ: dest.CNPJ || '',
        destinatarioRazaoSocial: dest.xNome || '',
        destinatarioEndereco: `${dest.enderDest?.xLgr || ''}, ${dest.enderDest?.nro || ''}`,
        destinatarioBairro: dest.enderDest?.xBairro || '',
        destinatarioCidade: dest.enderDest?.xMun || '',
        destinatarioUF: dest.enderDest?.UF || '',
        destinatarioCEP: dest.enderDest?.CEP || '',
        
        // Informações de transporte
        transportadoraNome: transp.transporta?.xNome || '',
        placaVeiculo: transp.veicTransp?.placa || '',
        quantidadeVolumes: transp.vol?.qVol || '',
        pesoLiquido: transp.vol?.pesoL || '',
        pesoBruto: transp.vol?.pesoB || '',
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
          const extractedData = extractDataFromXml(xmlData);
          
          // Preenche os campos do formulário com os dados extraídos
          Object.entries(extractedData).forEach(([field, value]) => {
            if (value) setValue(field, value);
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
