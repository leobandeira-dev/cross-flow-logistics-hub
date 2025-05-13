
import React from 'react';
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
import ImportacaoLoteNotas from './components/faturamento/ImportacaoLoteNotas';
import { FileText } from 'lucide-react';
import { useFaturamento } from './hooks/useFaturamento';
import CabecalhoTotais from './components/faturamento/CabecalhoTotais';

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
  // Novos campos
  remetente?: string;
  notaFiscal?: string;
  pedido?: string;
  dataEmissao?: Date;
  valorNF?: number;
  valorFreteTransferencia?: number;
  cteColeta?: string;
  valorColeta?: number;
  cteTransferencia?: string;
  paletizacao?: number;
  pedagio?: number;
  totalPrestacao?: number;
  icms?: number; // Valor de ICMS rateado por nota
}

const Faturamento: React.FC = () => {
  const {
    notas,
    activeTab,
    setActiveTab,
    cabecalhoValores,
    totaisCalculados,
    handleAddNotaFiscal,
    handleDeleteNotaFiscal,
    handleRecalculate,
    handleImportarLote,
    handleUpdateCabecalho,
    handleExportToPDF
  } = useFaturamento();

  return (
    <MainLayout title="Faturamento">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Cálculo de Frete e Rateio</CardTitle>
                <CardDescription>
                  Calcule o rateio de frete para notas fiscais com base no peso e outras variáveis.
                </CardDescription>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value="totais" className="w-full mb-6">
              <TabsList className="mb-4">
                <TabsTrigger value="totais">Totais</TabsTrigger>
              </TabsList>
              <TabsContent value="totais">
                <CabecalhoTotais 
                  cabecalhoValores={cabecalhoValores} 
                  totaisCalculados={totaisCalculados}
                  onUpdateCabecalho={handleUpdateCabecalho}
                  notasCount={notas.length}
                  pesoTotal={notas.reduce((sum, nota) => sum + nota.pesoNota, 0)}
                />
              </TabsContent>
            </Tabs>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="notas">Notas Fiscais</TabsTrigger>
                <TabsTrigger value="importacao">Importação de Notas</TabsTrigger>
                <TabsTrigger value="calculo">Adicionar Nota Manual</TabsTrigger>
              </TabsList>

              <TabsContent value="notas">
                <NotasFiscaisTable 
                  notas={notas} 
                  onDelete={handleDeleteNotaFiscal} 
                  onRecalculate={handleRecalculate}
                  onExportToPDF={handleExportToPDF}
                />
              </TabsContent>

              <TabsContent value="importacao">
                <ImportacaoLoteNotas
                  onImportarLote={handleImportarLote}
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
