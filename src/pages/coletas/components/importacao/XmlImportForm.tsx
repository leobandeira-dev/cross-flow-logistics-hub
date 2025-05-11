import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { parseNFeXml } from '../../utils/xmlImportHelper';
import { NotaFiscalVolume } from '../../utils/volumeCalculations';

interface XmlImportFormProps {
  onImportSuccess: (notasFiscais: NotaFiscalVolume[], remetenteInfo?: any, destinatarioInfo?: any) => void;
  isSingleFile: boolean;
}

const XmlImportForm: React.FC<XmlImportFormProps> = ({ onImportSuccess, isSingleFile }) => {
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setXmlFile(file);
  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: {
      'text/xml': ['.xml']
    },
    maxFiles: 1
  });

  const handleDragEnter = () => {
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleProcessXML = async (xmlContent: string) => {
    try {
      const result = await parseNFeXml(xmlContent);
      
      if (!result.nfInfo.numeroNF) {
        throw new Error('Não foi possível extrair o número da nota fiscal do XML.');
      }

      // Create a complete NotaFiscalVolume object
      const notaFiscal: NotaFiscalVolume = {
        numeroNF: result.nfInfo.numeroNF,
        volumes: result.nfInfo.volumes || [],
        remetente: result.nfInfo.remetente || result.remetente.nome,
        destinatario: result.nfInfo.destinatario || result.destinatario.nome,
        valorTotal: result.nfInfo.valorTotal || 0
      };
      
      onImportSuccess(
        [notaFiscal],
        result.remetente,
        result.destinatario
      );
      
      // Reset form after successful import
      setXmlFile(null);
      setIsDragging(false);
      
      // Show success message
      toast({
        title: "XML importado com sucesso",
        description: `Nota fiscal ${notaFiscal.numeroNF} importada.`,
      });
    } catch (error: any) {
      toast({
        title: "Erro na importação do XML",
        description: error.message || "Ocorreu um erro ao processar o arquivo XML.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!xmlFile) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo XML para importar.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const xmlContent = e.target?.result as string;
      await handleProcessXML(xmlContent);
    };
    reader.readAsText(xmlFile);
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
          
          {xmlFile ? (
            <p className="text-green-500">Arquivo selecionado: {xmlFile.name}</p>
          ) : (
            <p>
              Arraste e solte o arquivo XML aqui ou clique para selecionar
            </p>
          )}
        </div>
        
        <Button type="submit" className="bg-cross-blue hover:bg-cross-blueDark" disabled={!xmlFile}>
          Importar XML
        </Button>
      </form>
    </div>
  );
};

export default XmlImportForm;
