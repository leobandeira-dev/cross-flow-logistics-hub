
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NotaFiscalVolume, calcularSubtotaisNota, calcularTotaisColeta } from '../utils/volumeCalculations';
import VolumesInputForm from './VolumesInputForm';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus, User, FileText, DollarSign } from 'lucide-react';

interface NotasFiscaisManagerProps {
  notasFiscais: NotaFiscalVolume[];
  onChangeNotasFiscais: (notasFiscais: NotaFiscalVolume[]) => void;
}

const NotasFiscaisManager: React.FC<NotasFiscaisManagerProps> = ({
  notasFiscais,
  onChangeNotasFiscais
}) => {
  const adicionarNF = () => {
    onChangeNotasFiscais([...notasFiscais, { 
      numeroNF: '', 
      volumes: [],
      remetente: '',
      destinatario: '',
      valorTotal: 0
    }]);
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

  const atualizarRemetente = (index: number, remetente: string) => {
    const novasNFs = [...notasFiscais];
    novasNFs[index] = { ...novasNFs[index], remetente };
    onChangeNotasFiscais(novasNFs);
  };

  const atualizarDestinatario = (index: number, destinatario: string) => {
    const novasNFs = [...notasFiscais];
    novasNFs[index] = { ...novasNFs[index], destinatario };
    onChangeNotasFiscais(novasNFs);
  };

  const atualizarValorTotal = (index: number, valorTotalStr: string) => {
    const novasNFs = [...notasFiscais];
    const valorTotal = parseFloat(valorTotalStr) || 0;
    novasNFs[index] = { ...novasNFs[index], valorTotal };
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`nf-${index}`} className="flex items-center gap-1">
                          <FileText className="h-4 w-4" /> Número da Nota Fiscal
                        </Label>
                        <Input 
                          id={`nf-${index}`}
                          value={nf.numeroNF} 
                          onChange={(e) => atualizarNumeroNF(index, e.target.value)}
                          placeholder="Digite o número da NF"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`valor-${index}`} className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" /> Valor Total (R$)
                        </Label>
                        <Input 
                          id={`valor-${index}`}
                          type="number" 
                          step="0.01"
                          value={nf.valorTotal || ''} 
                          onChange={(e) => atualizarValorTotal(index, e.target.value)}
                          placeholder="0,00"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`remetente-${index}`} className="flex items-center gap-1">
                          <User className="h-4 w-4" /> Remetente
                        </Label>
                        <Input 
                          id={`remetente-${index}`}
                          value={nf.remetente || ''} 
                          onChange={(e) => atualizarRemetente(index, e.target.value)}
                          placeholder="Nome do remetente"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`destinatario-${index}`} className="flex items-center gap-1">
                          <User className="h-4 w-4" /> Destinatário
                        </Label>
                        <Input 
                          id={`destinatario-${index}`}
                          value={nf.destinatario || ''} 
                          onChange={(e) => atualizarDestinatario(index, e.target.value)}
                          placeholder="Nome do destinatário"
                        />
                      </div>
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
                          <div>Peso Cubado: {subtotais.pesoCubadoTotal.toFixed(2)} kg</div>
                          {nf.valorTotal > 0 && (
                            <div>Valor Total: R$ {nf.valorTotal.toFixed(2)}</div>
                          )}
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
                <div>Peso Bruto: <span className="font-semibold">{totaisColeta.pesoTotal.toFixed(2)} kg</span></div>
                <div>Peso Cubado: <span className="font-semibold">{totaisColeta.pesoCubadoTotal.toFixed(2)} kg</span></div>
                <div>Peso para Cálculo: <span className="font-semibold">{Math.max(totaisColeta.pesoTotal, totaisColeta.pesoCubadoTotal).toFixed(2)} kg</span></div>
                <div>Valor Total: <span className="font-semibold">R$ {notasFiscais.reduce((acc, nf) => acc + (nf.valorTotal || 0), 0).toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotasFiscaisManager;
