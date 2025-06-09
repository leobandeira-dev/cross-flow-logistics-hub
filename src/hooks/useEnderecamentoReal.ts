
import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from '@/hooks/use-toast';

interface Volume {
  id: string;
  codigo: string;
  notaFiscal: string;
  destinatario: string;
  cidade: string;
  peso: string;
  status: string;
  posicao?: string;
}

interface CaminhaoLayout {
  [key: string]: Volume | null;
}

export const useEnderecamentoReal = () => {
  const [ordemSelecionada, setOrdemSelecionada] = useState<string>('');
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [volumesFiltrados, setVolumesFiltrados] = useState<Volume[]>([]);
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [caminhaoLayout, setCaminhaoLayout] = useState<CaminhaoLayout>({});
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Buscar volumes de uma ordem de carregamento
  const buscarVolumesOrdem = useCallback(async (numeroOrdem: string) => {
    setIsLoading(true);
    try {
      console.log('Buscando volumes para ordem:', numeroOrdem);

      // Buscar a ordem de carregamento
      const { data: ordem, error: errorOrdem } = await supabase
        .from('ordens_carregamento')
        .select('id')
        .eq('numero_ordem', numeroOrdem)
        .single();

      if (errorOrdem || !ordem) {
        throw new Error('Ordem de carregamento não encontrada');
      }

      // Buscar notas fiscais da ordem
      const { data: notasFiscais, error: errorNotas } = await supabase
        .from('notas_fiscais')
        .select('id, numero, destinatario_razao_social, destinatario_cidade, destinatario_uf, peso_bruto')
        .eq('ordem_carregamento_id', ordem.id);

      if (errorNotas) {
        throw errorNotas;
      }

      if (!notasFiscais || notasFiscais.length === 0) {
        setVolumes([]);
        setVolumesFiltrados([]);
        return;
      }

      const notasFiscaisIds = notasFiscais.map(nf => nf.id);

      // Buscar etiquetas (volumes) das notas fiscais
      const { data: etiquetas, error: errorEtiquetas } = await supabase
        .from('etiquetas')
        .select('*')
        .in('nota_fiscal_id', notasFiscaisIds)
        .eq('tipo', 'volume');

      if (errorEtiquetas) {
        throw errorEtiquetas;
      }

      console.log('Etiquetas encontradas:', etiquetas);

      // Transformar dados para o formato esperado
      const volumesFormatados: Volume[] = (etiquetas || []).map(etiqueta => {
        const notaFiscal = notasFiscais.find(nf => nf.id === etiqueta.nota_fiscal_id);
        
        return {
          id: etiqueta.id,
          codigo: etiqueta.codigo,
          notaFiscal: notaFiscal?.numero || '',
          destinatario: notaFiscal?.destinatario_razao_social || etiqueta.destinatario || '',
          cidade: notaFiscal?.destinatario_cidade ? 
            `${notaFiscal.destinatario_cidade} - ${notaFiscal.destinatario_uf}` : 
            `${etiqueta.cidade} - ${etiqueta.uf}`,
          peso: etiqueta.peso?.toString() || notaFiscal?.peso_bruto?.toString() || '0',
          status: etiqueta.status || 'disponivel'
        };
      });

      console.log('Volumes formatados:', volumesFormatados);
      setVolumes(volumesFormatados);
      setVolumesFiltrados(volumesFormatados);

    } catch (error) {
      console.error('Erro ao buscar volumes:', error);
      toast({
        title: "Erro ao buscar volumes",
        description: "Ocorreu um erro ao buscar os volumes da ordem.",
        variant: "destructive",
      });
      setVolumes([]);
      setVolumesFiltrados([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Submeter formulário de ordem
  const handleOrderFormSubmit = useCallback(async (data: any) => {
    console.log('Submetendo formulário de ordem:', data);
    const numeroOrdem = data.orderNumber;
    
    if (!numeroOrdem) {
      toast({
        title: "Número da ordem obrigatório",
        description: "Por favor, informe o número da ordem de carregamento.",
        variant: "destructive",
      });
      return;
    }

    setOrdemSelecionada(numeroOrdem);
    await buscarVolumesOrdem(numeroOrdem);
  }, [buscarVolumesOrdem]);

  // Filtrar volumes
  const filtrarVolumes = useCallback((filtro: string) => {
    const volumesFiltrados = volumes.filter(volume => 
      volume.codigo.toLowerCase().includes(filtro.toLowerCase()) ||
      volume.notaFiscal.toLowerCase().includes(filtro.toLowerCase()) ||
      volume.destinatario.toLowerCase().includes(filtro.toLowerCase()) ||
      volume.cidade.toLowerCase().includes(filtro.toLowerCase())
    );
    setVolumesFiltrados(volumesFiltrados);
  }, [volumes]);

  // Toggle seleção de volume
  const toggleSelecao = useCallback((volumeId: string) => {
    setSelecionados(prev => 
      prev.includes(volumeId)
        ? prev.filter(id => id !== volumeId)
        : [...prev, volumeId]
    );
  }, []);

  // Selecionar todos os volumes
  const selecionarTodos = useCallback(() => {
    const todosIds = volumesFiltrados.map(v => v.id);
    setSelecionados(todosIds);
  }, [volumesFiltrados]);

  // Mover volumes selecionados para posição no caminhão
  const moverVolumesSelecionados = useCallback((posicao: string) => {
    if (selecionados.length === 0) return;

    const novoLayout = { ...caminhaoLayout };
    
    selecionados.forEach((volumeId, index) => {
      const volume = volumes.find(v => v.id === volumeId);
      if (volume) {
        const posicaoFinal = selecionados.length > 1 ? `${posicao}-${index + 1}` : posicao;
        novoLayout[posicaoFinal] = { ...volume, posicao: posicaoFinal };
      }
    });

    setCaminhaoLayout(novoLayout);
    setSelecionados([]);

    toast({
      title: "Volumes posicionados",
      description: `${selecionados.length} volume(s) posicionado(s) em ${posicao}.`,
    });
  }, [selecionados, volumes, caminhaoLayout]);

  // Remover volume do caminhão
  const removerVolume = useCallback((posicao: string) => {
    const novoLayout = { ...caminhaoLayout };
    delete novoLayout[posicao];
    setCaminhaoLayout(novoLayout);

    toast({
      title: "Volume removido",
      description: `Volume removido da posição ${posicao}.`,
    });
  }, [caminhaoLayout]);

  // Salvar layout no banco de dados
  const saveLayout = useCallback(async () => {
    if (!ordemSelecionada) {
      toast({
        title: "Ordem não selecionada",
        description: "Selecione uma ordem antes de salvar o layout.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Salvando layout:', caminhaoLayout);

      // Buscar a ordem de carregamento
      const { data: ordem, error: errorOrdem } = await supabase
        .from('ordens_carregamento')
        .select('id')
        .eq('numero_ordem', ordemSelecionada)
        .single();

      if (errorOrdem || !ordem) {
        throw new Error('Ordem de carregamento não encontrada');
      }

      // Criar ou buscar o carregamento
      const { data: carregamento, error: errorCarregamento } = await supabase
        .from('carregamentos')
        .select('id')
        .eq('ordem_carregamento_id', ordem.id)
        .maybeSingle();

      let carregamentoId = carregamento?.id;

      if (!carregamentoId) {
        // Criar novo carregamento
        const { data: novoCarregamento, error: errorNovoCarregamento } = await supabase
          .from('carregamentos')
          .insert({
            ordem_carregamento_id: ordem.id,
            quantidade_volumes: Object.keys(caminhaoLayout).length,
            status: 'em_andamento'
          })
          .select('id')
          .single();

        if (errorNovoCarregamento) {
          throw errorNovoCarregamento;
        }

        carregamentoId = novoCarregamento.id;
      }

      // Limpar endereçamentos anteriores
      await supabase
        .from('enderecamento_caminhao')
        .delete()
        .eq('carregamento_id', carregamentoId);

      // Inserir novos endereçamentos
      const enderecamentos = Object.entries(caminhaoLayout).map(([posicao, volume], index) => ({
        carregamento_id: carregamentoId,
        etiqueta_id: volume!.id,
        posicao,
        ordem: index + 1
      }));

      if (enderecamentos.length > 0) {
        const { error: errorEnderecamento } = await supabase
          .from('enderecamento_caminhao')
          .insert(enderecamentos);

        if (errorEnderecamento) {
          throw errorEnderecamento;
        }
      }

      toast({
        title: "Layout salvo",
        description: "Layout do carregamento salvo com sucesso!",
      });

    } catch (error) {
      console.error('Erro ao salvar layout:', error);
      toast({
        title: "Erro ao salvar layout",
        description: "Ocorreu um erro ao salvar o layout do carregamento.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [ordemSelecionada, caminhaoLayout]);

  // Verificar se todos os volumes estão posicionados
  const allVolumesPositioned = volumes.length > 0 && 
    Object.keys(caminhaoLayout).length === volumes.length;

  return {
    ordemSelecionada,
    volumes,
    volumesFiltrados,
    selecionados,
    caminhaoLayout,
    confirmDialogOpen,
    isLoading,
    setConfirmDialogOpen,
    handleOrderFormSubmit,
    filtrarVolumes,
    toggleSelecao,
    selecionarTodos,
    moverVolumesSelecionados,
    removerVolume,
    saveLayout,
    allVolumesPositioned
  };
};
