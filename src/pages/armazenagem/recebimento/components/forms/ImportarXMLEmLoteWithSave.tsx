
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { parseXmlFile } from '../../utils/xmlParser';
import { extractDataFromXml } from '../../utils/notaFiscalExtractor';
import { supabase } from '@/integrations/supabase/client';
import { NotaFiscal } from '@/types/supabase.types';
import { Upload, FileText, CheckCircle } from 'lucide-react';

export interface ImportarXMLEmLoteWithSaveProps {
  handleNotasImported: (notas: any[]) => void;
}

const ImportarXMLEmLoteWithSave: React.FC<ImportarXMLEmLoteWithSaveProps> = ({ 
  handleNotasImported 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFiles, setProcessedFiles] = useState<string[]>([]);

  const handleBatchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsProcessing(true);
    setProcessedFiles([]);
    
    const successfulImports: any[] = [];
    
    try {
      for (const file of files) {
        console.log(`Processando arquivo: ${file.name}`);
        
        try {
          const xmlData = await parseXmlFile(file);
          if (xmlData) {
            const extractedData = extractDataFromXml(xmlData);
            
            // Prepare data for saving to Supabase
            const notaFiscalData: Partial<NotaFiscal> = {
              numero: extractedData.numeroNF || '',
              serie: extractedData.serieNF || '',
              chave_acesso: extractedData.chaveNF || '',
              valor_total: parseFloat(extractedData.valorTotal?.toString() || '0'),
              peso_bruto: parseFloat(extractedData.pesoTotalBruto?.toString() || '0'),
              quantidade_volumes: parseInt(extractedData.volumesTotal?.toString() || '0'),
              data_emissao: extractedData.dataHoraEmissao || new Date().toISOString(),
              
              // Emitter data
              emitente_cnpj: extractedData.emitenteCNPJ || '',
              emitente_razao_social: extractedData.emitenteRazaoSocial || '',
              emitente_telefone: extractedData.emitente_telefone || '',
              emitente_uf: extractedData.emitenteUF || '',
              emitente_cidade: extractedData.emitenteCidade || '',
              emitente_bairro: extractedData.emitenteBairro || '',
              emitente_endereco: extractedData.emitenteEndereco || '',
              emitente_numero: extractedData.emitenteNumero || '',
              emitente_cep: extractedData.emitenteCEP || '',
              
              // Recipient data
              destinatario_cnpj: extractedData.destinatarioCNPJ || '',
              destinatario_razao_social: extractedData.destinatarioRazaoSocial || '',
              destinatario_telefone: extractedData.destinatario_telefone || '',
              destinatario_uf: extractedData.destinatarioUF || '',
              destinatario_cidade: extractedData.destinatarioCidade || '',
              destinatario_bairro: extractedData.destinatarioBairro || '',
              destinatario_endereco: extractedData.destinatarioEndereco || '',
              destinatario_numero: extractedData.destinatarioNumero || '',
              destinatario_cep: extractedData.destinatarioCEP || '',
              
              // Additional data
              numero_pedido: extractedData.numeroPedido || '',
              informacoes_complementares: extractedData.informacoesComplementares || '',
              
              status: 'pendente',
              tipo: 'entrada'
            };
            
            // Save to Supabase
            const { data, error } = await supabase
              .from('notas_fiscais')
              .insert(notaFiscalData)
              .select()
              .single();
            
            if (error) {
              console.error(`Erro ao salvar ${file.name}:`, error);
              toast({
                title: "Erro ao salvar",
                description: `Erro ao salvar ${file.name}: ${error.message}`,
                variant: "destructive"
              });
            } else {
              console.log(`${file.name} salvo com sucesso:`, data);
              successfulImports.push(data);
              setProcessedFiles(prev => [...prev, file.name]);
            }
          }
        } catch (fileError) {
          console.error(`Erro ao processar ${file.name}:`, fileError);
          toast({
            title: "Erro no arquivo",
            description: `Erro ao processar ${file.name}. Arquivo pode estar corrompido.`,
            variant: "destructive"
          });
        }
      }
      
      if (successfulImports.length > 0) {
        handleNotasImported(successfulImports);
        toast({
          title: "Importação concluída",
          description: `${successfulImports.length} de ${files.length} arquivos importados com sucesso.`
        });
      }
      
    } catch (error) {
      console.error('Erro na importação em lote:', error);
      toast({
        title: "Erro",
        description: "Erro durante a importação em lote.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <label htmlFor="batch-xml-upload" className="cursor-pointer">
            <span className="mt-2 block text-sm font-medium text-gray-900">
              Selecione múltiplos arquivos XML
            </span>
            <span className="mt-1 block text-sm text-gray-500">
              Arquivos XML de notas fiscais para importação em lote
            </span>
          </label>
          <input
            id="batch-xml-upload"
            name="batch-xml-upload"
            type="file"
            multiple
            accept=".xml"
            className="sr-only"
            onChange={handleBatchUpload}
            disabled={isProcessing}
          />
        </div>
        <div className="mt-4">
          <Button 
            onClick={() => document.getElementById('batch-xml-upload')?.click()}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processando...' : 'Selecionar Arquivos XML'}
          </Button>
        </div>
      </div>
      
      {processedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Arquivos processados:</h4>
          <div className="space-y-1">
            {processedFiles.map((filename, index) => (
              <div key={index} className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                {filename}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {isProcessing && (
        <div className="text-center text-sm text-gray-600">
          Processando arquivos XML e salvando no banco de dados...
        </div>
      )}
    </div>
  );
};

export default ImportarXMLEmLoteWithSave;
