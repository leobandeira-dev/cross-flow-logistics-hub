
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FormItem, FormLabel } from '@/components/ui/form';
import { Upload, Loader2, Printer } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { generateDANFEFromXML, createPDFDataUrl } from '@/pages/armazenagem/recebimento/utils/danfeAPI';

interface ImportarViaXMLProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading?: boolean;
}

const ImportarViaXML: React.FC<ImportarViaXMLProps> = ({ onFileUpload, isLoading = false }) => {
  const [previewLoading, setPreviewLoading] = useState(false);
  const [xmlContent, setXmlContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Call the original onFileUpload function
    onFileUpload(e);
    
    // Additional functionality for DANFE preview
    const file = e.target.files?.[0];
    if (file && file.type === 'text/xml') {
      try {
        setPreviewLoading(true);
        setFileName(file.name);
        
        // Read the XML file
        const content = await readFileAsText(file);
        setXmlContent(content);
        
        toast({
          title: "XML carregado",
          description: `O arquivo ${file.name} foi carregado com sucesso.`,
        });
        
        setPreviewLoading(false);
      } catch (error) {
        console.error('Error reading XML file:', error);
        setPreviewLoading(false);
        toast({
          title: "Erro",
          description: "Não foi possível ler o arquivo XML.",
          variant: "destructive"
        });
      }
    }
  };
  
  const handlePrintDANFE = async () => {
    if (!xmlContent) {
      toast({
        title: "Erro",
        description: "Nenhum arquivo XML carregado.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setPreviewLoading(true);
      toast({
        title: "Gerando DANFE",
        description: "Aguarde enquanto o DANFE está sendo gerado...",
      });
      
      // Generate DANFE from XML
      const pdfBase64 = await generateDANFEFromXML(xmlContent);
      
      if (pdfBase64) {
        // Open PDF in new window
        const dataUrl = createPDFDataUrl(pdfBase64);
        window.open(dataUrl, '_blank');
        
        toast({
          title: "DANFE gerado",
          description: "O DANFE foi aberto em uma nova janela.",
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível gerar o DANFE a partir do XML.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro ao gerar DANFE:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao gerar o DANFE. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setPreviewLoading(false);
    }
  };
  
  // Helper function to read file as text
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <FormItem>
            <FormLabel>Upload de Arquivo XML</FormLabel>
            <div className="flex flex-col items-center justify-center w-full xml-upload-container">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {isLoading || previewLoading ? (
                    <Loader2 className="w-10 h-10 mb-3 text-gray-400 animate-spin" />
                  ) : (
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  )}
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                  </p>
                  <p className="text-xs text-gray-500">XML (MAX. 10MB)</p>
                </div>
                <input 
                  id="dropzone-file" 
                  type="file" 
                  className="hidden" 
                  accept=".xml"
                  onChange={handleFileChange}
                  disabled={isLoading || previewLoading}
                />
              </label>
            </div>
          </FormItem>
          
          {/* Print button that appears when an XML file is loaded */}
          {xmlContent && (
            <div className="flex justify-center mt-4">
              <Button 
                variant="default" 
                onClick={handlePrintDANFE}
                disabled={previewLoading}
                className="gap-2"
              >
                <Printer className="h-4 w-4" />
                Imprimir DANFE ({fileName})
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportarViaXML;
