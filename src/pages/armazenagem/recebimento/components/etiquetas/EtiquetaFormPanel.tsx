
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Tags } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface EtiquetaFormPanelProps {
  form: UseFormReturn<any>;
  tipoEtiqueta: 'volume' | 'mae';
  isQuimico?: boolean;
  handleGenerateVolumes: () => void;
  showEtiquetaMaeOption?: boolean;
}

const EtiquetaFormPanel: React.FC<EtiquetaFormPanelProps> = ({ 
  form, 
  tipoEtiqueta, 
  isQuimico = false, 
  handleGenerateVolumes,
  showEtiquetaMaeOption = true
}) => {
  const isGenerating = false; // This would come from a hook in real implementation

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Tags className="mr-2 text-cross-blue" size={20} />
          Configuração de Etiquetas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Dados da Nota Fiscal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="notaFiscal">Nota Fiscal</Label>
            <Input
              id="notaFiscal"
              {...form.register('notaFiscal')}
              placeholder="Número da NF"
            />
          </div>
          <div>
            <Label htmlFor="volumesTotal">Quantidade de Volumes</Label>
            <Input
              id="volumesTotal"
              type="number"
              {...form.register('volumesTotal')}
              placeholder="Ex: 5"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="pesoTotalBruto">Peso Total Bruto (Kg)</Label>
          <Input
            id="pesoTotalBruto"
            type="number"
            step="0.01"
            {...form.register('pesoTotalBruto')}
            placeholder="Ex: 125.50"
          />
        </div>

        {/* Configurações de Impressão */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="formatoImpressao">Formato de Impressão</Label>
            <Select 
              value={form.watch('formatoImpressao')} 
              onValueChange={(value) => form.setValue('formatoImpressao', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50x100">50x100mm</SelectItem>
                <SelectItem value="100x100">100x100mm</SelectItem>
                <SelectItem value="100x150">100x150mm</SelectItem>
                <SelectItem value="150x100">150x100mm</SelectItem>
                <SelectItem value="62x42">62x42mm</SelectItem>
                <SelectItem value="a4">A4</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="layoutStyle">Estilo do Layout</Label>
            <Select 
              value={form.watch('layoutStyle')} 
              onValueChange={(value) => form.setValue('layoutStyle', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Padrão</SelectItem>
                <SelectItem value="compact">Compacto</SelectItem>
                <SelectItem value="modern">Moderno</SelectItem>
                <SelectItem value="enhanced">Legibilidade Aprimorada</SelectItem>
                <SelectItem value="alta-legibilidade">Alta Legibilidade (Texto Grande)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tipo de Volume */}
        <div>
          <Label htmlFor="tipoVolume">Tipo de Volume</Label>
          <Select 
            value={form.watch('tipoVolume')} 
            onValueChange={(value) => form.setValue('tipoVolume', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="geral">Carga Geral</SelectItem>
              <SelectItem value="quimico">Químico</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Campos específicos para produtos químicos */}
        {isQuimico && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-yellow-300 bg-yellow-50 rounded-md">
            <div>
              <Label htmlFor="codigoONU">Código ONU</Label>
              <Input
                id="codigoONU"
                {...form.register('codigoONU')}
                placeholder="Ex: UN1234"
              />
            </div>
            <div>
              <Label htmlFor="codigoRisco">Código de Risco</Label>
              <Input
                id="codigoRisco"
                {...form.register('codigoRisco')}
                placeholder="Ex: 3"
              />
            </div>
          </div>
        )}

        {/* Botão de Gerar Volumes */}
        <Button 
          onClick={handleGenerateVolumes}
          disabled={isGenerating}
          className="w-full"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando Volumes...
            </>
          ) : (
            <>
              <Tags className="mr-2 h-4 w-4" />
              Gerar Volumes para Etiquetas
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EtiquetaFormPanel;
