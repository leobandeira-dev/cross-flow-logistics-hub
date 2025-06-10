
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, CheckCircle, Package, AlertCircle, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useOrdemCarregamento } from '@/hooks/carregamento';
import { OrdemCarregamento } from '@/hooks/carregamento/types';
import DataTable from '@/components/common/DataTable';

interface VolumeAgrupado {
  id: string;
  codigo: string;
  descricao: string;
  peso: number;
  status: string;
  notaFiscalNumero: string;
  notaFiscalRemetente: string;
  verificado: boolean;
}

const ConferenciaCarga: React.FC = () => {
  const [numeroOC, setNumeroOC] = useState('');
  const [ordemSelecionada, setOrdemSelecionada] = useState<OrdemCarregamento | null>(null);
  const [volumes, setVolumes] = useState<VolumeAgrupado[]>([]);
  const [codigoVolume, setCodigoVolume] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { buscarOrdemPorNumero, buscarVolumesVinculados } = useOrdemCarregamento();

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
      const volumesEncontrados = await buscarVolumesVinculados(numeroOrdem);
      
      // Converter volumes para formato agrupado
      const volumesAgrupados: VolumeAgrupado[] = volumesEncontrados.map(volume => ({
        id: volume.id,
        codigo: volume.codigo,
        descricao: volume.descricao || 'Descrição não informada',
        peso: volume.peso || 0,
        status: volume.status,
        notaFiscalNumero: volume.notaFiscalNumero,
        notaFiscalRemetente: volume.notaFiscalRemetente,
        verificado: volume.status === 'verificado' || volume.status === 'posicionado'
      }));

      setVolumes(volumesAgrupados);
      
      toast({
        title: "Volumes carregados",
        description: `${volumesAgrupados.length} volumes encontrados para conferência.`,
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
          ? { ...volume, verificado: true, status: 'verificado' }
          : volume
      )
    );

    toast({
      title: "Volume verificado",
      description: `Volume ${volumeId} foi marcado como verificado.`,
    });
  };

  const handleScanVolume = (codigo: string) => {
    const volume = volumes.find(v => v.codigo === codigo);
    if (volume) {
      if (!volume.verificado) {
        handleVerificarVolume(volume.id);
        setCodigoVolume('');
      } else {
        toast({
          title: "Volume já verificado",
          description: `Volume ${codigo} já foi verificado anteriormente.`,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Volume não encontrado",
        description: `Volume com código ${codigo} não encontrado nesta ordem.`,
        variant: "destructive",
      });
    }
  };

  // Agrupar volumes por nota fiscal
  const volumesAgrupados = volumes.reduce((acc, volume) => {
    const key = volume.notaFiscalNumero;
    if (!acc[key]) {
      acc[key] = {
        notaFiscal: volume.notaFiscalNumero,
        remetente: volume.notaFiscalRemetente,
        volumes: []
      };
    }
    acc[key].volumes.push(volume);
    return acc;
  }, {} as Record<string, { notaFiscal: string; remetente: string; volumes: VolumeAgrupado[] }>);

  const volumesVerificados = volumes.filter(v => v.verificado);
  const volumesNaoVerificados = volumes.filter(v => !v.verificado);

  const volumesColumns = [
    { header: 'Código', accessor: 'codigo' },
    { header: 'Descrição', accessor: 'descricao' },
    { header: 'Peso (kg)', accessor: 'peso' },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (row: any) => {
        const status = row.verificado ? 'Verificado' : 'Pendente';
        const className = row.verificado ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium';
        return <span className={className}>{status}</span>;
      }
    },
    {
      header: 'Ações',
      accessor: 'actions',
      cell: (row: any) => {
        if (row.verificado) {
          return <span className="text-green-600">✓ Verificado</span>;
        }
        return (
          <Button
            size="sm"
            onClick={() => handleVerificarVolume(row.id)}
            className="bg-cross-blue hover:bg-cross-blue/90"
          >
            Verificar
          </Button>
        );
      }
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <CheckCircle className="mr-2 text-cross-blue" size={24} />
            Conferência de Carga
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
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Verificados</p>
                      <p className="text-2xl font-bold">{volumesVerificados.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium">Pendentes</p>
                      <p className="text-2xl font-bold">{volumesNaoVerificados.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>

      {ordemSelecionada && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Package className="mr-2 text-cross-blue" size={20} />
                Scanner de Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="codigoVolume">Código do Volume</Label>
                  <Input
                    id="codigoVolume"
                    placeholder="Escaneie ou digite o código do volume"
                    value={codigoVolume}
                    onChange={(e) => setCodigoVolume(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && codigoVolume.trim()) {
                        handleScanVolume(codigoVolume.trim());
                      }
                    }}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => codigoVolume.trim() && handleScanVolume(codigoVolume.trim())}
                    disabled={!codigoVolume.trim()}
                    className="bg-cross-blue hover:bg-cross-blue/90"
                  >
                    Verificar Volume
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Volumes agrupados por Nota Fiscal */}
          <div className="space-y-4">
            {Object.entries(volumesAgrupados).map(([notaFiscal, grupo]) => (
              <Card key={notaFiscal}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="mr-2 text-cross-blue" size={20} />
                    NF {grupo.notaFiscal} - {grupo.remetente}
                    <span className="ml-auto text-sm font-normal text-gray-600">
                      {grupo.volumes.filter(v => v.verificado).length}/{grupo.volumes.length} volumes verificados
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DataTable
                    columns={volumesColumns}
                    data={grupo.volumes}
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          {volumes.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Progresso: {volumesVerificados.length} de {volumes.length} volumes verificados
                  </div>
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={volumesNaoVerificados.length > 0}
                  >
                    {volumesNaoVerificados.length > 0 ? 
                      `Restam ${volumesNaoVerificados.length} volumes` : 
                      'Finalizar Conferência'
                    }
                  </Button>
                </div>
                {volumes.length > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(volumesVerificados.length / volumes.length) * 100}%` }}
                    ></div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default ConferenciaCarga;
