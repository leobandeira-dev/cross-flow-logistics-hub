
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { parseXmlFile } from '../../utils/xmlParser';
import { extractDataFromXml } from '../../utils/notaFiscalExtractor';
import { supabase } from '@/integrations/supabase/client';
import { NotaFiscal } from '@/types/supabase.types';
import XMLFileUpload from './XMLFileUpload';

export interface ImportarViaXMLWithSaveProps {
  onFormPopulated: (formData: any) => void;
}

const ImportarViaXMLWithSave: React.FC<ImportarViaXMLWithSaveProps> = ({ 
  onFormPopulated 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    
    try {
      console.log('Processando arquivo XML:', file.name);
      
      const xmlData = await parseXmlFile(file);
      if (xmlData) {
        const extractedData = extractDataFromXml(xmlData);
        console.log('Dados extraídos do XML:', extractedData);
        
        // Populate form with extracted data
        onFormPopulated(extractedData);
        
        // Prepare data for saving to Supabase - using correct field names
        const notaFiscalData: Partial<NotaFiscal> = {
          numero: extractedData.numeroNF || '',
          serie: extractedData.serieNF || '',
          chave_acesso: extractedData.chaveNF || '',
          valor_total: parseFloat(extractedData.valorTotal?.toString() || '0'),
          peso_bruto: parseFloat(extractedData.pesoTotalBruto?.toString() || '0'),
          quantidade_volumes: parseInt(extractedData.volumesTotal?.toString() || '0'),
          data_emissao: extractedData.dataHoraEmissao || new Date().toISOString(),
          
          // Note: The NotaFiscal type doesn't have emitente/destinatario fields
          // These would need to be handled through the relacionamentos if needed
          numero_pedido: extractedData.numeroPedido || '',
          informacoes_complementares: extractedData.informacoesComplementares || '',
          
          status: 'pendente',
          tipo: 'entrada'
        };
        
        console.log('Salvando nota fiscal no Supabase:', notaFiscalData);
        
        // Save to Supabase
        const { data, error } = await supabase
          .from('notas_fiscais')
          .insert(notaFiscalData)
          .select()
          .single();
        
        if (error) {
          console.error('Erro ao salvar nota fiscal:', error);
          toast({
            title: "Erro ao salvar",
            description: `Erro ao salvar nota fiscal no banco de dados: ${error.message}`,
            variant: "destructive"
          });
        } else {
          console.log('Nota fiscal salva com sucesso:', data);
          toast({
            title: "XML processado e salvo",
            description: `Nota fiscal ${extractedData.numeroNF} foi importada e salva com sucesso.`
          });
        }
      }
    } catch (error) {
      console.error('Erro ao processar XML:', error);
      toast({
        title: "Erro",
        description: "Não foi possível processar o arquivo XML. Verifique se o formato está correto.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <XMLFileUpload 
        onFileChange={handleFileUpload} 
        isLoading={isProcessing}
      />
      
      {isProcessing && (
        <div className="text-center text-sm text-gray-600">
          Processando XML e salvando no banco de dados...
        </div>
      )}
    </div>
  );
};

export default ImportarViaXMLWithSave;
