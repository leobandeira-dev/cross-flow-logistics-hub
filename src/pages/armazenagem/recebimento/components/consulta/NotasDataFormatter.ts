
import { NotaFiscal } from '@/types/supabase.types';

export const formatarNotasParaTabela = (notas: NotaFiscal[]) => {
  return notas.map(nota => ({
    id: nota.id,
    numero: nota.numero,
    fornecedor: nota.emitente_razao_social || 'N/A',
    destinatarioRazaoSocial: nota.destinatario_razao_social || 'N/A',
    valor: nota.valor_total ? `R$ ${nota.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00',
    dataEmissao: nota.data_emissao ? new Date(nota.data_emissao).toLocaleDateString('pt-BR') : 'N/A',
    status: nota.status,
    // Dados originais para etiquetas
    ...nota
  }));
};
