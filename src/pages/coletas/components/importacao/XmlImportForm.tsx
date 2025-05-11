
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { processMultipleXMLFiles, extractNFInfoFromXML } from '../../utils/xmlImportHelper';
import { NotaFiscalVolume, convertVolumesToVolumeItems } from '../../utils/volumeCalculations';

interface XmlImportFormProps {
  onImportSuccess: (notasFiscais: NotaFiscalVolume[], remetenteInfo?: any, destinatarioInfo?: any) => void;
  isSingleFile: boolean;
}

const XmlImportForm: React.FC<XmlImportFormProps> = ({ onImportSuccess, isSingleFile }) => {
  const [xmlFiles, setXmlFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (isSingleFile && acceptedFiles.length > 1) {
      toast({
        title: "Seleção única",
        description: "Por favor, selecione apenas um arquivo XML.",
        variant: "destructive",
      });
      setXmlFiles([acceptedFiles[0]]);
    } else {
      setXmlFiles(acceptedFiles);
    }
  }, [isSingleFile]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: {
      'text/xml': ['.xml']
    },
    maxFiles: isSingleFile ? 1 : undefined
  });

  const handleDragEnter = () => {
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (xmlFiles.length === 0) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione pelo menos um arquivo XML para importar.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      if (isSingleFile) {
        // Processar um único arquivo XML
        const result = await extractNFInfoFromXML(xmlFiles[0]);
        
        if (!result.nfInfo.numeroNF) {
          throw new Error('Não foi possível extrair o número da nota fiscal do XML.');
        }

        // Criar objeto NotaFiscalVolume
        const notaFiscal: NotaFiscalVolume = {
          numeroNF: result.nfInfo.numeroNF,
          volumes: result.nfInfo.volumes ? convertVolumesToVolumeItems(result.nfInfo.volumes) : [],
          remetente: result.nfInfo.remetente || result.remetente.nome,
          destinatario: result.nfInfo.destinatario || result.destinatario.nome,
          valorTotal: result.nfInfo.valorTotal || 0
        };
        
        onImportSuccess(
          [notaFiscal],
          result.remetente,
          result.destinatario
        );
        
        toast({
          title: "XML importado com sucesso",
          description: `Nota fiscal ${notaFiscal.numeroNF} importada.`,
        });
      } else {
        // Processar múltiplos arquivos XML
        const result = await processMultipleXMLFiles(xmlFiles as unknown as FileList);
        
        if (result.notasFiscais.length === 0) {
          throw new Error('Não foi possível extrair notas fiscais dos XMLs selecionados.');
        }
        
        // Garantir que cada nota fiscal tem os campos obrigatórios
        const validatedNotasFiscais = result.notasFiscais.map(nf => ({
          ...nf,
          volumes: nf.volumes ? convertVolumesToVolumeItems(nf.volumes) : [],
          remetente: nf.remetente || '',
          destinatario: nf.destinatario || '',
          valorTotal: nf.valorTotal || 0
        }));
        
        onImportSuccess(
          validatedNotasFiscais,
          result.remetente,
          result.destinatario
        );
        
        toast({
          title: "XMLs importados com sucesso",
          description: `${result.notasFiscais.length} notas fiscais importadas.`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro na importação do XML",
        description: error.message || "Ocorreu um erro ao processar o arquivo XML.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setXmlFiles([]);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div 
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${isDragActive || isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
        >
          <input {...getInputProps()} />
          
          {xmlFiles.length > 0 ? (
            <div className="text-green-500">
              <FileText className="h-10 w-10 mx-auto mb-2" />
              {xmlFiles.length === 1 ? (
                <p>Arquivo selecionado: {xmlFiles[0].name}</p>
              ) : (
                <p>{xmlFiles.length} arquivos selecionados</p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-10 w-10 mx-auto text-gray-400" />
              <p>
                {isSingleFile 
                  ? "Arraste e solte um arquivo XML aqui ou clique para selecionar" 
                  : "Arraste e solte arquivos XML aqui ou clique para selecionar"}
              </p>
              <p className="text-xs text-gray-500">Apenas arquivos XML (.xml) são aceitos</p>
            </div>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-cross-blue hover:bg-cross-blueDark" 
          disabled={xmlFiles.length === 0 || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            'Importar XML'
          )}
        </Button>
      </form>
    </div>
  );
};

export default XmlImportForm;
