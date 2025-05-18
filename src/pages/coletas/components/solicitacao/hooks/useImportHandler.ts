
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
      // Ensure all notasFiscais have the required properties
      const validatedNotasFiscais: NotaFiscalVolume[] = notasFiscais.map(nf => {
        return {
          numeroNF: nf.numeroNF || '',
          chaveNF: nf.chaveNF || '',
          dataEmissao: nf.dataEmissao || '',
          volumes: Array.isArray(nf.volumes) ? convertVolumesToVolumeItems(nf.volumes) : [],
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
          
          // Set cliente field with sender's name
          updatedData.cliente = remetenteInfo.nome || remetenteInfo.razaoSocial || '';
        }
        
        if (destinatarioInfo) {
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
