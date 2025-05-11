
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NotaFiscalVolume, calcularSubtotaisNota, calcularTotaisColeta } from '../utils/volumeCalculations';
import VolumesInputForm from './VolumesInputForm';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus } from 'lucide-react';

interface NotasFiscaisManagerProps {
  notasFiscais: NotaFiscalVolume[];
  onChangeNotasFiscais: (notasFiscais: NotaFiscalVolume[]) => void;
}

const NotasFiscaisManager: React.FC<NotasFiscaisManagerProps> = ({
  notasFiscais,
  onChangeNotasFiscais
}) => {
  const adicionarNF = () => {
    onChangeNotasFiscais([...notasFiscais, { numeroNF: '', volumes: [] }]);
  };

  const removerNF = (index: number) => {
    const novasNFs = [...notasFiscais];
    novasNFs.splice(index, 1);
    onChangeNotasFiscais(novasNFs);
  };

  const atualizarNumeroNF = (index: number, numeroNF: string) => {
    const novasNFs = [...notasFiscais];
    novasNFs[index] = { ...novasNFs[index], numeroNF };
    onChangeNotasFiscais(novasNFs);
  };

  const atualizarVolumes = (index: number, volumes: any[]) => {
    const novasNFs = [...notasFiscais];
    novasNFs[index] = { ...novasNFs[index], volumes };
    onChangeNotasFiscais(novasNFs);
  };

  const totaisColeta = calcularTotaisColeta(notasFiscais);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-lg font-medium">Notas Fiscais</Label>
        <Button 
          type="button" 
          variant="outline" 
          onClick={adicionarNF}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Adicionar Nota Fiscal
        </Button>
      </div>

      {notasFiscais.length === 0 ? (
        <div className="text-gray-500 text-center py-4">
          Nenhuma nota fiscal cadastrada. Clique em "Adicionar Nota Fiscal" para começar.
        </div>
      ) : (
        <>
          {notasFiscais.map((nf, index) => {
            const subtotais = calcularSubtotaisNota(nf.volumes);
            
            return (
              <Card key={index} className="mb-6">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Nota Fiscal {index + 1}</CardTitle>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    className="text-red-500 hover:text-red-700" 
                    onClick={() => removerNF(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`nf-${index}`}>Número da Nota Fiscal</Label>
                      <Input 
                        id={`nf-${index}`}
                        value={nf.numeroNF} 
                        onChange={(e) => atualizarNumeroNF(index, e.target.value)}
                        placeholder="Digite o número da NF"
                      />
                    </div>
                    
                    <VolumesInputForm 
                      volumes={nf.volumes} 
                      onChange={(volumes) => atualizarVolumes(index, volumes)} 
                    />
                    
                    <div className="flex justify-end pt-2">
                      <div className="text-right">
                        <div className="font-medium">Subtotal da NF:</div>
                        <div className="text-sm">
                          <div>Volume: {subtotais.volumeTotal.toFixed(3)} m³</div>
                          <div>Peso: {subtotais.pesoTotal.toFixed(2)} kg</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          <Separator />
          
          <div className="flex justify-end pt-4">
            <div className="text-right">
              <div className="font-bold">Total da Coleta:</div>
              <div>
                <div>Volume: <span className="font-semibold">{totaisColeta.volumeTotal.toFixed(3)} m³</span></div>
                <div>Peso: <span className="font-semibold">{totaisColeta.pesoTotal.toFixed(2)} kg</span></div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotasFiscaisManager;
