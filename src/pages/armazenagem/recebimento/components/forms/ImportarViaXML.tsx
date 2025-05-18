
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useXMLUpload } from '../../hooks/useXMLUpload';
import XMLFileUpload from './XMLFileUpload';
import DANFEPreviewButton from './DANFEPreviewButton';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormDescription } from '@/components/ui/form';
import { FileText, Save, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ImportarViaXMLProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading?: boolean;
}

const ImportarViaXML: React.FC<ImportarViaXMLProps> = ({ onFileUpload, isLoading = false }) => {
  const { previewLoading, xmlContent, fileName, handleFileChange, notasFiscais, setNotasFiscais } = useXMLUpload(onFileUpload);
  const [showBatchImport, setShowBatchImport] = useState(false);
  const [manualFields, setManualFields] = useState({
    entregueAoFornecedor: 'nao',
    observacoes: '',
    localArmazenagem: '',
    tempoArmazenamento: ''
  });

  const handleManualFieldChange = (field: string, value: string) => {
    setManualFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyToAll = () => {
    if (!notasFiscais || notasFiscais.length === 0) {
      toast({
        title: "Nenhuma nota importada",
        description: "É necessário importar notas fiscais antes de aplicar campos manuais.",
        variant: "destructive"
      });
      return;
    }
    
    // Apply manual fields to all imported notes
    const updatedNotas = notasFiscais.map(nota => ({
      ...nota,
      entregueAoFornecedor: manualFields.entregueAoFornecedor,
      observacoes: manualFields.observacoes,
      localArmazenagem: manualFields.localArmazenagem,
      tempoArmazenamento: manualFields.tempoArmazenamento
    }));
    
    setNotasFiscais(updatedNotas);
    
    toast({
      title: "Campos aplicados",
      description: `Campos manuais aplicados a ${notasFiscais.length} nota(s) fiscal(is).`
    });
  };

  const toggleBatchImport = () => {
    setShowBatchImport(!showBatchImport);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Importar XML</h3>
            <Button 
              variant="outline"
              size="sm"
              onClick={toggleBatchImport}
            >
              {showBatchImport ? 'Importar Único' : 'Importar em Lote'}
            </Button>
          </div>
          
          {showBatchImport ? (
            <XMLBatchImport isLoading={isLoading || previewLoading} onFileUpload={onFileUpload} />
          ) : (
            <XMLFileUpload 
              onFileChange={handleFileChange}
              isLoading={isLoading || previewLoading}
            />
          )}
          
          {/* Print button that appears when an XML file is loaded */}
          {xmlContent && (
            <DANFEPreviewButton
              xmlContent={xmlContent}
              fileName={fileName}
            />
          )}
          
          <Card className="bg-slate-50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-medium flex items-center">
                  <FileText className="mr-2 text-blue-600" size={18} />
                  Campos para todas as notas
                </h3>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setManualFields({
                        entregueAoFornecedor: 'nao',
                        observacoes: '',
                        localArmazenagem: '',
                        tempoArmazenamento: ''
                      });
                    }}
                  >
                    <X className="mr-1 h-4 w-4" /> Limpar
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleApplyToAll}
                  >
                    <Save className="mr-1 h-4 w-4" /> Aplicar a todos
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <FormLabel>Entregue ao Fornecedor</FormLabel>
                    <Select 
                      value={manualFields.entregueAoFornecedor}
                      onValueChange={(value) => handleManualFieldChange('entregueAoFornecedor', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <FormLabel>Local de Armazenagem</FormLabel>
                    <Input 
                      value={manualFields.localArmazenagem}
                      onChange={(e) => handleManualFieldChange('localArmazenagem', e.target.value)}
                      placeholder="Informe o local de armazenagem"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <FormLabel>Tempo de Armazenamento (horas)</FormLabel>
                    <Input 
                      type="number"
                      value={manualFields.tempoArmazenamento}
                      onChange={(e) => handleManualFieldChange('tempoArmazenamento', e.target.value)}
                      placeholder="Tempo em horas"
                    />
                  </div>
                  
                  <div>
                    <FormLabel>Observações</FormLabel>
                    <Input 
                      value={manualFields.observacoes}
                      onChange={(e) => handleManualFieldChange('observacoes', e.target.value)}
                      placeholder="Observações adicionais"
                    />
                  </div>
                </div>
              </div>
              
              <FormDescription className="mt-2 text-xs">
                Estes campos serão aplicados a todas as notas fiscais importadas em lote
              </FormDescription>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

interface XMLBatchImportProps {
  isLoading: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const XMLBatchImport: React.FC<XMLBatchImportProps> = ({ isLoading, onFileUpload }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <div className="mb-3 flex items-center justify-center">
            <FileText className="h-10 w-10 text-gray-400" />
          </div>
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Clique para selecionar</span> ou arraste e solte
          </p>
          <p className="text-xs text-gray-500">
            XML (Múltiplos arquivos permitidos)
          </p>
        </div>
        <input
          id="dropzone-file-batch"
          type="file"
          className="hidden"
          accept=".xml"
          onChange={onFileUpload}
          disabled={isLoading}
          multiple
        />
      </label>
    </div>
  );
};

export default ImportarViaXML;
