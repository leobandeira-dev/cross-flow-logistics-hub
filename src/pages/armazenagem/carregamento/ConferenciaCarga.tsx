import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, CheckCircle, Package, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useOrdemCarregamento } from '@/hooks/carregamento';
import { OrdemCarregamento } from '@/hooks/carregamento/types';
import { ItemConferencia } from '@/components/carregamento/types/conferencia.types';
import VolumesTable from '@/components/carregamento/VolumesTable';
import BarcodeScannerSection from '@/components/carregamento/BarcodeScannerSection';
import { useEnderecamentoReal } from '@/hooks/carregamento/useEnderecamentoReal';
import Sidebar from "@/components/layout/Sidebar"; // Corrigido
import { Header } from "@/components/layout/Header"; // Corrigido

const ConferenciaCarga: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const [numeroOC, setNumeroOC] = useState('');
  const [ordemSelecionada, setOrdemSelecionada] = useState<OrdemCarregamento | null>(null);
  const [volumes, setVolumes] = useState<ItemConferencia[]>([]);
  const [codigoVolume, setCodigoVolume] = useState('');
  const [codigoNF, setCodigoNF] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { buscarOrdemPorNumero } = useOrdemCarregamento();
  const { buscarVolumesParaEnderecamento, atualizarStatusVolume } = useEnderecamentoReal();

  const buscarOrdemCarregamento = async () => {
    if (!numeroOC.trim()) {
      toast({
        title: "Número da OC é obrigatório",
        description: "Por favor, informe o número da Ordem de Carregamento.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const ordem = await buscarOrdemPorNumero(numeroOC);

      if (ordem) {
        setOrdemSelecionada(ordem);
        await carregarVolumesOrdem(ordem.id);

        toast({
          title: "Ordem de Carregamento encontrada",
          description: `OC ${numeroOC} carregada para conferência.`,
        });
      } else {
        setOrdemSelecionada(null);
        setVolumes([]);
        toast({
          title: "Ordem não encontrada",
          description: `Nenhuma OC encontrada com o número ${numeroOC}.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro ao buscar ordem:', error);
      toast({
        title: "Erro na busca",
        description: "Ocorreu um erro ao buscar a Ordem de Carregamento.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const carregarVolumesOrdem = async (numeroOrdem: string) => {
    try {
      const volumesEncontrados = await buscarVolumesParaEnderecamento(numeroOrdem);

      const volumesConferencia: ItemConferencia[] = volumesEncontrados.map(volume => ({
        id: volume.id,
        produto: volume.produto,
        quantidade: 1,
        verificado: volume.posicaoAtual !== undefined,
        etiquetaMae: volume.codigo,
        notaFiscal: volume.notaFiscal
      }));

      setVolumes(volumesConferencia);

      toast({
        title: "Volumes carregados",
        description: `${volumesConferencia.length} volumes encontrados para conferência.`,
      });
    } catch (error) {
      console.error('Erro ao carregar volumes:', error);
      toast({
        title: "Erro ao carregar volumes",
        description: "Ocorreu um erro ao buscar os volumes da ordem.",
        variant: "destructive",
      });
    }
  };

  const handleVerificarVolume = async (volumeId: string) => {
    setVolumes(prevVolumes =>
      prevVolumes.map(volume =>
        volume.id === volumeId
          ? { ...volume, verificado: true }
          : volume
      )
    );

    await atualizarStatusVolume(volumeId, 'verificado');

    toast({
      title: "Volume verificado",
      description: `Volume ${volumeId} foi marcado como verificado.`,
    });
  };

  const handleRemoverVolume = (volumeId: string) => {
    setVolumes(prevVolumes =>
      prevVolumes.filter(volume => volume.id !== volumeId)
    );

    toast({
      title: "Volume removido",
      description: `Volume ${volumeId} foi removido da conferência.`,
      
export default ConferenciaCarga;