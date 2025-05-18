
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { NotaFiscalVolume } from '../../../utils/volumes/types';
import { VolumeItem, generateVolumeId } from '../../../utils/volumes/types';
import { InternalFormData } from './solicitacaoFormTypes';
import { convertVolumesToVolumeItems } from '../../../utils/volumes/converters';
import { extractEmpresaInfoFromXML } from '../empresa/empresaUtils';
import { parseXmlFile } from '@/pages/armazenagem/recebimento/utils/xmlParser';
import { extractDataFromXml } from '@/pages/armazenagem/recebimento/utils/notaFiscalExtractor';

export const useImportHandler = (
  setFormData: React.Dispatch<React.SetStateAction<InternalFormData>>
) => {
  const [isImporting, setIsImporting] = useState(false);

  const handleImportSuccess = (notasFiscais: NotaFiscalVolume[] | any[], remetenteInfo?: any, destinatarioInfo?: any) => {
    setIsImporting(true);
    try {
      // Ensure all notasFiscais have the required properties
      const validatedNotasFiscais: NotaFiscalVolume[] = notasFiscais.map(nf => {
        return {
          numeroNF: nf.numeroNF || '',
          chaveNF: nf.chaveNF || '',
          dataEmissao: nf.dataEmissao || '',
          volumes: Array.isArray(nf.volumes) ? convertVolumesToVolumeItems(nf.volumes) : [],
          remetente: nf.remetente || (remetenteInfo?.nome || ''),
          destinatario: nf.destinatario || (destinatarioInfo?.nome || ''),
          valorTotal: nf.valorTotal || 0,
          pesoTotal: nf.pesoTotal || 0,
          emitenteCNPJ: nf.emitenteCNPJ || (remetenteInfo?.cnpj || '')
        };
      });
      
      toast({
        title: "Notas fiscais importadas",
        description: `${validatedNotasFiscais.length} notas fiscais importadas com sucesso.`
      });
      
      // Update all form fields with XML data
      setFormData(prev => {
        // First, update the notasFiscais array
        const updatedData = {
          ...prev,
          notasFiscais: validatedNotasFiscais
        };
        
        // If there's info about the sender/recipient, populate the header fields too
        if (remetenteInfo) {
          updatedData.remetenteInfo = remetenteInfo;
          
          // Convert to proper EmpresaInfo format if needed
          if (remetenteInfo.endereco) {
            updatedData.remetente = extractEmpresaInfoFromXML(remetenteInfo);
          }
          
          // Set origin address fields
          updatedData.origem = `${remetenteInfo.endereco?.cidade || ''} - ${remetenteInfo.endereco?.uf || ''}`;
          updatedData.origemEndereco = remetenteInfo.endereco?.logradouro 
            ? `${remetenteInfo.endereco.logradouro}, ${remetenteInfo.endereco.numero || ''}`
            : '';
          updatedData.origemCEP = remetenteInfo.endereco?.cep || '';
          
          // Set tipoFrete field (default to FOB) instead of cliente
          updatedData.tipoFrete = updatedData.tipoFrete || 'FOB';
        }
        
        if (destinatarioInfo) {
          updatedData.destinatarioInfo = destinatarioInfo;
          
          // Convert to proper EmpresaInfo format if needed
          if (destinatarioInfo.endereco) {
            updatedData.destinatario = extractEmpresaInfoFromXML(destinatarioInfo);
          }
          
          // Set destination address fields
          updatedData.destino = `${destinatarioInfo.endereco?.cidade || ''} - ${destinatarioInfo.endereco?.uf || ''}`;
          updatedData.destinoEndereco = destinatarioInfo.endereco?.logradouro 
            ? `${destinatarioInfo.endereco.logradouro}, ${destinatarioInfo.endereco.numero || ''}`
            : '';
          updatedData.destinoCEP = destinatarioInfo.endereco?.cep || '';
        }
        
        return updatedData;
      });
    } catch (error) {
      console.error("Erro ao processar notas fiscais importadas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível processar as notas fiscais importadas.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Function to handle batch import of XML files
  const handleBatchImport = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione pelo menos um arquivo XML para importar.",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    
    try {
      const notasFiscais: NotaFiscalVolume[] = [];
      let remetenteInfo: any = null;
      let destinatarioInfo: any = null;

      // Process each XML file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        try {
          // Parse XML file
          const xmlData = await parseXmlFile(file);
          if (!xmlData) continue;
          
          // Extract data from XML
          const extractedData = extractDataFromXml(xmlData);
          
          // Create volume with extracted data
          const volume: VolumeItem = {
            id: generateVolumeId(),
            altura: 30, // Default height
            largura: 30, // Default width
            comprimento: 30, // Default length
            quantidade: parseInt(extractedData.volumesTotal) || 1,
            peso: parseFloat(extractedData.pesoTotalBruto || '0'),
          };
          
          // Create nota fiscal object
          const notaFiscal: NotaFiscalVolume = {
            numeroNF: extractedData.numeroNF || '',
            chaveNF: extractedData.chaveNF || '',
            dataEmissao: extractedData.dataHoraEmissao?.split('T')[0] || '',
            volumes: [volume],
            remetente: extractedData.emitenteRazaoSocial || '',
            destinatario: extractedData.destinatarioRazaoSocial || '',
            valorTotal: parseFloat(extractedData.valorTotal || '0'),
            pesoTotal: parseFloat(extractedData.pesoTotalBruto || '0'),
            emitenteCNPJ: extractedData.emitenteCNPJ || ''
          };
          
          // Add to notasFiscais array
          notasFiscais.push(notaFiscal);
          
          // Store remetente and destinatario info from the first valid XML
          if (!remetenteInfo && extractedData.emitenteRazaoSocial) {
            remetenteInfo = {
              nome: extractedData.emitenteRazaoSocial,
              cnpj: extractedData.emitenteCNPJ,
              endereco: {
                logradouro: extractedData.emitenteEndereco,
                numero: extractedData.emitenteNumero,
                complemento: extractedData.emitenteComplemento,
                bairro: extractedData.emitenteBairro,
                cidade: extractedData.emitenteCidade,
                uf: extractedData.emitenteUF,
                cep: extractedData.emitenteCEP
              }
            };
          }
          
          if (!destinatarioInfo && extractedData.destinatarioRazaoSocial) {
            destinatarioInfo = {
              nome: extractedData.destinatarioRazaoSocial,
              cnpj: extractedData.destinatarioCNPJ,
              endereco: {
                logradouro: extractedData.destinatarioEndereco,
                numero: extractedData.destinatarioNumero,
                complemento: extractedData.destinatarioComplemento,
                bairro: extractedData.destinatarioBairro,
                cidade: extractedData.destinatarioCidade,
                uf: extractedData.destinatarioUF,
                cep: extractedData.destinatarioCEP
              }
            };
          }
        } catch (error) {
          console.error(`Erro ao processar arquivo ${file.name}:`, error);
        }
      }

      // Check if we found any valid nota fiscal data
      if (notasFiscais.length === 0) {
        toast({
          title: "Erro",
          description: "Não foi possível extrair dados dos arquivos XML.",
          variant: "destructive"
        });
        return;
      }

      // Process imported notas fiscais
      handleImportSuccess(notasFiscais, remetenteInfo, destinatarioInfo);
    } catch (error) {
      console.error("Erro ao importar XMLs em lote:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao importar os arquivos XML em lote.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  return {
    isImporting,
    handleImportSuccess,
    handleBatchImport
  };
};
