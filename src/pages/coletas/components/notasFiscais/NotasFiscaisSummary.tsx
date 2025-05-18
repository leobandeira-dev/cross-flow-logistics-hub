
import React from 'react';
import { NotaFiscalVolume, calcularTotaisColeta, formatarNumero, formatarMoeda } from '../../utils/volumeCalculations';
import { Card, CardContent } from '@/components/ui/card';

interface NotasFiscaisSummaryProps {
  notasFiscais: NotaFiscalVolume[];
}

const NotasFiscaisSummaryItem = ({ label, value }: { label: string, value: string }) => {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-sm font-medium text-gray-600">{label}:</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
};

const NotasFiscaisSummary: React.FC<NotasFiscaisSummaryProps> = ({ notasFiscais }) => {
  const totais = calcularTotaisColeta(notasFiscais);
  
  // Skip rendering if no notas fiscais
  if (notasFiscais.length === 0) {
    return null;
  }
  
  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Resumo da Coleta</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <NotasFiscaisSummaryItem 
              label="Total de Notas Fiscais" 
              value={notasFiscais.length.toString()} 
            />
            <NotasFiscaisSummaryItem 
              label="Total de Volumes" 
              value={totais.qtdVolumes.toString()}
            />
            <NotasFiscaisSummaryItem 
              label="Volume Total (m³)" 
              value={formatarNumero(totais.volumeTotal)}
            />
          </div>
          
          <div className="space-y-2">
            <NotasFiscaisSummaryItem 
              label="Peso Real Total (kg)" 
              value={formatarNumero(totais.pesoTotal)}
            />
            <NotasFiscaisSummaryItem 
              label="Peso Cubado Total (kg)" 
              value={formatarNumero(totais.pesoCubadoTotal)}
            />
            <NotasFiscaisSummaryItem 
              label="Peso Considerado (kg)" 
              value={formatarNumero(Math.max(totais.pesoTotal, totais.pesoCubadoTotal))}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotasFiscaisSummary;
