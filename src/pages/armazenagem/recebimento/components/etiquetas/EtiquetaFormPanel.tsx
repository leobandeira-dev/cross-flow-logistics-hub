
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { Package, FileOutput, QrCode } from 'lucide-react';

interface EtiquetaFormPanelProps {
  form: UseFormReturn<any>;
  tipoEtiqueta: 'volume' | 'mae';
  isQuimico: boolean;
  handleGenerateVolumes?: () => void;
  handleCreateEtiquetaMae?: () => void;
  showEtiquetaMaeOption: boolean;
}

const EtiquetaFormPanel: React.FC<EtiquetaFormPanelProps> = ({
  form,
  tipoEtiqueta,
  isQuimico,
  handleGenerateVolumes,
  handleCreateEtiquetaMae,
  showEtiquetaMaeOption
}) => {
  // Get values and register methods from the form
  const { register, watch } = form;
  const watchTipoEtiqueta = watch('tipoEtiqueta', tipoEtiqueta);
  const watchTipoVolume = watch('tipoVolume', 'geral');
  const isVolumeEtiqueta = watchTipoEtiqueta === 'volume';
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Gerar {tipoEtiqueta === 'mae' ? 'Etiqueta Mãe' : 'Etiquetas de Volume'}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="notaFiscal">Nota Fiscal</Label>
            <Input
              id="notaFiscal"
              {...register('notaFiscal')}
              placeholder="Número da nota fiscal"
            />
          </div>
          
          {isVolumeEtiqueta && (
            <div>
              <Label htmlFor="volumesTotal">Quantidade de Volumes</Label>
              <Input
                id="volumesTotal"
                {...register('volumesTotal')}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                min="1"
                placeholder="Quantidade de volumes"
              />
            </div>
          )}
          
          {!isVolumeEtiqueta && (
            <div>
              <Label htmlFor="etiquetaMaeId">ID da Etiqueta Mãe</Label>
              <Input
                id="etiquetaMaeId"
                {...register('etiquetaMaeId')}
                placeholder="ID da etiqueta mãe (opcional)"
              />
            </div>
          )}
          
          <div>
            <Label htmlFor="pesoTotalBruto">Peso Total</Label>
            <Input
              id="pesoTotalBruto"
              {...register('pesoTotalBruto')}
              placeholder="Ex: 250,5 Kg"
            />
          </div>
          
          <div>
            <Label htmlFor="formatoImpressao">Formato de Impressão</Label>
            <Select 
              defaultValue="50x100"
              onValueChange={(value) => form.setValue('formatoImpressao', value)}
              value={watch('formatoImpressao')}
            >
              <SelectTrigger id="formatoImpressao">
                <SelectValue placeholder="Selecione um formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50x100">Etiqueta 50x100mm</SelectItem>
                <SelectItem value="a4">Folha A4</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add layout style selection */}
          <div>
            <Label htmlFor="layoutStyle">Layout da Etiqueta</Label>
            <Select 
              defaultValue="standard"
              onValueChange={(value) => form.setValue('layoutStyle', value)}
              value={watch('layoutStyle', 'standard')}
            >
              <SelectTrigger id="layoutStyle">
                <SelectValue placeholder="Selecione um layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Padrão (Sedex)</SelectItem>
                <SelectItem value="compact">Compacto (Braspress)</SelectItem>
                <SelectItem value="modern">Moderno (Jadlog/UPS)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {isVolumeEtiqueta && (
            <div>
              <Label htmlFor="tipoVolume">Tipo de Volume</Label>
              <Select 
                defaultValue="geral"
                onValueChange={(value) => form.setValue('tipoVolume', value)}
                value={watchTipoVolume}
              >
                <SelectTrigger id="tipoVolume">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="geral">Carga Geral</SelectItem>
                  <SelectItem value="quimico">Produto Químico</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {isVolumeEtiqueta && watchTipoVolume === 'quimico' && (
            <>
              <div>
                <Label htmlFor="codigoONU">Código ONU</Label>
                <Input
                  id="codigoONU"
                  {...register('codigoONU')}
                  placeholder="Ex: 1170"
                />
              </div>
              <div>
                <Label htmlFor="codigoRisco">Código de Risco</Label>
                <Input
                  id="codigoRisco"
                  {...register('codigoRisco')}
                  placeholder="Ex: 33"
                />
              </div>
            </>
          )}
          
          {showEtiquetaMaeOption && (
            <div className="md:col-span-2">
              <Label htmlFor="tipoEtiqueta">Tipo de Etiqueta</Label>
              <Select 
                defaultValue="volume"
                onValueChange={(value) => form.setValue('tipoEtiqueta', value)}
                value={watchTipoEtiqueta}
              >
                <SelectTrigger id="tipoEtiqueta">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="volume">Etiqueta de Volume</SelectItem>
                  <SelectItem value="mae">Etiqueta Mãe</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        {isVolumeEtiqueta ? (
          <Button
            type="button"
            className="w-full"
            onClick={handleGenerateVolumes}
          >
            <FileOutput className="mr-2 h-4 w-4" />
            Gerar Volumes
          </Button>
        ) : (
          <Button
            type="button"
            className="w-full"
            onClick={handleCreateEtiquetaMae}
          >
            <Package className="mr-2 h-4 w-4" />
            Gerar Etiqueta Mãe
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EtiquetaFormPanel;
