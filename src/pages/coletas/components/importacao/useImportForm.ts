
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { InternalFormData } from '../solicitacao/hooks/solicitacaoFormTypes';
import { EMPTY_EMPRESA } from '../solicitacao/SolicitacaoTypes';

export const useImportForm = (setIsOpen: (isOpen: boolean) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<InternalFormData>({
    remetente: EMPTY_EMPRESA,
    destinatario: EMPTY_EMPRESA,
    dataColeta: '',
    observacoes: '',
    notasFiscais: [],
    cliente: '',
    origem: '',
    destino: ''
  });

  // Handle form input changes
  const handleInputChange = <K extends keyof InternalFormData>(field: K, value: InternalFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle form submission
  const handleSubmit = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de coleta foi enviada com sucesso."
      });
      setIsLoading(false);
      setIsOpen(false);
    }, 1500);
  };

  // Handle single XML file upload
  const handleSingleXmlUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsLoading(true);
    
    try {
      // Simulate processing XML
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "XML importado",
        description: "Nota fiscal importada com sucesso."
      });
      
      // Add dummy data for demonstration
      const dummyNF = {
        numeroNF: '12345',
        chaveNF: '12345678901234567890123456789012345678901234',
        dataEmissao: new Date().toISOString().split('T')[0],
        volumes: [
          { 
            tipo: 'Caixa', 
            quantidade: 2, 
            altura: 10, 
            largura: 20, 
            comprimento: 30, 
            peso: 5 
          }
        ],
        remetente: 'Empresa Remetente',
        destinatario: 'Empresa Destinatário',
        valorTotal: 1000,
        pesoTotal: 5
      };
      
      setFormData(prev => ({
        ...prev,
        notasFiscais: [...prev.notasFiscais, dummyNF]
      }));
      
    } catch (error) {
      console.error("Erro ao importar XML:", error);
      toast({
        title: "Erro",
        description: "Não foi possível importar o arquivo XML.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle batch XML files upload
  const handleBatchXmlUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsLoading(true);
    
    try {
      // Simulate processing XMLs
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "XMLs importados",
        description: `${files.length} notas fiscais importadas com sucesso.`
      });
      
      // Add dummy data for each file
      const dummyNFs = Array.from({ length: files.length }, (_, i) => ({
        numeroNF: `${10000 + i}`,
        chaveNF: `000000000000000000000000000000000000000${i}`,
        dataEmissao: new Date().toISOString().split('T')[0],
        volumes: [
          { 
            tipo: 'Caixa', 
            quantidade: 1, 
            altura: 10, 
            largura: 20, 
            comprimento: 30, 
            peso: 5 
          }
        ],
        remetente: 'Empresa Remetente',
        destinatario: 'Empresa Destinatário',
        valorTotal: 500 + (i * 100),
        pesoTotal: 5 + i
      }));
      
      setFormData(prev => ({
        ...prev,
        notasFiscais: [...prev.notasFiscais, ...dummyNFs]
      }));
      
    } catch (error) {
      console.error("Erro ao importar XMLs em lote:", error);
      toast({
        title: "Erro",
        description: "Não foi possível importar os arquivos XML.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Excel file upload
  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsLoading(true);
    
    try {
      // Simulate processing Excel
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      toast({
        title: "Excel importado",
        description: "Planilha importada com sucesso."
      });
      
      // Add dummy data
      const dummyNFs = Array.from({ length: 3 }, (_, i) => ({
        numeroNF: `${20000 + i}`,
        chaveNF: `111111111111111111111111111111111111111${i}`,
        dataEmissao: new Date().toISOString().split('T')[0],
        volumes: [
          { 
            tipo: 'Caixa', 
            quantidade: 2, 
            altura: 15, 
            largura: 25, 
            comprimento: 35, 
            peso: 7 
          }
        ],
        remetente: 'Empresa Excel Remetente',
        destinatario: 'Empresa Excel Destinatário',
        valorTotal: 750 + (i * 150),
        pesoTotal: 7 + (i * 2)
      }));
      
      setFormData(prev => ({
        ...prev,
        notasFiscais: [...prev.notasFiscais, ...dummyNFs]
      }));
      
    } catch (error) {
      console.error("Erro ao importar Excel:", error);
      toast({
        title: "Erro",
        description: "Não foi possível importar o arquivo Excel.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle downloading Excel template
  const handleDownloadTemplate = () => {
    // This would typically generate and download an Excel template
    toast({
      title: "Download iniciado",
      description: "O modelo de planilha está sendo baixado."
    });
  };

  return {
    isLoading,
    formData,
    handleInputChange,
    handleSubmit,
    handleSingleXmlUpload,
    handleBatchXmlUpload,
    handleExcelUpload,
    handleDownloadTemplate
  };
};
