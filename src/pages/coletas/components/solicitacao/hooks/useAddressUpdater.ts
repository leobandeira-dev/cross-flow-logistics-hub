
import { useEffect } from 'react';
import { InternalFormData } from './solicitacaoFormTypes';

export const useAddressUpdater = (
  formData: InternalFormData,
  setFormData: React.Dispatch<React.SetStateAction<InternalFormData>>
) => {
  // Effect to update remetente/destinatario when XML data changes
  useEffect(() => {
    if (formData.remetenteInfo) {
      const newRemetente = {
        cnpj: formData.remetenteInfo.cnpj || '',
        cpf: formData.remetenteInfo.cpf || '',
        razaoSocial: formData.remetenteInfo.nome || '',
        nomeFantasia: formData.remetenteInfo.nome || '',
        endereco: {
          logradouro: formData.remetenteInfo.endereco?.logradouro || '',
          numero: formData.remetenteInfo.endereco?.numero || '',
          complemento: formData.remetenteInfo.endereco?.complemento || '',
          bairro: formData.remetenteInfo.endereco?.bairro || '',
          cidade: formData.remetenteInfo.endereco?.cidade || '',
          uf: formData.remetenteInfo.endereco?.uf || '',
          cep: formData.remetenteInfo.endereco?.cep || '',
        },
        enderecoFormatado: formData.remetenteInfo.enderecoFormatado || ''
      };
      
      setFormData(prev => ({
        ...prev,
        remetente: newRemetente,
        origem: formData.remetenteInfo.enderecoFormatado || prev.origem
      }));
    }
    
    if (formData.destinatarioInfo) {
      const newDestinatario = {
        cnpj: formData.destinatarioInfo.cnpj || '',
        cpf: formData.destinatarioInfo.cpf || '',
        razaoSocial: formData.destinatarioInfo.nome || '',
        nomeFantasia: formData.destinatarioInfo.nome || '',
        endereco: {
          logradouro: formData.destinatarioInfo.endereco?.logradouro || '',
          numero: formData.destinatarioInfo.endereco?.numero || '',
          complemento: formData.destinatarioInfo.endereco?.complemento || '',
          bairro: formData.destinatarioInfo.endereco?.bairro || '',
          cidade: formData.destinatarioInfo.endereco?.cidade || '',
          uf: formData.destinatarioInfo.endereco?.uf || '',
          cep: formData.destinatarioInfo.endereco?.cep || '',
        },
        enderecoFormatado: formData.destinatarioInfo.enderecoFormatado || ''
      };
      
      setFormData(prev => ({
        ...prev,
        destinatario: newDestinatario,
        destino: formData.destinatarioInfo.enderecoFormatado || prev.destino
      }));
    }
  }, [formData.remetenteInfo, formData.destinatarioInfo, setFormData]);
};
