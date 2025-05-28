
import { useNavigate } from 'react-router-dom';
import { NotaFiscal } from '@/types/supabase.types';

export const useNotasNavigation = () => {
  const navigate = useNavigate();

  const handleGerarEtiquetasClick = (nota: NotaFiscal) => {
    console.log("Nota sendo passada para geração de etiquetas:", nota);
    
    // Calculate or extract volumesTotal based on available information
    let volumesTotal = '';
    
    if (nota.quantidade_volumes) {
      volumesTotal = String(nota.quantidade_volumes);
    }
    
    console.log("Volume total extracted for etiquetas:", volumesTotal);
    
    // Navigate to GeracaoEtiquetas with complete nota data
    navigate('/armazenagem/recebimento/etiquetas', { 
      state: {
        notaFiscal: nota.numero,
        numeroPedido: nota.numero_pedido || '',
        volumesTotal: volumesTotal,
        // Sender data
        remetente: nota.emitente_razao_social || '',
        emitente: nota.emitente_razao_social || '',
        // Recipient data - ensure all required fields are included
        destinatario: nota.destinatario_razao_social || '',
        endereco: nota.destinatario_endereco || '',
        cidade: nota.destinatario_cidade || '',
        cidadeCompleta: `${nota.destinatario_cidade || ''} - ${nota.destinatario_uf || ''}`,
        uf: nota.destinatario_uf || '',
        // Weight information
        pesoTotal: nota.peso_bruto ? `${nota.peso_bruto} Kg` : '',
        chaveNF: nota.chave_acesso || '',
        // Additional recipient address details
        enderecoDestinatario: nota.destinatario_endereco || '',
        bairroDestinatario: nota.destinatario_bairro || '',
        cidadeDestinatario: nota.destinatario_cidade || '',
        cepDestinatario: nota.destinatario_cep || '',
        ufDestinatario: nota.destinatario_uf || '',
        // Date information
        dataEmissao: nota.data_emissao || '',
      }
    });
  };

  return {
    handleGerarEtiquetasClick
  };
};
