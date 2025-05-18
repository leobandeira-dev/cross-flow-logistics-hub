
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { NotaFiscalVolume } from '../../../utils/volumes/types';
import { VolumeItem, generateVolumeId } from '../../../utils/volumes/types';
import { InternalFormData } from './solicitacaoFormTypes';
import { convertVolumesToVolumeItems } from '../../../utils/volumes/converters';
import { extractEmpresaInfoFromXML } from '../empresa/empresaUtils';

export const useImportHandler = (
  setFormData: React.Dispatch<React.SetStateAction<InternalFormData>>
) => {
  const [isImporting, setIsImporting] = useState(false);

  const handleImportSuccess = (notasFiscais: NotaFiscalVolume[] | any[], remetenteInfo?: any, destinatarioInfo?: any) => {
    setIsImporting(true);
    try {
      console.log("Import success called with:", { notasFiscais, remetenteInfo, destinatarioInfo });
      
      // Ensure all notasFiscais have the required properties
      const validatedNotasFiscais: NotaFiscalVolume[] = notasFiscais.map(nf => {
        // Make sure volumes array is defined and properly formatted
        const volumes = Array.isArray(nf.volumes) 
          ? convertVolumesToVolumeItems(nf.volumes)
          : [{
              id: generateVolumeId(),
              altura: 30,
              largura: 30,
              comprimento: 30,
              quantidade: 1,
              peso: nf.pesoTotal || 0
            }];
            
        return {
          numeroNF: nf.numeroNF || '',
          chaveNF: nf.chaveNF || '',
          dataEmissao: nf.dataEmissao || '',
          volumes: volumes,
          remetente: nf.remetente || (remetenteInfo?.nome || ''),
          destinatario: nf.destinatario || (destinatarioInfo?.nome || ''),
          valorTotal: nf.valorTotal || 0,
          pesoTotal: nf.pesoTotal || 0,
          emitenteCNPJ: nf.emitenteCNPJ || (remetenteInfo?.cnpj || '')
        };
      });
      
      toast({
        title: "Notas fiscais importadas",
        description: `${validatedNotasFiscais.length} notas fiscais importadas com sucesso.`
      });
      
      // Update all form fields with XML data
      setFormData(prev => {
        // First, update the notasFiscais array
        const updatedData = {
          ...prev,
          notasFiscais: validatedNotasFiscais
        };
        
        // If there's info about the sender/recipient, populate the header fields too
        if (remetenteInfo) {
          console.log("Updating remetente info:", remetenteInfo);
          updatedData.remetenteInfo = remetenteInfo;
          
          // Convert to proper EmpresaInfo format if needed
          if (remetenteInfo.endereco) {
            updatedData.remetente = extractEmpresaInfoFromXML(remetenteInfo);
          }
          
          // Set origin address fields
          updatedData.origem = `${remetenteInfo.endereco?.cidade || ''} - ${remetenteInfo.endereco?.uf || ''}`;
          updatedData.origemEndereco = remetenteInfo.endereco?.logradouro 
            ? `${remetenteInfo.endereco.logradouro}, ${remetenteInfo.endereco.numero || ''}`
            : '';
          updatedData.origemCEP = remetenteInfo.endereco?.cep || '';
          
          // Set tipoFrete field (default to FOB) instead of cliente
          updatedData.tipoFrete = updatedData.tipoFrete || 'FOB';
        }
        
        if (destinatarioInfo) {
          console.log("Updating destinatario info:", destinatarioInfo);
          updatedData.destinatarioInfo = destinatarioInfo;
          
          // Convert to proper EmpresaInfo format if needed
          if (destinatarioInfo.endereco) {
            updatedData.destinatario = extractEmpresaInfoFromXML(destinatarioInfo);
          }
          
          // Set destination address fields
          updatedData.destino = `${destinatarioInfo.endereco?.cidade || ''} - ${destinatarioInfo.endereco?.uf || ''}`;
          updatedData.destinoEndereco = destinatarioInfo.endereco?.logradouro 
            ? `${destinatarioInfo.endereco.logradouro}, ${destinatarioInfo.endereco.numero || ''}`
            : '';
          updatedData.destinoCEP = destinatarioInfo.endereco?.cep || '';
        }
        
        console.log("Updated form data:", updatedData);
        return updatedData;
      });
    } catch (error) {
      console.error("Erro ao processar notas fiscais importadas:", error);
      toast({
        title: "Erro",
        description: "Não foi possível processar as notas fiscais importadas.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  return {
    isImporting,
    handleImportSuccess
  };
};
