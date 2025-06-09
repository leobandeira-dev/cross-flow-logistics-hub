
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Package, Truck } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useOrdemCarregamento } from '@/hooks/carregamento';
import { OrdemCarregamento } from '@/hooks/carregamento/types';
import TruckLayoutGrid from '@/components/carregamento/enderecamento/TruckLayoutGrid';
import VolumeList from '@/components/carregamento/enderecamento/VolumeList';
import InstructionsCard from '@/components/carregamento/enderecamento/InstructionsCard';

interface Volume {
  id: string;
  codigo: string;
  notaFiscal: string;
  produto: string;
  peso: number;
  dimensoes: string;
  fragil: boolean;
  posicaoAtual?: string;
}

const Enderecamento: React.FC = () => {
  const [numeroOC, setNumeroOC] = useState('');
  const [ordemSelecionada, setOrdemSelecionada] = useState<OrdemCarregamento | null>(null);
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [volumeSelecionado, setVolumeSelecionado] = useState<Volume | null>(null);
  const [posicaoSelecionada, setPosicaoSelecionada] = useState<string | null>(null);
  const [filtroVolume, setFiltroVolume] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { buscarOrdemPorNumero } = useOrdemCarregamento();

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
        await carregarVolumesParaEnderecamento(ordem.id);
        
        toast({
          title: "Ordem carregada",
          description: `OC ${numeroOC} carregada para endereçamento.`,
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

  const carregarVolumesParaEnderecamento = async (numeroOrdem: string) => {
    try {
      // Simular busca de volumes prontos para endereçamento
      const volumesMock: Volume[] = [
        {
          id: 'VOL-001',
          codigo: 'ETQ-001',
          notaFiscal: 'NF-12345',
          produto: 'Produto A',
          peso: 15.5,
          dimensoes: '30x20x15cm',
          fragil: false
        },
        {
          id: 'VOL-002',
          codigo: 'ETQ-002',
          notaFiscal: 'NF-12345',
          produto: 'Produto B - Frágil',
          peso: 8.2,
          dimensoes: '25x25x10cm',
          fragil: true
        },
        {
          id: 'VOL-003',
          codigo: 'ETQ-003',
          notaFiscal: 'NF-12346',
          produto: 'Produto C',
          peso: 22.8,
          dimensoes: '40x30x20cm',
          fragil: false,
          posicaoAtual: 'A1'
        }
      ];

      setVolumes(volumesMock);
      
      toast({
        title: "Volumes carregados",
        description: `${volumesMock.length} volumes disponíveis para endereçamento.`,
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

  const handleSelecionarVolume = (volume: Volume) => {
    setVolumeSelecionado(volume);
    setPosicaoSelecionada(null);
  };

  const handleSelecionarPosicao = (posicao: string) => {
    setPosicaoSelecionada(posicao);
  };

  const handleConfirmarEnderecamento = () => {
    if (!volumeSelecionado || !posicaoSelecionada) {
      toast({
        title: "Seleção incompleta",
        description: "Selecione um volume e uma posição para confirmar o endereçamento.",
        variant: "destructive",
      });
      return;
    }

    // Atualizar o volume com a nova posição
    setVolumes(prevVolumes =>
      prevVolumes.map(volume =>
        volume.id === volumeSelecionado.id
          ? { ...volume, posicaoAtual: posicaoSelecionada }
          : volume
      )
    );

    toast({
      title: "Endereçamento confirmado",
      description: `Volume ${volumeSelecionado.codigo} endereçado para posição ${posicaoSelecionada}.`,
    });

    // Limpar seleções
    setVolumeSelecionado(null);
    setPosicaoSelecionada(null);
  };

  const volumesFiltrados = volumes.filter(volume =>
    volume.codigo.toLowerCase().includes(filtroVolume.toLowerCase()) ||
    volume.notaFiscal.toLowerCase().includes(filtroVolume.toLowerCase()) ||
    volume.produto.toLowerCase().includes(filtroVolume.toLowerCase())
  );

  const volumesEndereçados = volumes.filter(v => v.posicaoAtual);
  const volumesPendentes = volumes.filter(v => !v.posicaoAtual);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <MapPin className="mr-2 text-cross-blue" size={24} />
            Endereçamento de Carregamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="numeroOC">Número da OC</Label>
              <Input
                id="numeroOC"
                placeholder="Digite o número da Ordem de Carregamento"
                value={numeroOC}
                onChange={(e) => setNumeroOC(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && buscarOrdemCarregamento()}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={buscarOrdemCarregamento}
                disabled={isLoading}
                className="bg-cross-blue hover:bg-cross-blue/90"
              >
                <Search className="h-4 w-4 mr-2" />
                {isLoading ? 'Buscando...' : 'Buscar Ordem'}
              </Button>
            </div>
          </div>

          {ordemSelecionada && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Total de Volumes</p>
                      <p className="text-2xl font-bold">{volumes.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Truck className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Endereçados</p>
                      <p className="text-2xl font-bold">{volumesEndereçados.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium">Pendentes</p>
                      <p className="text-2xl font-bold">{volumesPendentes.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {ordemSelecionada && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Volumes Disponíveis</span>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Filtrar volumes..."
                      value={filtroVolume}
                      onChange={(e) => setFiltroVolume(e.target.value)}
                      className="w-48"
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VolumeList
                  volumes={volumesFiltrados}
                  volumeSelecionado={volumeSelecionado}
                  onSelecionarVolume={handleSelecionarVolume}
                />
              </CardContent>
            </Card>

            <InstructionsCard />
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Layout do Caminhão</span>
                  {volumeSelecionado && (
                    <Button
                      onClick={handleConfirmarEnderecamento}
                      disabled={!posicaoSelecionada}
                      className="bg-cross-blue hover:bg-cross-blue/90"
                    >
                      Confirmar Endereçamento
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {volumeSelecionado && (
                  <div className="mb-4 p-3 border rounded-lg bg-blue-50">
                    <p className="text-sm font-medium">Volume selecionado:</p>
                    <p className="text-lg">{volumeSelecionado.codigo} - {volumeSelecionado.produto}</p>
                    <p className="text-sm text-gray-600">
                      Peso: {volumeSelecionado.peso}kg | {volumeSelecionado.dimensoes}
                      {volumeSelecionado.fragil && " | FRÁGIL"}
                    </p>
                  </div>
                )}

                <TruckLayoutGrid
                  volumes={volumes}
                  posicaoSelecionada={posicaoSelecionada}
                  onSelecionarPosicao={handleSelecionarPosicao}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enderecamento;
