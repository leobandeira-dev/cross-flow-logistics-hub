import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../../../components/layout/MainLayout';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { notasFiscais } from './data/mockData';

// This is a mock component - actual implementation would have proper functionality
const GeracaoEtiquetas: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [notaId, setNotaId] = useState<string | null>(null);
  const [notaData, setNotaData] = useState<any>(null);
  
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
              </div>
              <Button
                variant="outline"
                onClick={handleReturnToNotas}
              >
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
            {/* Additional content would go here in a real implementation */}
            {!notaId && (
              <p className="italic text-amber-600">
                Selecione uma nota fiscal para gerar etiquetas de volume.
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Etiquetas de Produto</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Crie etiquetas para identificação de produtos individuais.
            </p>
            {/* Additional content would go here in a real implementation */}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default GeracaoEtiquetas;
