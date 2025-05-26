
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Upload, Loader2, CheckCircle } from 'lucide-react';
import { useNotaFiscalImport } from '@/hooks/notaFiscal/useNotaFiscalImport';

interface ImportarViaXMLWithSaveProps {
  onNotasImported: (notas: any[]) => void;
}

const ImportarViaXMLWithSave: React.FC<ImportarViaXMLWithSaveProps> = ({ onNotasImported }) => {
  const { isImporting, importedNotas, importSingleXML, clearImported } = useNotaFiscalImport();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/xml') {
      try {
        const notaImportada = await importSingleXML(file);
        onNotasImported([notaImportada]);
      } catch (error) {
        console.error('Erro na importação:', error);
      }
    }
    
    // Clear the input
    e.target.value = '';
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <FormItem>
            <FormLabel>Upload de Arquivo XML (com salvamento automático)</FormLabel>
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
                  <p className="text-xs text-gray-500">XML (MAX. 10MB)</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".xml"
                  onChange={handleFileChange}
                  disabled={isImporting}
                />
              </label>
            </div>
          </FormItem>

          {importedNotas.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="text-sm font-medium text-green-800">
                  {importedNotas.length} nota(s) fiscal(ais) importada(s) e salva(s)
                </h3>
              </div>
              <div className="space-y-1">
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

export default ImportarViaXMLWithSave;
