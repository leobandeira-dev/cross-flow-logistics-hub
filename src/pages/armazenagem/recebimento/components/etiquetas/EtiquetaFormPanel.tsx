
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { Barcode, QrCode, Search, Package } from 'lucide-react';

interface EtiquetaFormPanelProps {
  form: UseFormReturn<any>;
  tipoEtiqueta: 'volume' | 'mae';
  isQuimico: boolean;
  handleGenerateVolumes?: () => void;
  handleCreateEtiquetaMae?: () => void;
  showEtiquetaMaeOption?: boolean;
}

const EtiquetaFormPanel: React.FC<EtiquetaFormPanelProps> = ({
  form,
  tipoEtiqueta,
  isQuimico,
  handleGenerateVolumes,
  handleCreateEtiquetaMae,
  showEtiquetaMaeOption = false
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Barcode className="mr-2 text-cross-blue" size={20} />
          {tipoEtiqueta === 'mae' ? 'Geração de Etiquetas Mãe' : 'Geração de Etiquetas de Volume'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormField
                  control={form.control}
                  name="notaFiscal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nota Fiscal</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input placeholder="Buscar nota fiscal..." {...field} />
                        </FormControl>
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="formatoImpressao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Formato de Impressão</FormLabel>
                      <FormControl>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2"
                          {...field}
                        >
                          <option value="50x100">50x100 mm (Padrão)</option>
                          <option value="a4">A4 Horizontal</option>
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            {tipoEtiqueta === 'volume' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FormField
                    control={form.control}
                    name="volumesTotal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantidade de Volumes</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="pesoTotalBruto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso Total Bruto</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 25,5 Kg" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
            
            {tipoEtiqueta === 'mae' && (
              <div>
                <FormField
                  control={form.control}
                  name="etiquetaMaeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Etiqueta Mãe (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="ID personalizado ou deixe em branco para gerar automaticamente" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline">Cancelar</Button>
              {tipoEtiqueta === 'volume' && handleGenerateVolumes && (
                <Button 
                  type="button" 
                  className="bg-cross-blue hover:bg-cross-blue/90"
                  onClick={handleGenerateVolumes}
                >
                  <Package size={16} className="mr-2" />
                  Gerar Volumes
                </Button>
              )}
              {tipoEtiqueta === 'mae' && handleCreateEtiquetaMae && (
                <Button 
                  type="button" 
                  className="bg-cross-blue hover:bg-cross-blue/90"
                  onClick={handleCreateEtiquetaMae}
                >
                  <QrCode size={16} className="mr-2" />
                  Gerar Etiqueta Mãe
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EtiquetaFormPanel;
