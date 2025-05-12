
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../../../components/layout/MainLayout';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { notasFiscais } from './data/mockData';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Printer, Save, ArrowLeft } from 'lucide-react';

// This component handles the generation of etiquetas based on nota fiscal data
const GeracaoEtiquetas: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [notaId, setNotaId] = useState<string | null>(null);
  const [notaData, setNotaData] = useState<any>(null);
  const [volumeCount, setVolumeCount] = useState<number>(1);
  const [etiquetasPorVolume, setEtiquetasPorVolume] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if we have a nota ID in the URL parameters
    const params = new URLSearchParams(location.search);
    const notaIdParam = params.get('notaId');
    
    if (notaIdParam) {
      setNotaId(notaIdParam);
      
      // Find the corresponding nota data
      const foundNota = notasFiscais.find(nota => nota.id === notaIdParam);
      if (foundNota) {
        setNotaData(foundNota);
        
        // If the nota has volumes, pre-populate the volume count
        if (foundNota.volumes) {
          setVolumeCount(parseInt(foundNota.volumes) || 1);
        }
        
        toast({
          title: "Nota Fiscal Carregada",
          description: `Nota Fiscal ${foundNota.numero} carregada para geração de etiquetas.`,
        });
      } else {
        toast({
          title: "Nota Fiscal Não Encontrada",
          description: "Não foi possível encontrar os dados da Nota Fiscal.",
          variant: "destructive"
        });
      }
    }
  }, [location]);
  
  const handleReturnToNotas = () => {
    navigate('/armazenagem/recebimento/notas?returnFrom=etiquetas');
  };

  const handleGerarEtiquetas = (tipo: 'volume' | 'produto') => {
    setIsGenerating(true);
    
    // Simulate etiqueta generation process
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Etiquetas Geradas",
        description: `${tipo === 'volume' ? volumeCount : volumeCount * etiquetasPorVolume} etiquetas de ${tipo === 'volume' ? 'volume' : 'produto'} foram geradas com sucesso.`,
      });
    }, 1500);
  };

  const handleSalvarEtiquetas = (tipo: 'volume' | 'produto') => {
    toast({
      title: "Etiquetas Salvas",
      description: `As etiquetas de ${tipo === 'volume' ? 'volume' : 'produto'} foram salvas com sucesso.`,
    });
  };

  return (
    <MainLayout title="Geração de Etiquetas">
      <div className="mb-6">
        <h2 className="text-2xl font-heading mb-2">Geração de Etiquetas</h2>
        <p className="text-gray-600">Criar e imprimir etiquetas para identificação de volumes</p>
      </div>

      {notaData && (
        <Card className="mb-6 border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-lg">Nota Fiscal Carregada</h3>
                <p className="text-gray-600">
                  NF: {notaData.numero} - Fornecedor: {notaData.fornecedor}
                </p>
                {notaData.volumes && (
                  <p className="text-gray-600">
                    Volumes: {notaData.volumes} - Transportadora: {notaData.transportadora || "Não informada"}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                onClick={handleReturnToNotas}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Notas Fiscais
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Etiquetas de Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Crie etiquetas para identificação de volumes baseadas nas informações da nota fiscal.
            </p>
            {!notaId ? (
              <p className="italic text-amber-600">
                Selecione uma nota fiscal para gerar etiquetas de volume.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="volumeCount">Quantidade de Volumes</Label>
                    <Input 
                      id="volumeCount" 
                      type="number" 
                      min="1" 
                      value={volumeCount}
                      onChange={(e) => setVolumeCount(parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          {notaId && (
            <CardFooter className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleSalvarEtiquetas('volume')}
              >
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
              <Button 
                onClick={() => handleGerarEtiquetas('volume')}
                disabled={isGenerating}
              >
                <Printer className="mr-2 h-4 w-4" />
                {isGenerating ? 'Gerando...' : 'Gerar Etiquetas'}
              </Button>
            </CardFooter>
          )}
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Etiquetas de Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Crie etiquetas para identificação de produtos individuais.
            </p>
            {!notaId ? (
              <p className="italic text-amber-600">
                Selecione uma nota fiscal para gerar etiquetas de produto.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="volumeCount">Quantidade de Volumes</Label>
                    <Input 
                      id="volumeCount" 
                      type="number" 
                      min="1" 
                      value={volumeCount}
                      onChange={(e) => setVolumeCount(parseInt(e.target.value) || 1)}
                      disabled={notaData?.volumes ? true : false}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="etiquetasPorVolume">Etiquetas por Volume</Label>
                    <Input 
                      id="etiquetasPorVolume" 
                      type="number" 
                      min="1" 
                      value={etiquetasPorVolume}
                      onChange={(e) => setEtiquetasPorVolume(parseInt(e.target.value) || 1)}
                    />
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-muted-foreground">
                    Total de etiquetas a serem geradas: <strong>{volumeCount * etiquetasPorVolume}</strong>
                  </p>
                </div>
                
                {notaData?.itens && notaData.itens.length > 0 && (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium mb-2">Produtos na Nota Fiscal:</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {notaData.itens.map((item: any, idx: number) => (
                        <li key={idx}>• {item.quantidade}x {item.descricao}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          {notaId && (
            <CardFooter className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleSalvarEtiquetas('produto')}
              >
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
              <Button 
                onClick={() => handleGerarEtiquetas('produto')}
                disabled={isGenerating}
              >
                <Printer className="mr-2 h-4 w-4" />
                {isGenerating ? 'Gerando...' : 'Gerar Etiquetas'}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </MainLayout>
  );
};

export default GeracaoEtiquetas;
