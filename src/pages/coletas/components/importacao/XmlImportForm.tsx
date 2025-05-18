
import React, { useCallback, useState } from 'react';
import { Upload, Loader2, FileText } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from '@/hooks/use-toast';
import { extractNFInfoFromXML, processMultipleXMLFiles, processExcelFile } from '../../utils/xmlImportHelper';
import { NotaFiscalVolume, convertVolumesToVolumeItems } from '../../utils/volumeCalculations';

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
            valorTotal: nf.valorTotal || 0
          }));
          
          onImportSuccess(completeNotasFiscais, result.remetente, result.destinatario);
          
          toast({
            title: "Excel importado",
            description: `${completeNotasFiscais.length} notas fiscais importadas com sucesso.`
          });
        }
      } else if (isSingleFile) {
        // Handle single XML file
        const file = acceptedFiles[0];
        const result = await extractNFInfoFromXML(file);
        
        if (result && result.nfInfo && result.nfInfo.numeroNF) {
          const notaFiscal: NotaFiscalVolume = {
            numeroNF: result.nfInfo.numeroNF || '',
            volumes: convertVolumesToVolumeItems(result.nfInfo.volumes || []),
            remetente: result.remetente?.razaoSocial || '',
            destinatario: result.destinatario?.razaoSocial || '',
            valorTotal: result.nfInfo.valorTotal || 0
          };
          
          onImportSuccess([notaFiscal], result.remetente, result.destinatario);
          
          toast({
            title: "XML importado",
            description: `Nota fiscal ${result.nfInfo.numeroNF} importada com sucesso.`
          });
        }
      } else {
        // Handle multiple XML files
        const result = await processMultipleXMLFiles(acceptedFiles);
        
        if (result.notasFiscais.length > 0) {
          // Ensure all notasFiscais have required properties
          const completeNotasFiscais: NotaFiscalVolume[] = result.notasFiscais.map((nf: any) => ({
            numeroNF: nf.numeroNF || '',
            volumes: convertVolumesToVolumeItems(nf.volumes || []),
            remetente: nf.remetente || result.remetente?.razaoSocial || '',
            destinatario: nf.destinatario || result.destinatario?.razaoSocial || '',
            valorTotal: nf.valorTotal || 0
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
