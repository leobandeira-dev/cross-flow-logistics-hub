
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { NotaFiscalVolume } from '../../utils/volumeCalculations';
import { extractNFInfoFromXML, processMultipleXMLFiles } from '../../utils/xmlImportHelper';

interface XmlImportFormProps {
  onImportSuccess: (notasFiscais: NotaFiscalVolume[]) => void;
  isSingleFile?: boolean;
}

const XmlImportForm: React.FC<XmlImportFormProps> = ({ onImportSuccess, isSingleFile = true }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleXmlUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    setIsLoading(true);
    
    try {
      if (isSingleFile) {
        const file = e.target.files[0];
        const nfInfo = await extractNFInfoFromXML(file);
        if (nfInfo && nfInfo.numeroNF) {
          onImportSuccess([{
            numeroNF: nfInfo.numeroNF,
            volumes: nfInfo.volumes || []
          }]);
          
          toast({
            title: "XML importado",
            description: `Nota fiscal ${nfInfo.numeroNF} importada com sucesso.`
          });
        }
      } else {
        const importedNFs = await processMultipleXMLFiles(e.target.files);
        
        if (importedNFs.length > 0) {
          onImportSuccess(importedNFs);
          
          toast({
            title: "XML importados",
            description: `${importedNFs.length} notas fiscais importadas com sucesso.`
          });
        } else {
          toast({
            title: "Atenção",
            description: "Nenhuma nota fiscal válida encontrada nos arquivos XML."
          });
        }
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

  return (
    <div className="border rounded-md p-4">
      <Label className="mb-2 block">
        {isSingleFile 
          ? "Importar Nota Fiscal via XML" 
          : "Importar Múltiplas Notas Fiscais via XML"}
      </Label>
      <div className="flex flex-col items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isLoading ? (
              <Loader2 className="w-10 h-10 mb-3 text-gray-400 animate-spin" />
            ) : (
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
            )}
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">
                {isSingleFile ? "Clique para fazer upload" : "Selecione múltiplos arquivos XML"}
              </span>
              {isSingleFile && " ou arraste e solte"}
            </p>
            <p className="text-xs text-gray-500">
              {isSingleFile ? "Arquivo XML da nota fiscal" : "Um arquivo por nota fiscal"}
            </p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept=".xml"
            multiple={!isSingleFile}
            onChange={handleXmlUpload}
            disabled={isLoading}
          />
        </label>
      </div>
    </div>
  );
};

export default XmlImportForm;
