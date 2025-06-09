import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { OrdemCarregamento, NotaFiscal } from "./types";

export const useOrdemCarregamentoReal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [ordensCarregamento, setOrdensCarregamento] = useState<OrdemCarregamento[]>([]);
  const [notasFiscaisDisponiveis, setNotasFiscaisDisponiveis] = useState<NotaFiscal[]>([]);

  // Buscar ordens de carregamento reais do banco
  const fetchOrdensCarregamento = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Buscando ordens de carregamento...');
      
      const { data, error } = await supabase
        .from('ordens_carregamento')
        .select(`
          *,
          empresa_cliente:empresa_cliente_id(razao_social),
          motorista:motorista_id(nome),
          veiculo:veiculo_id(placa, modelo)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar ordens:', error);
        throw error;
      }

      console.log('Ordens encontradas:', data);

      // Transformar dados para o formato esperado
      const ordensFormatadas: OrdemCarregamento[] = (data || []).map(ordem => ({
        id: ordem.numero_ordem,
        cliente: ordem.empresa_cliente?.razao_social || 'Cliente não identificado',
        tipoCarregamento: ordem.tipo_carregamento || 'normal',
        dataCarregamento: new Date(ordem.data_programada || ordem.created_at).toLocaleDateString('pt-BR'),
        transportadora: 'Transportadora Padrão', // Campo obrigatório na interface
        placaVeiculo: ordem.veiculo?.placa || 'Não definido', // Campo obrigatório na interface
        motorista: ordem.motorista?.nome || 'Não definido',
        status: ordem.status as 'pending' | 'processing' | 'completed',
        volumesTotal: 0, // Será calculado baseado nas etiquetas
        volumesVerificados: 0,
        notasFiscais: []
      }));

      setOrdensCarregamento(ordensFormatadas);
      return ordensFormatadas;
    } catch (error) {
      console.error('Erro ao buscar ordens de carregamento:', error);
      toast({
        title: "Erro ao buscar Ordens de Carregamento",
        description: "Ocorreu um erro ao buscar as ordens de carregamento.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Buscar notas fiscais disponíveis para importação
  const fetchNotasFiscaisDisponiveis = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('Buscando notas fiscais disponíveis...');
      
      const { data, error } = await supabase
        .from('notas_fiscais')
        .select('*')
        .is('ordem_carregamento_id', null) // Notas que ainda não estão em uma ordem
        .eq('status', 'pendente')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar notas fiscais:', error);
        throw error;
      }

      console.log('Notas fiscais encontradas:', data);

      // Transformar dados para o formato esperado
      const notasFormatadas: NotaFiscal[] = (data || []).map(nota => ({
        id: nota.id,
        numero: nota.numero,
        remetente: nota.emitente_razao_social || 'Remetente não identificado', // Campo obrigatório
        cliente: nota.destinatario_razao_social || 'Cliente não identificado',
        pedido: nota.numero_pedido || '',
        dataEmissao: new Date(nota.data_emissao).toLocaleDateString('pt-BR'),
        valor: nota.valor_total,
        pesoBruto: nota.peso_bruto || 0
      }));

      setNotasFiscaisDisponiveis(notasFormatadas);
      return notasFormatadas;
    } catch (error) {
      console.error('Erro ao buscar notas fiscais:', error);
      toast({
        title: "Erro ao buscar Notas Fiscais",
        description: "Ocorreu um erro ao buscar as notas fiscais disponíveis.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Criar nova ordem de carregamento
  const createOrdemCarregamento = useCallback(async (dadosOrdem: any) => {
    setIsLoading(true);
    try {
      console.log('Criando ordem de carregamento:', dadosOrdem);
      
      const { data, error } = await supabase
        .from('ordens_carregamento')
        .insert({
          numero_ordem: `OC-${Date.now()}`,
          tipo_carregamento: dadosOrdem.tipoCarregamento || 'normal',
          empresa_cliente_id: dadosOrdem.clienteId,
          motorista_id: dadosOrdem.motoristaId,
          veiculo_id: dadosOrdem.veiculoId,
          data_programada: dadosOrdem.dataProgramada,
          observacoes: dadosOrdem.observacoes,
          status: 'pendente'
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar ordem:', error);
        throw error;
      }

      console.log('Ordem criada:', data);
      
      toast({
        title: "Ordem de Carregamento criada",
        description: `Ordem ${data.numero_ordem} criada com sucesso.`,
      });

      // Atualizar lista
      await fetchOrdensCarregamento();
      
      return data;
    } catch (error) {
      console.error('Erro ao criar ordem de carregamento:', error);
      toast({
        title: "Erro ao criar Ordem de Carregamento",
        description: "Ocorreu um erro ao criar a ordem de carregamento.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchOrdensCarregamento]);

  // Importar notas fiscais para uma ordem
  const importarNotasFiscais = useCallback(async (ordemId: string, notasIds: string[]) => {
    setIsLoading(true);
    try {
      console.log('Importando notas fiscais:', { ordemId, notasIds });
      
      // Buscar a ordem de carregamento real pelo número
      const { data: ordem, error: errorOrdem } = await supabase
        .from('ordens_carregamento')
        .select('id')
        .eq('numero_ordem', ordemId)
        .single();

      if (errorOrdem || !ordem) {
        throw new Error('Ordem de carregamento não encontrada');
      }

      // Atualizar as notas fiscais para referenciar esta ordem
      const { error: errorUpdate } = await supabase
        .from('notas_fiscais')
        .update({ ordem_carregamento_id: ordem.id })
        .in('id', notasIds);

      if (errorUpdate) {
        console.error('Erro ao vincular notas fiscais:', errorUpdate);
        throw errorUpdate;
      }

      // Criar itens de carregamento
      const itensCarregamento = notasIds.map(notaId => ({
        ordem_carregamento_id: ordem.id,
        nota_fiscal_id: notaId,
        status: 'pendente'
      }));

      const { error: errorItens } = await supabase
        .from('itens_carregamento')
        .insert(itensCarregamento);

      if (errorItens) {
        console.error('Erro ao criar itens de carregamento:', errorItens);
        throw errorItens;
      }

      toast({
        title: "Notas Fiscais importadas",
        description: `${notasIds.length} notas fiscais foram importadas com sucesso.`,
      });

      // Atualizar listas
      await fetchOrdensCarregamento();
      await fetchNotasFiscaisDisponiveis();

    } catch (error) {
      console.error('Erro ao importar notas fiscais:', error);
      toast({
        title: "Erro ao importar Notas Fiscais",
        description: "Ocorreu um erro ao importar as notas fiscais.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchOrdensCarregamento, fetchNotasFiscaisDisponiveis]);

  // Iniciar carregamento
  const iniciarCarregamento = useCallback(async (ordemNumero: string) => {
    try {
      console.log('Iniciando carregamento para ordem:', ordemNumero);
      
      const { error } = await supabase
        .from('ordens_carregamento')
        .update({ 
          status: 'em_carregamento',
          data_inicio: new Date().toISOString()
        })
        .eq('numero_ordem', ordemNumero);

      if (error) {
        console.error('Erro ao iniciar carregamento:', error);
        throw error;
      }

      toast({
        title: "Carregamento iniciado",
        description: `Carregamento da OC ${ordemNumero} iniciado com sucesso.`,
      });

      // Atualizar estado local
      setOrdensCarregamento(prev => 
        prev.map(oc => {
          if (oc.id === ordemNumero) {
            return { ...oc, status: 'processing' as const };
          }
          return oc;
        })
      );

    } catch (error) {
      console.error('Erro ao iniciar carregamento:', error);
      toast({
        title: "Erro ao iniciar carregamento",
        description: "Ocorreu um erro ao iniciar o carregamento.",
        variant: "destructive",
      });
    }
  }, []);

  return {
    isLoading,
    ordensCarregamento,
    notasFiscaisDisponiveis,
    fetchOrdensCarregamento,
    fetchNotasFiscaisDisponiveis,
    createOrdemCarregamento,
    importarNotasFiscais,
    iniciarCarregamento
  };
};
