
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CalculoFreteForm from './components/faturamento/CalculoFreteForm';
import NotasFiscaisTable from './components/faturamento/NotasFiscaisTable';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

// Define NotaFiscal interface based on the requirements
export interface NotaFiscal {
  id: string;
  data: Date;
  cliente: string;
  pesoNota: number;
  fretePorTonelada: number;
  pesoMinimo: number;
  aliquotaICMS: number;
  aliquotaExpresso: number;
  fretePeso?: number;
  valorExpresso?: number;
  freteRatear?: number;
}

const Faturamento: React.FC = () => {
  const [notas, setNotas] = useState<NotaFiscal[]>([]);
  const [activeTab, setActiveTab] = useState("notas");

  const calculateFreight = (notasToCalculate: NotaFiscal[]): NotaFiscal[] => {
    // Calculate total real weight
    const pesoTotalReal = notasToCalculate.reduce((sum, nota) => sum + nota.pesoNota, 0);
    
    // Determine if we need to use minimum weight
    const usarPesoMinimo = pesoTotalReal < notasToCalculate[0].pesoMinimo;
    const pesoConsiderado = usarPesoMinimo ? notasToCalculate[0].pesoMinimo : pesoTotalReal;
    
    // Calculate freight for each note
    return notasToCalculate.map(nota => {
      // Calculate weight-based freight
      const proporcaoPeso = usarPesoMinimo 
        ? nota.pesoMinimo / pesoTotalReal 
        : 1;
      
      const fretePeso = (nota.fretePorTonelada / 1000) * nota.pesoNota * proporcaoPeso;
      
      // Calculate express value
      const valorExpresso = fretePeso * (nota.aliquotaExpresso / 100);
      
      // Calculate total freight to be allocated
      const freteRatear = fretePeso + valorExpresso;
      
      return {
        ...nota,
        fretePeso,
        valorExpresso,
        freteRatear
      };
    });
  };

  const handleAddNotaFiscal = (nota: Omit<NotaFiscal, 'id' | 'fretePeso' | 'valorExpresso' | 'freteRatear'>) => {
    const newNota: NotaFiscal = {
      ...nota,
      id: `NF-${Math.random().toString(36).substr(2, 9)}`
    };
    
    const updatedNotas = [...notas, newNota];
    
    // If there are notes, calculate freight
    if (updatedNotas.length > 0) {
      const notasCalculated = calculateFreight(updatedNotas);
      setNotas(notasCalculated);
      
      toast({
        title: "Nota fiscal adicionada com sucesso",
        description: `Nota para ${nota.cliente} em ${format(nota.data, 'dd/MM/yyyy')} adicionada.`
      });
    }
  };

  const handleDeleteNotaFiscal = (id: string) => {
    const updatedNotas = notas.filter(nota => nota.id !== id);
    
    // If there are still notes, recalculate
    if (updatedNotas.length > 0) {
      const notasCalculated = calculateFreight(updatedNotas);
      setNotas(notasCalculated);
    } else {
      setNotas([]);
    }
    
    toast({
      title: "Nota fiscal removida",
      description: "A nota fiscal foi removida com sucesso."
    });
  };

  const handleRecalculate = () => {
    if (notas.length > 0) {
      const notasCalculated = calculateFreight([...notas]);
      setNotas(notasCalculated);
      
      toast({
        title: "Frete recalculado",
        description: "Valores de frete foram recalculados com sucesso."
      });
    }
  };

  return (
    <MainLayout title="Faturamento">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Cálculo de Frete e Rateio</CardTitle>
            <CardDescription>
              Calcule o rateio de frete para notas fiscais com base no peso e outras variáveis.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="notas">Notas Fiscais</TabsTrigger>
                <TabsTrigger value="calculo">Adicionar Nota</TabsTrigger>
              </TabsList>

              <TabsContent value="notas">
                <NotasFiscaisTable 
                  notas={notas} 
                  onDelete={handleDeleteNotaFiscal} 
                  onRecalculate={handleRecalculate} 
                />
              </TabsContent>

              <TabsContent value="calculo">
                <CalculoFreteForm 
                  onAddNotaFiscal={handleAddNotaFiscal}
                  onComplete={() => setActiveTab("notas")} 
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Faturamento;
