
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { NotaFiscalVolume, calcularTotaisColeta } from '../../utils/volumeCalculations';

interface NotasFiscaisSummaryProps {
  notasFiscais: NotaFiscalVolume[];
}

const NotasFiscaisSummary: React.FC<NotasFiscaisSummaryProps> = ({ notasFiscais }) => {
  const totaisColeta = calcularTotaisColeta(notasFiscais);
  
  return (
    <>
      <Separator />
      
      <div className="flex justify-end pt-4">
        <div className="text-right">
          <div className="font-bold">Total da Coleta:</div>
          <div>
            <div>Volume: <span className="font-semibold">{totaisColeta.volumeTotal.toFixed(3)} m³</span></div>
            <div>Peso Bruto: <span className="font-semibold">{totaisColeta.pesoTotal.toFixed(2)} kg</span></div>
            <div>Peso Cubado: <span className="font-semibold">{totaisColeta.pesoCubadoTotal.toFixed(2)} kg</span></div>
            <div>Peso para Cálculo: <span className="font-semibold">{Math.max(totaisColeta.pesoTotal, totaisColeta.pesoCubadoTotal).toFixed(2)} kg</span></div>
            <div>Valor Total: <span className="font-semibold">R$ {notasFiscais.reduce((acc, nf) => acc + (nf.valorTotal || 0), 0).toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotasFiscaisSummary;
