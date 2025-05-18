
import React, { useCallback, useState } from 'react';
import { Upload, Loader2, FileText } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from '@/hooks/use-toast';
import { extractNFInfoFromXML, processMultipleXMLFiles, processExcelFile } from '../../utils/xmlImportHelper';
import { NotaFiscalVolume, convertVolumesToVolumeItems } from '../../utils/volumeCalculations';
import { parseXmlFile } from '../../../armazenagem/recebimento/utils/xmlParser';
import { extractDataFromXml } from '../../../armazenagem/recebimento/utils/notaFiscalExtractor';

interface XmlImportFormProps {
  onImportSuccess: (notasFiscais: NotaFiscalVolume[], remetenteInfo?: any, destinatarioInfo?: any) => void;
  isSingleFile?: boolean;
  acceptExcel?: boolean;
  isLoading?: boolean;
}

const XmlImportForm: React.FC<XmlImportFormProps> = ({ 
  onImportSuccess, 
  isSingleFile = true,
  acceptExcel = false,
  isLoading: externalLoading = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const loading = isLoading || externalLoading;
  const [fileCount, setFileCount] = useState(0);

  // Check if all XMLs have the same sender
  const validateSenderConsistency = (notasFiscais: any[]): boolean => {
    if (notasFiscais.length <= 1) return true;
    
    const firstSenderCNPJ = notasFiscais[0].emitenteCNPJ;
    
    for (let i = 1; i < notasFiscais.length; i++) {
      if (notasFiscais[i].emitenteCNPJ !== firstSenderCNPJ) {
        return false;
      }
    }
    
    return true;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (loading) return;
    if (acceptedFiles.length === 0) return;
    
    setIsLoading(true);
    setFileCount(acceptedFiles.length);
    
    try {
      // Handle Excel file
      if (acceptExcel && acceptedFiles[0].name.match(/\.(xlsx|xls|csv)$/i)) {
        const result = await processExcelFile(acceptedFiles[0]);
        
        if (result && result.notasFiscais && result.notasFiscais.length > 0) {
          // Convert to the expected format
          const completeNotasFiscais: NotaFiscalVolume[] = result.notasFiscais.map((nf: any) => ({
            numeroNF: nf.numeroNF || '',
            volumes: convertVolumesToVolumeItems(nf.volumes || []),
            remetente: nf.remetente || result.remetente?.razaoSocial || '',
            destinatario: nf.destinatario || result.destinatario?.razaoSocial || '',
            valorTotal: nf.valorTotal || 0,
            pesoTotal: nf.pesoTotal || 0
          }));
          
          onImportSuccess(completeNotasFiscais, result.remetente, result.destinatario);
          
          toast({
            title: "Excel importado",
            description: `${completeNotasFiscais.length} notas fiscais importadas com sucesso.`
          });
        }
      } else if (isSingleFile) {
        // Handle single XML file using the armazenagem/recebimento extractor
        const file = acceptedFiles[0];
        
        try {
          const xmlData = await parseXmlFile(file);
          if (xmlData) {
            const extractedData = extractDataFromXml(xmlData);
            
            // Create nota fiscal with extracted data
            const notaFiscal: NotaFiscalVolume = {
              numeroNF: extractedData.numeroNF || '',
              chaveNF: extractedData.chaveNF || '',
              dataEmissao: extractedData.dataHoraEmissao || new Date().toISOString(),
              volumes: [],
              remetente: extractedData.emitenteRazaoSocial || '',
              emitenteCNPJ: extractedData.emitenteCNPJ || '',
              destinatario: extractedData.destinatarioRazaoSocial || '',
              valorTotal: parseFloat(extractedData.valorTotal || '0'),
              pesoTotal: parseFloat(extractedData.pesoTotalBruto || '0')
            };
            
            // Add volume if volumesTotal is present
            if (extractedData.volumesTotal && !isNaN(parseInt(extractedData.volumesTotal))) {
              const quantidade = parseInt(extractedData.volumesTotal);
              
              // Create a default volume with quantity from XML
              notaFiscal.volumes = [{
                id: `vol-${Date.now()}`,
                altura: 0,
                largura: 0,
                comprimento: 0,
                quantidade: quantidade,
                peso: 0,
              }];
            }
            
            // Create remetente info
            const remetenteInfo = {
              cnpj: extractedData.emitenteCNPJ || '',
              nome: extractedData.emitenteRazaoSocial || '',
              enderecoFormatado: `${extractedData.emitenteEndereco || ''}, ${extractedData.emitenteNumero || ''} - ${extractedData.emitenteBairro || ''}, ${extractedData.emitenteCidade || ''} - ${extractedData.emitenteUF || ''}`,
              endereco: {
                logradouro: extractedData.emitenteEndereco || '',
                numero: extractedData.emitenteNumero || '',
                complemento: '',
                bairro: extractedData.emitenteBairro || '',
                cidade: extractedData.emitenteCidade || '',
                uf: extractedData.emitenteUF || '',
                cep: extractedData.emitenteCEP || '',
              }
            };
            
            // Create destinatario info
            const destinatarioInfo = {
              cnpj: extractedData.destinatarioCNPJ || '',
              nome: extractedData.destinatarioRazaoSocial || '',
              enderecoFormatado: `${extractedData.destinatarioEndereco || ''}, ${extractedData.destinatarioNumero || ''} - ${extractedData.destinatarioBairro || ''}, ${extractedData.destinatarioCidade || ''} - ${extractedData.destinatarioUF || ''}`,
              endereco: {
                logradouro: extractedData.destinatarioEndereco || '',
                numero: extractedData.destinatarioNumero || '',
                complemento: '',
                bairro: extractedData.destinatarioBairro || '',
                cidade: extractedData.destinatarioCidade || '',
                uf: extractedData.destinatarioUF || '',
                cep: extractedData.destinatarioCEP || '',
              }
            };
            
            onImportSuccess([notaFiscal], remetenteInfo, destinatarioInfo);
            
            toast({
              title: "XML importado",
              description: `Nota fiscal ${notaFiscal.numeroNF} importada com sucesso.`
            });
          }
        } catch (error) {
          console.error("Erro ao processar XML:", error);
          // Try with the old method as fallback
          const result = await extractNFInfoFromXML(file);
          
          if (result && result.nfInfo && result.nfInfo.numeroNF) {
            const notaFiscal: NotaFiscalVolume = {
              numeroNF: result.nfInfo.numeroNF || '',
              volumes: convertVolumesToVolumeItems(result.nfInfo.volumes || []),
              remetente: result.remetente?.razaoSocial || '',
              destinatario: result.destinatario?.razaoSocial || '',
              valorTotal: result.nfInfo.valorTotal || 0,
              pesoTotal: result.nfInfo.pesoTotal || 0
            };
            
            onImportSuccess([notaFiscal], result.remetente, result.destinatario);
            
            toast({
              title: "XML importado",
              description: `Nota fiscal ${result.nfInfo.numeroNF} importada com sucesso.`
            });
          }
        }
      } else {
        // Handle multiple XML files
        const extractedDataList = [];
        
        // Process each XML file with the extractor from armazenagem/recebimento
        for (const file of acceptedFiles) {
          try {
            const xmlData = await parseXmlFile(file);
            if (xmlData) {
              const extractedData = extractDataFromXml(xmlData);
              extractedDataList.push(extractedData);
            }
          } catch (error) {
            console.error(`Error processing XML file ${file.name}:`, error);
          }
        }
        
        // Check if any data was extracted
        if (extractedDataList.length > 0) {
          // Check if all senders are the same
          if (!validateSenderConsistency(extractedDataList)) {
            toast({
              title: "Erro na importação",
              description: "Todas as notas fiscais devem ter o mesmo remetente.",
              variant: "destructive"
            });
            setIsLoading(false);
            return;
          }
          
          // Create notasFiscais
          const notasFiscais: NotaFiscalVolume[] = extractedDataList.map(data => {
            const nf: NotaFiscalVolume = {
              numeroNF: data.numeroNF || '',
              chaveNF: data.chaveNF || '',
              dataEmissao: data.dataHoraEmissao || new Date().toISOString(),
              volumes: [],
              remetente: data.emitenteRazaoSocial || '',
              emitenteCNPJ: data.emitenteCNPJ || '',
              destinatario: data.destinatarioRazaoSocial || '',
              valorTotal: parseFloat(data.valorTotal || '0'),
              pesoTotal: parseFloat(data.pesoTotalBruto || '0')
            };
            
            // Add volume if volumesTotal is present
            if (data.volumesTotal && !isNaN(parseInt(data.volumesTotal))) {
              const quantidade = parseInt(data.volumesTotal);
              
              // Create a default volume with quantity from XML
              nf.volumes = [{
                id: `vol-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                altura: 0,
                largura: 0,
                comprimento: 0,
                quantidade: quantidade,
                peso: 0,
              }];
            }
            
            return nf;
          });
          
          // Get sender and recipient info from first note
          const firstData = extractedDataList[0];
          
          // Create remetente info
          const remetenteInfo = {
            cnpj: firstData.emitenteCNPJ || '',
            nome: firstData.emitenteRazaoSocial || '',
            enderecoFormatado: `${firstData.emitenteEndereco || ''}, ${firstData.emitenteNumero || ''} - ${firstData.emitenteBairro || ''}, ${firstData.emitenteCidade || ''} - ${firstData.emitenteUF || ''}`,
            endereco: {
              logradouro: firstData.emitenteEndereco || '',
              numero: firstData.emitenteNumero || '',
              complemento: '',
              bairro: firstData.emitenteBairro || '',
              cidade: firstData.emitenteCidade || '',
              uf: firstData.emitenteUF || '',
              cep: firstData.emitenteCEP || '',
            }
          };
          
          // Create destinatario info - this can vary
          const destinatarioInfo = {
            cnpj: firstData.destinatarioCNPJ || '',
            nome: firstData.destinatarioRazaoSocial || '',
            enderecoFormatado: `${firstData.destinatarioEndereco || ''}, ${firstData.destinatarioNumero || ''} - ${firstData.destinatarioBairro || ''}, ${firstData.destinatarioCidade || ''} - ${firstData.destinatarioUF || ''}`,
            endereco: {
              logradouro: firstData.destinatarioEndereco || '',
              numero: firstData.destinatarioNumero || '',
              complemento: '',
              bairro: firstData.destinatarioBairro || '',
              cidade: firstData.destinatarioCidade || '',
              uf: firstData.destinatarioUF || '',
              cep: firstData.destinatarioCEP || '',
            }
          };
          
          onImportSuccess(notasFiscais, remetenteInfo, destinatarioInfo);
          
          toast({
            title: "XMLs importados",
            description: `${notasFiscais.length} notas fiscais importadas com sucesso.`
          });
        } else {
          // Fallback to old method
          const result = await processMultipleXMLFiles(acceptedFiles);
          
          if (result.notasFiscais.length > 0) {
            const completeNotasFiscais: NotaFiscalVolume[] = result.notasFiscais.map((nf: any) => ({
              numeroNF: nf.numeroNF || '',
              volumes: convertVolumesToVolumeItems(nf.volumes || []),
              remetente: nf.remetente || result.remetente?.razaoSocial || '',
              destinatario: nf.destinatario || result.destinatario?.razaoSocial || '',
              valorTotal: nf.valorTotal || 0,
              pesoTotal: nf.pesoTotal || 0
            }));
            
            onImportSuccess(completeNotasFiscais, result.remetente, result.destinatario);
            
            toast({
              title: "XMLs importados",
              description: `${completeNotasFiscais.length} notas fiscais importadas com sucesso.`
            });
          } else {
            toast({
              title: "Atenção",
              description: "Nenhuma nota fiscal válida encontrada nos arquivos XML."
            });
          }
        }
      }
    } catch (error) {
      console.error("Erro ao importar arquivo:", error);
      toast({
        title: "Erro",
        description: `Não foi possível importar o arquivo ${acceptExcel ? 'XML/Excel' : 'XML'}.`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setFileCount(0);
    }
  }, [isSingleFile, loading, onImportSuccess, acceptExcel]);

  const getAcceptTypes = () => {
    if (acceptExcel) {
      return {
        'application/xml': ['.xml'],
        'application/vnd.ms-excel': ['.xls', '.xlsx'],
        'text/csv': ['.csv']
      };
    } else {
      return {
        'application/xml': ['.xml'],
      };
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: getAcceptTypes(),
    maxFiles: isSingleFile ? 1 : undefined,
    disabled: loading
  });

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer 
          ${isDragActive ? 'border-cross-blue bg-cross-blue/10' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {loading ? (
            <>
              <Loader2 className="w-10 h-10 mb-3 text-gray-400 animate-spin" />
              <p className="text-sm text-gray-500">Processando {fileCount} arquivo(s)...</p>
            </>
          ) : (
            <>
              {acceptExcel ? 
                <FileText className="w-10 h-10 mb-3 text-gray-400" /> :
                <Upload className="w-10 h-10 mb-3 text-gray-400" />
              }
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
              </p>
              <p className="text-xs text-gray-500">
                {acceptExcel 
                  ? 'Arquivos XML, Excel (.xlsx) ou CSV' 
                  : (isSingleFile 
                    ? 'Arquivo XML da nota fiscal' 
                    : 'Múltiplos arquivos XML (um por nota fiscal)')
                }
              </p>
            </>
          )}
        </div>
        <input {...getInputProps()} />
      </div>
    </div>
  );
};

export default XmlImportForm;
