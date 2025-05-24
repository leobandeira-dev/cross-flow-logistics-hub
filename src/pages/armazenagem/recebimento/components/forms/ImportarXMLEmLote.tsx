
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Upload, Loader2, FileText, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { criarNotaFiscal } from '@/services/notaFiscal/createNotaFiscalService';

interface ImportarXMLEmLoteProps {
  onBatchImport: (files: File[]) => void;
  isLoading?: boolean;
}

const ImportarXMLEmLote: React.FC<ImportarXMLEmLoteProps> = ({ onBatchImport, isLoading = false }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [commonFields, setCommonFields] = useState({
    responsavelEntrega: '',
    motorista: '',
    numeroColeta: '',
    dataEntrada: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const xmlFiles = filesArray.filter(file => file.type === 'text/xml');
      
      if (xmlFiles.length !== filesArray.length) {
        toast({
          title: "Arquivos incompatíveis",
          description: "Apenas arquivos XML são permitidos.",
          variant: "destructive"
        });
      }
      
      setSelectedFiles(prev => [...prev, ...xmlFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const parseXMLData = (xmlContent: string, fileName: string) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
    
    // Check for parsing errors
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      throw new Error(`Erro ao analisar XML ${fileName}: arquivo pode estar corrompido`);
    }

    // Extract data from XML
    const numeroNF = xmlDoc.querySelector('nNF')?.textContent || '';
    const serieNF = xmlDoc.querySelector('serie')?.textContent || '1';
    const chaveNF = xmlDoc.querySelector('chNFe')?.textContent || '';
    const valorTotal = parseFloat(xmlDoc.querySelector('vNF')?.textContent || '0');
    const dataEmissao = xmlDoc.querySelector('dhEmi')?.textContent || '';
    const pesoTotal = parseFloat(xmlDoc.querySelector('pesoB')?.textContent || '0');
    const volumes = parseInt(xmlDoc.querySelector('qVol')?.textContent || '1');

    if (!numeroNF) {
      throw new Error(`Número da nota fiscal não encontrado no XML ${fileName}`);
    }

    return {
      numero: numeroNF,
      serie: serieNF,
      chave_acesso: chaveNF,
      valor_total: valorTotal,
      peso_bruto: pesoTotal,
      quantidade_volumes: volumes,
      data_emissao: dataEmissao ? new Date(dataEmissao).toISOString() : new Date().toISOString(),
      status: 'entrada',
      tipo: 'entrada',
      observacoes: `Importado em lote do arquivo: ${fileName}. Responsável: ${commonFields.responsavelEntrega || 'Não informado'}. Motorista: ${commonFields.motorista || 'Não informado'}.`
    };
  };

  const handleImportBatch = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione pelo menos um arquivo XML para importar.",
        variant: "destructive"
      });
      return;
    }

    setPreviewLoading(true);
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];
    
    try {
      // Process each XML file
      for (const file of selectedFiles) {
        try {
          const xmlContent = await readFileAsText(file);
          const notaFiscalData = parseXMLData(xmlContent, file.name);
          
          // Save to database
          await criarNotaFiscal(notaFiscalData);
          successCount++;
          
        } catch (error) {
          console.error(`Erro ao processar arquivo ${file.name}:`, error);
          errorCount++;
          errors.push(`${file.name}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
        }
      }

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['notas-fiscais'] });

      if (successCount > 0) {
        toast({
          title: "Importação concluída",
          description: `${successCount} arquivo(s) importado(s) com sucesso${errorCount > 0 ? `. ${errorCount} arquivo(s) com erro.` : '.'}`,
        });
      }

      if (errorCount > 0) {
        console.error('Erros na importação:', errors);
        toast({
          title: "Alguns arquivos não foram importados",
          description: `${errorCount} arquivo(s) apresentaram erro. Verifique o console para detalhes.`,
          variant: "destructive"
        });
      }
      
      // Pass files to parent component
      onBatchImport(selectedFiles);
      
      // Clear selected files after import attempt
      setSelectedFiles([]);
      
    } catch (error) {
      console.error("Erro na importação em lote:", error);
      toast({
        title: "Erro na importação",
        description: "Não foi possível processar os arquivos XML.",
        variant: "destructive"
      });
    } finally {
      setPreviewLoading(false);
    }
  };

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
          {/* File upload component */}
          <FormItem>
            <FormLabel>Upload de Arquivos XML em Lote</FormLabel>
            <div className="flex flex-col items-center justify-center w-full">
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
                  <p className="text-xs text-gray-500">XML (Múltiplos arquivos, MAX. 10MB por arquivo)</p>
                </div>
                <input 
                  id="dropzone-file-batch" 
                  type="file" 
                  className="hidden" 
                  accept=".xml"
                  multiple
                  onChange={handleFileChange}
                  disabled={isLoading || previewLoading}
                />
              </label>
            </div>
          </FormItem>

          {/* Selected files list */}
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
                      disabled={isLoading || previewLoading}
                    >
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Common fields section */}
          <div className="mt-6 border rounded-md p-4 bg-gray-50">
            <h3 className="text-sm font-medium mb-4">Campos comuns (serão aplicados a todas as notas)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Responsável pela entrega</FormLabel>
                <Input 
                  placeholder="Nome do responsável" 
                  value={commonFields.responsavelEntrega}
                  onChange={(e) => setCommonFields(prev => ({ ...prev, responsavelEntrega: e.target.value }))}
                />
              </FormItem>
              
              <FormItem>
                <FormLabel>Motorista</FormLabel>
                <Input 
                  placeholder="Nome do motorista" 
                  value={commonFields.motorista}
                  onChange={(e) => setCommonFields(prev => ({ ...prev, motorista: e.target.value }))}
                />
              </FormItem>
              
              <FormItem>
                <FormLabel>Número da coleta</FormLabel>
                <Input 
                  placeholder="Nº da coleta" 
                  value={commonFields.numeroColeta}
                  onChange={(e) => setCommonFields(prev => ({ ...prev, numeroColeta: e.target.value }))}
                />
              </FormItem>
              
              <FormItem>
                <FormLabel>Data de entrada</FormLabel>
                <Input 
                  type="datetime-local" 
                  value={commonFields.dataEntrada}
                  onChange={(e) => setCommonFields(prev => ({ ...prev, dataEntrada: e.target.value }))}
                />
              </FormItem>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end mt-4">
            <Button
              variant="default"
              disabled={isLoading || previewLoading || selectedFiles.length === 0}
              onClick={handleImportBatch}
              className="bg-cross-blue hover:bg-cross-blue/90"
            >
              {isLoading || previewLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                'Importar XML em Lote'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportarXMLEmLote;
