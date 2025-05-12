
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { Package, Pallet } from 'lucide-react';

interface EtiquetaMaeFormPanelProps {
  form: UseFormReturn<any>;
  handleCreateEtiquetaMae: () => void;
}

const EtiquetaMaeFormPanel: React.FC<EtiquetaMaeFormPanelProps> = ({
  form,
  handleCreateEtiquetaMae
}) => {
  // Get values and register methods from the form
  const { register, watch, setValue } = form;
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Gerar Etiqueta Mãe</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="etiquetaMaeId">ID da Etiqueta Mãe</Label>
            <Input
              id="etiquetaMaeId"
              {...register('etiquetaMaeId')}
              placeholder="ID da etiqueta mãe (opcional)"
            />
          </div>
          
          <div>
            <Label htmlFor="descricaoEtiquetaMae">Descrição</Label>
            <Input
              id="descricaoEtiquetaMae"
              {...register('descricaoEtiquetaMae')}
              placeholder="Descrição da etiqueta mãe"
            />
          </div>
          
          <div>
            <Label htmlFor="tipoEtiquetaMae">Tipo de Etiqueta</Label>
            <Select 
              defaultValue="geral"
              onValueChange={(value) => form.setValue('tipoEtiquetaMae', value)}
              value={watch('tipoEtiquetaMae', 'geral')}
            >
              <SelectTrigger id="tipoEtiquetaMae">
                <SelectValue placeholder="Selecione um tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="geral">Geral (Volumes)</SelectItem>
                <SelectItem value="palete">Palete (Unitização)</SelectItem>
              </SelectContent>
            </Select>
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

          {/* Layout style selection */}
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
        </div>
        
        <Button
          type="button"
          className="w-full"
          onClick={handleCreateEtiquetaMae}
        >
          {watch('tipoEtiquetaMae') === 'palete' ? (
            <Pallet className="mr-2 h-4 w-4" />
          ) : (
            <Package className="mr-2 h-4 w-4" />
          )}
          Gerar Etiqueta Mãe
        </Button>
      </CardContent>
    </Card>
  );
};

export default EtiquetaMaeFormPanel;
