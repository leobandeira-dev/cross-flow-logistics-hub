
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormItem, FormLabel } from '@/components/ui/form';
import { Upload, Loader2, FileText, Trash2, CheckCircle } from 'lucide-react';
import { useNotaFiscalImport } from '@/hooks/notaFiscal/useNotaFiscalImport';

interface ImportarXMLEmLoteWithSaveProps {
  onNotasImported: (notas: any[]) => void;
}

const ImportarXMLEmLoteWithSave: React.FC<ImportarXMLEmLoteWithSaveProps> = ({ onNotasImported }) => {
  const { isImporting, importedNotas, importBatchXML, clearImported } = useNotaFiscalImport();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const xmlFiles = filesArray.filter(file => file.type === 'text/xml');
      
      if (xmlFiles.length !== filesArray.length) {
        console.warn('Apenas arquivos XML são permitidos');
      }
      
      setSelectedFiles(prev => [...prev, ...xmlFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleImportBatch = async () => {
    if (selectedFiles.length === 0) return;
    
    try {
      const notasImportadas = await importBatchXML(selectedFiles);
      onNotasImported(notasImportadas);
      setSelectedFiles([]);
    } catch (error) {
      console.error('Erro na importação em lote:', error);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <FormItem>
            <FormLabel>Upload de Arquivos XML em Lote (com salvamento automático)</FormLabel>
            <div className="flex flex-col items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {isImporting ? (
                    <Loader2 className="w-10 h-10 mb-3 text-gray-400 animate-spin" />
                  ) : (
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  )}
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                  </p>
                  <p className="text-xs text-gray-500">XML (Múltiplos arquivos, MAX. 10MB por arquivo)</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".xml"
                  multiple
                  onChange={handleFileChange}
                  disabled={isImporting}
                />
              </label>
            </div>
          </FormItem>

          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Arquivos selecionados ({selectedFiles.length})</h3>
              <div className="border rounded-md divide-y max-h-60 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="flex items-center justify-between p-3 bg-white">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm truncate max-w-xs">{file.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={isImporting}
                    >
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end mt-4">
                <Button
                  onClick={handleImportBatch}
                  disabled={isImporting || selectedFiles.length === 0}
                  className="bg-cross-blue hover:bg-cross-blue/90"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    'Importar e Salvar XMLs'
                  )}
                </Button>
              </div>
            </div>
          )}

          {importedNotas.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="text-sm font-medium text-green-800">
                  {importedNotas.length} nota(s) fiscal(ais) importada(s) e salva(s)
                </h3>
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {importedNotas.map((nota, index) => (
                  <p key={index} className="text-xs text-green-700">
                    NF: {nota.numero} - Valor: R$ {nota.valor_total?.toFixed(2)}
                  </p>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearImported}
                className="mt-2"
              >
                Limpar Lista
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportarXMLEmLoteWithSave;
