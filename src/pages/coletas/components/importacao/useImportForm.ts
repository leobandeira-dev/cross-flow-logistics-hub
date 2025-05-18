
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { NotaFiscalVolume, ensureCompleteNotaFiscal, convertVolumesToVolumeItems } from '../../utils/volumeCalculations';
import { extractNFInfoFromXML, processMultipleXMLFiles, generateExcelTemplate, processExcelFile } from '../../utils/xmlImportHelper';

interface SolicitacaoForm {
  cliente: string;
  origem: string;
  destino: string;
  dataColeta: string;
  horaColeta: string;
  dataAprovacao: string;
  horaAprovacao: string;
  dataInclusao: string;
  horaInclusao: string;
  origemEndereco: string;
  origemCEP: string;
  destinoEndereco: string;
  destinoCEP: string;
  observacoes: string;
  notasFiscais: NotaFiscalVolume[];
  remetente_cnpj?: string;
  destinatario_cnpj?: string;
  remetenteInfo?: any;
  destinatarioInfo?: any;
}

export const useImportForm = (setIsOpen: (open: boolean) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SolicitacaoForm>({
    cliente: '',
    origem: '',
    destino: '',
    dataColeta: '',
    horaColeta: '',
    dataAprovacao: '',
    horaAprovacao: '',
    dataInclusao: new Date().toISOString().split('T')[0], // Current date
    horaInclusao: new Date().toTimeString().split(' ')[0].slice(0, 5), // Current time
    origemEndereco: '',
    origemCEP: '',
    destinoEndereco: '',
    destinoCEP: '',
    observacoes: '',
    notasFiscais: []
  });

  const handleInputChange = (field: keyof SolicitacaoForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setIsLoading(true);
    
    // Validate required fields
    if (!formData.cliente) {
      toast({
        title: "Campo obrigatório",
        description: "Selecione um cliente.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (!formData.origem || !formData.destino) {
      toast({
        title: "Campos obrigatórios",
        description: "Informe os endereços de origem e destino.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (!formData.dataColeta) {
      toast({
        title: "Campo obrigatório",
        description: "Informe a data da coleta.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (formData.notasFiscais.length === 0) {
      toast({
        title: "Nenhuma nota fiscal",
        description: "Adicione pelo menos uma nota fiscal para continuar.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Submit form
    setTimeout(() => {
      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de coleta foi registrada com sucesso."
      });
      setIsLoading(false);
      setFormData({
        cliente: '',
        origem: '',
        destino: '',
        dataColeta: '',
        horaColeta: '',
        dataAprovacao: '',
        horaAprovacao: '',
        dataInclusao: new Date().toISOString().split('T')[0],
        horaInclusao: new Date().toTimeString().split(' ')[0].slice(0, 5),
        origemEndereco: '',
        origemCEP: '',
        destinoEndereco: '',
        destinoCEP: '',
        observacoes: '',
        notasFiscais: []
      });
      setIsOpen(false);
    }, 1500);
  };

  // Handler for XML file upload in "NF Única" tab
  const handleSingleXmlUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsLoading(true);
    
    try {
      const result = await extractNFInfoFromXML(file);
      if (result && result.nfInfo && result.nfInfo.numeroNF) {
        // Ensure we create a complete NotaFiscalVolume object
        const completeNotaFiscal = ensureCompleteNotaFiscal({
          numeroNF: result.nfInfo.numeroNF || '',
          volumes: result.nfInfo.volumes || [],
          remetente: result.remetente?.razaoSocial || '',
          destinatario: result.destinatario?.razaoSocial || '',
          valorTotal: result.nfInfo.valorTotal || 0,
          pesoTotal: result.nfInfo.pesoTotal || 0,
          // Add address fields
          enderecoRemetente: result.remetente?.endereco?.logradouro,
          cepRemetente: result.remetente?.endereco?.cep,
          cidadeRemetente: result.remetente?.endereco?.cidade,
          ufRemetente: result.remetente?.endereco?.uf,
          enderecoDestinatario: result.destinatario?.endereco?.logradouro,
          cepDestinatario: result.destinatario?.endereco?.cep,
          cidadeDestinatario: result.destinatario?.endereco?.cidade,
          ufDestinatario: result.destinatario?.endereco?.uf
        });
        
        // Update form data with XML results
        setFormData(prev => ({
          ...prev,
          notasFiscais: [completeNotaFiscal],
          remetenteInfo: result.remetente,
          destinatarioInfo: result.destinatario,
          origem: `${result.remetente?.endereco?.cidade} - ${result.remetente?.endereco?.uf}` || prev.origem,
          destino: `${result.destinatario?.endereco?.cidade} - ${result.destinatario?.endereco?.uf}` || prev.destino,
          origemEndereco: result.remetente?.endereco?.logradouro || '',
          origemCEP: result.remetente?.endereco?.cep || '',
          destinoEndereco: result.destinatario?.endereco?.logradouro || '',
          destinoCEP: result.destinatario?.endereco?.cep || '',
          remetente_cnpj: result.remetente?.cnpj,
          destinatario_cnpj: result.destinatario?.cnpj || result.destinatario?.cpf
        }));
        
        toast({
          title: "XML importado",
          description: `Nota fiscal ${result.nfInfo.numeroNF} importada com sucesso.`
        });
      }
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

  // Handler for batch XML upload
  const handleBatchXmlUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsLoading(true);
    
    try {
      const result = await processMultipleXMLFiles(files);
      
      if (result.notasFiscais.length > 0) {
        // Ensure each nota fiscal has all required properties
        const completeNotasFiscais = result.notasFiscais.map(nf => 
          ensureCompleteNotaFiscal({
            numeroNF: nf.numeroNF || '',
            volumes: nf.volumes || [],
            remetente: nf.remetente || result.remetente?.razaoSocial || '',
            destinatario: nf.destinatario || result.destinatario?.razaoSocial || '',
            valorTotal: nf.valorTotal || 0,
            pesoTotal: nf.pesoTotal || 0,
            // Add address fields
            enderecoRemetente: nf.enderecoRemetente || result.remetente?.endereco?.logradouro,
            cepRemetente: nf.cepRemetente || result.remetente?.endereco?.cep,
            cidadeRemetente: nf.cidadeRemetente || result.remetente?.endereco?.cidade,
            ufRemetente: nf.ufRemetente || result.remetente?.endereco?.uf,
            enderecoDestinatario: nf.enderecoDestinatario || result.destinatario?.endereco?.logradouro,
            cepDestinatario: nf.cepDestinatario || result.destinatario?.endereco?.cep,
            cidadeDestinatario: nf.cidadeDestinatario || result.destinatario?.endereco?.cidade,
            ufDestinatario: nf.ufDestinatario || result.destinatario?.endereco?.uf
          })
        );
        
        // Update form data with batch XML results
        setFormData(prev => ({
          ...prev,
          notasFiscais: completeNotasFiscais,
          remetenteInfo: result.remetente,
          destinatarioInfo: result.destinatario,
          origem: `${result.remetente?.endereco?.cidade} - ${result.remetente?.endereco?.uf}` || prev.origem,
          destino: `${result.destinatario?.endereco?.cidade} - ${result.destinatario?.endereco?.uf}` || prev.destino,
          origemEndereco: result.remetente?.endereco?.logradouro || '',
          origemCEP: result.remetente?.endereco?.cep || '',
          destinoEndereco: result.destinatario?.endereco?.logradouro || '',
          destinoCEP: result.destinatario?.endereco?.cep || '',
          remetente_cnpj: result.remetente?.cnpj,
          destinatario_cnpj: result.destinatario?.cnpj || result.destinatario?.cpf
        }));
        
        toast({
          title: "XML importados",
          description: `${completeNotasFiscais.length} notas fiscais importadas com sucesso.`
        });
      } else {
        toast({
          title: "Atenção",
          description: "Nenhuma nota fiscal válida encontrada nos arquivos XML."
        });
      }
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

  // Handler for Excel file upload
  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsLoading(true);
    
    try {
      const result = await processExcelFile(file);
      
      if (result.notasFiscais.length > 0) {
        // Ensure each nota fiscal has all required properties
        const completeNotasFiscais = result.notasFiscais.map(nf => 
          ensureCompleteNotaFiscal({
            numeroNF: nf.numeroNF || '',
            volumes: nf.volumes || [],
            remetente: nf.remetente || result.remetente?.razaoSocial || '',
            destinatario: nf.destinatario || result.destinatario?.razaoSocial || '',
            valorTotal: nf.valorTotal || 0
          })
        );
        
        setFormData(prev => ({
          ...prev,
          notasFiscais: completeNotasFiscais,
          remetenteInfo: result.remetente,
          destinatarioInfo: result.destinatario,
          remetente_cnpj: result.remetente?.cnpj,
          destinatario_cnpj: result.destinatario?.cnpj || result.destinatario?.cpf
        }));
        
        toast({
          title: "Planilha importada",
          description: `${completeNotasFiscais.length} notas fiscais importadas com sucesso.`
        });
      } else {
        toast({
          title: "Atenção",
          description: "Nenhuma nota fiscal válida encontrada na planilha."
        });
      }
    } catch (error) {
      console.error("Erro ao importar Excel:", error);
      toast({
        title: "Erro",
        description: "Não foi possível importar o arquivo. Verifique se está no formato correto.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to download Excel template
  const handleDownloadTemplate = () => {
    generateExcelTemplate();
  };

  return {
    isLoading,
    formData,
    handleInputChange,
    handleSubmit,
    handleSingleXmlUpload,
    handleBatchXmlUpload,
    handleExcelUpload: processExcelFile,  // Re-export the existing function
    handleDownloadTemplate: generateExcelTemplate  // Re-export the existing function
  };
};
