
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { Barcode, QrCode, Search } from 'lucide-react';

interface EtiquetaFormPanelProps {
  form: UseFormReturn<any>;
  tipoEtiqueta: 'volume' | 'mae';
  setTipoEtiqueta: (tipo: 'volume' | 'mae') => void;
  isQuimico: boolean;
  handleCreateEtiquetaMae: () => void;
}

const EtiquetaFormPanel: React.FC<EtiquetaFormPanelProps> = ({
  form,
  tipoEtiqueta,
  setTipoEtiqueta,
  isQuimico,
  handleCreateEtiquetaMae
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Barcode className="mr-2 text-cross-blue" size={20} />
          Geração de Etiquetas
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
                  name="tipoEtiqueta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Etiqueta</FormLabel>
                      <FormControl>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setTipoEtiqueta(e.target.value as 'volume' | 'mae');
                          }}
                        >
                          <option value="volume">Etiqueta de Volume</option>
                          <option value="mae">Etiqueta Mãe</option>
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormField
                  control={form.control}
                  name="tipoVolume"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Volume</FormLabel>
                      <FormControl>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2"
                          {...field}
                        >
                          <option value="geral">Carga Geral</option>
                          <option value="quimico">Produto Químico</option>
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              {isQuimico && (
                <div className="md:col-span-1 flex items-center gap-2">
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="codigoONU"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código ONU</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: 1203" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-1">
                    <FormField
                      control={form.control}
                      name="codigoRisco"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código de Risco</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: 33" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
            
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
              <Button 
                type="button" 
                className="bg-cross-blue hover:bg-cross-blue/90"
                onClick={tipoEtiqueta === 'mae' ? handleCreateEtiquetaMae : undefined}
              >
                {tipoEtiqueta === 'mae' ? (
                  <>
                    <QrCode size={16} className="mr-2" />
                    Gerar Etiqueta Mãe
                  </>
                ) : (
                  <>
                    <Barcode size={16} className="mr-2" />
                    Gerar Etiquetas de Volume
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EtiquetaFormPanel;
