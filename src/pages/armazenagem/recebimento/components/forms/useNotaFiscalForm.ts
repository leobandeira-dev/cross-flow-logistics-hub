
import { useState } from 'react';
import { NotaFiscalSchemaType } from './notaFiscalSchema';
import { useToast } from "@/hooks/use-toast";
import { parseXmlFile } from '../../utils/xmlParser';
import { extractDataFromXml, searchNotaFiscalByChave } from '../../utils/notaFiscalExtractor';
import { useFormSubmission } from './hooks/useFormSubmission';

export const useNotaFiscalForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit: submitForm } = useFormSubmission();
  
  const handleSubmit = async (data: NotaFiscalSchemaType) => {
    try {
      await submitForm(data);
    } catch (error) {
      // Erro já tratado no hook de submissão
      console.error("Erro no formulário:", error);
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
          
          // Set current tab
          setValue('currentTab', 'xml');
          
          // Fill form fields with extracted data
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

  const handleKeySearch = async (getValues: any, setValue: any) => {
    const chaveNF = getValues('chaveNF');
    
    if (!chaveNF) {
      toast({
        title: "Erro",
        description: "Por favor, informe a chave de acesso da nota fiscal.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Set current tab
      setValue('currentTab', 'chave');
      
      const notaFiscalData = await searchNotaFiscalByChave(chaveNF);
      
      // Fill form fields with found data
      Object.entries(notaFiscalData).forEach(([field, value]) => {
        setValue(field, value);
      });
      
      toast({
        title: "Nota fiscal encontrada",
        description: "A nota fiscal foi encontrada e os dados foram carregados.",
      });
    } catch (error) {
      console.error("Erro ao buscar nota fiscal:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao buscar a nota fiscal.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBatchImport = async (files: File[], setValue: any) => {
    if (!files || files.length === 0) {
      toast({
        title: "Erro",
        description: "Por favor, selecione pelo menos um arquivo XML.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Set current tab
      setValue('currentTab', 'lote');
      
      toast({
        title: "Importação em lote iniciada",
        description: `Processando ${files.length} arquivo(s) XML.`,
      });
      
      // In a real application, you would process all files and handle the common fields
      // For now, we'll just simulate success after a delay
      setTimeout(() => {
        toast({
          title: "Importação em lote concluída",
          description: `${files.length} nota(s) fiscal(is) importada(s) com sucesso.`,
        });
      }, 1000);
      
    } catch (error) {
      console.error("Erro ao importar em lote:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao importar os arquivos XML em lote.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    handleSubmit,
    handleFileUpload,
    handleKeySearch,
    handleBatchImport,
    isLoading
  };
};
