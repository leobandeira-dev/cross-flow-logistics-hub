
import { NotaFiscal } from '@/types/supabase.types';

export const formatarNotasParaTabela = (notas: NotaFiscal[] | null | undefined) => {
  // Garantir que notas seja sempre um array
  if (!Array.isArray(notas)) {
    return [];
  }

  return notas.map(nota => ({
    id: nota.id,
    numero: nota.numero,
    serie: nota.serie || '-',
    chaveAcesso: nota.chave_acesso || '-',
    emitente: nota.emitente_razao_social || '-',
    destinatario: nota.destinatario_razao_social || '-',
    valorTotal: nota.valor_total ? `R$ ${nota.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ 0,00',
    dataEmissao: nota.data_emissao ? new Date(nota.data_emissao).toLocaleDateString('pt-BR') : '-',
    status: nota.status,
    pesoBruto: nota.peso_bruto ? `${nota.peso_bruto} kg` : '-',
    quantidadeVolumes: nota.quantidade_volumes || 0,
    // Dados adicionais para rastreamento
    numeroPedido: nota.numero_pedido || '-',
    transportadora: nota.motorista || '-',
    dataEntrada: nota.data_entrada ? new Date(nota.data_entrada).toLocaleDateString('pt-BR') : '-',
    dataSaida: nota.data_saida ? new Date(nota.data_saida).toLocaleDateString('pt-BR') : '-',
    ordemCarregamentoId: nota.ordem_carregamento_id || null,
    coletaId: nota.coleta_id || null
  }));
};
