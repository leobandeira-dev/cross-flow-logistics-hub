
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatNumber } from '@/pages/armazenagem/utils/formatters';
import { Calculator, Weight, Package, DollarSign, Percent, Euro } from 'lucide-react';

interface TotaisCalculados {
  fretePesoViagem: number;
  pedagioViagem: number;
  expressoViagem: number;
  icmsViagem: number;
  totalViagem: number;
}

interface CabecalhoValores {
  fretePorTonelada: number;
  pesoMinimo: number;
  aliquotaICMS: number;
  aliquotaExpresso: number;
  valorFreteTransferencia: number;
  valorColeta: number;
  paletizacao: number;
  pedagio: number;
}

interface CabecalhoTotaisProps {
  cabecalhoValores: CabecalhoValores;
  totaisCalculados: TotaisCalculados;
  onUpdateCabecalho: (valores: CabecalhoValores) => void;
  notasCount: number;
  pesoTotal: number;
}

const CabecalhoTotais: React.FC<CabecalhoTotaisProps> = ({
  cabecalhoValores,
  totaisCalculados,
  onUpdateCabecalho,
  notasCount,
  pesoTotal
}) => {
  const [valores, setValores] = useState<CabecalhoValores>(cabecalhoValores);

  useEffect(() => {
    setValores(cabecalhoValores);
  }, [cabecalhoValores]);

  const handleChange = (field: keyof CabecalhoValores, value: number) => {
    const newValores = { ...valores, [field]: value };
    setValores(newValores);
  };

  const handleSave = () => {
    onUpdateCabecalho(valores);
  };

  // Calcular peso considerado
  const pesoConsiderado = pesoTotal < valores.pesoMinimo ? valores.pesoMinimo : pesoTotal;
  
  return (
    <Card className="border border-muted">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Parâmetros do Cálculo</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  Frete por Tonelada (R$)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={valores.fretePorTonelada}
                  onChange={(e) => handleChange('fretePorTonelada', parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Weight className="h-4 w-4 text-muted-foreground" />
                  Peso Mínimo (kg)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={valores.pesoMinimo}
                  onChange={(e) => handleChange('pesoMinimo', parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Percent className="h-4 w-4 text-muted-foreground" />
                  Alíquota ICMS (%)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={valores.aliquotaICMS}
                  onChange={(e) => handleChange('aliquotaICMS', parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Percent className="h-4 w-4 text-muted-foreground" />
                  Alíquota Expresso (%)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={valores.aliquotaExpresso}
                  onChange={(e) => handleChange('aliquotaExpresso', parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Euro className="h-4 w-4 text-muted-foreground" />
                  Pedágio (R$)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={valores.pedagio}
                  onChange={(e) => handleChange('pedagio', parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  Paletização (R$)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={valores.paletizacao}
                  onChange={(e) => handleChange('paletizacao', parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  Valor Frete Transferência (R$)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={valores.valorFreteTransferencia}
                  onChange={(e) => handleChange('valorFreteTransferencia', parseFloat(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  Valor Coleta (R$)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={valores.valorColeta}
                  onChange={(e) => handleChange('valorColeta', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <Button onClick={handleSave} className="mt-4 w-full flex items-center gap-2" size="lg">
              <Calculator className="h-4 w-4" />
              Atualizar Cálculos
            </Button>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Totais da Viagem</h3>
            
            <div className="grid grid-cols-1 gap-4 bg-muted/20 p-4 rounded-lg">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Notas Fiscais:</span>
                <span className="font-bold">{notasCount}</span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Peso Total (kg):</span>
                <span className="font-bold">{formatNumber(pesoTotal)}</span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Peso Considerado (kg):</span>
                <span className="font-bold">{formatNumber(pesoConsiderado)}</span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Frete Peso Viagem:</span>
                <span className="font-bold">{formatCurrency(totaisCalculados.fretePesoViagem)}</span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Expresso Viagem:</span>
                <span className="font-bold">{formatCurrency(totaisCalculados.expressoViagem)}</span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Pedágio Viagem:</span>
                <span className="font-bold">{formatCurrency(totaisCalculados.pedagioViagem)}</span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">ICMS Viagem:</span>
                <span className="font-bold">{formatCurrency(totaisCalculados.icmsViagem)}</span>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-foreground/20">
                <span className="font-semibold">Total da Viagem:</span>
                <span className="font-bold text-lg">{formatCurrency(totaisCalculados.totalViagem)}</span>
              </div>
            </div>
            
            <div className="bg-muted/20 p-4 rounded-lg mt-4">
              <h4 className="font-medium mb-2">Como o cálculo é feito:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Frete Peso Viagem = (Frete por tonelada × Peso considerado) / 1000</li>
                <li>• Expresso Viagem = Frete Peso × Alíquota do expresso</li>
                <li>• ICMS = (Base de cálculo / (100 - Alíquota ICMS)) - Base de cálculo</li>
                <li>• Base de cálculo = Frete Peso + Pedágio + Expresso</li>
                <li>• Total = Frete Peso + Expresso + Pedágio + ICMS</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CabecalhoTotais;
