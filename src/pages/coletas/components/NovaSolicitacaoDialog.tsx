
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface NovaSolicitacaoDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NovaSolicitacaoDialog: React.FC<NovaSolicitacaoDialogProps> = ({ 
  isOpen, 
  setIsOpen,
  activeTab,
  setActiveTab
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-cross-blue hover:bg-cross-blueDark">
          <Plus className="mr-2 h-4 w-4" /> Nova Solicitação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle>Nova Solicitação de Coleta</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para criar uma nova solicitação de coleta.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="unica" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="unica">NF Única</TabsTrigger>
            <TabsTrigger value="lote">NF em Lote</TabsTrigger>
            <TabsTrigger value="manual">Manual</TabsTrigger>
            <TabsTrigger value="excel">Importar Excel</TabsTrigger>
          </TabsList>
          
          <TabsContent value="unica" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nf">Número da Nota Fiscal</Label>
                <Input id="nf" placeholder="Digite o número da NF" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente</Label>
                <Select>
                  <SelectTrigger id="cliente">
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="abc">Indústria ABC Ltda</SelectItem>
                      <SelectItem value="xyz">Distribuidora XYZ</SelectItem>
                      <SelectItem value="rapidos">Transportes Rápidos</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origem">Origem</Label>
                <Input id="origem" placeholder="Endereço de origem" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="destino">Destino</Label>
                <Input id="destino" placeholder="Endereço de destino" />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data">Data da Coleta</Label>
                <Input id="data" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="volumes">Volumes</Label>
                <Input id="volumes" type="number" placeholder="Quantidade" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="peso">Peso (kg)</Label>
                <Input id="peso" type="number" placeholder="Peso total" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea id="observacoes" placeholder="Informações adicionais" />
            </div>
          </TabsContent>
          
          <TabsContent value="lote" className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Notas Fiscais (uma por linha)</Label>
                <Textarea placeholder="Digite uma NF por linha" rows={5} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cliente-lote">Cliente</Label>
                  <Select>
                    <SelectTrigger id="cliente-lote">
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="abc">Indústria ABC Ltda</SelectItem>
                      <SelectItem value="xyz">Distribuidora XYZ</SelectItem>
                      <SelectItem value="rapidos">Transportes Rápidos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data-lote">Data da Coleta</Label>
                  <Input id="data-lote" type="date" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origem-lote">Origem</Label>
                  <Input id="origem-lote" placeholder="Endereço de origem" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destino-lote">Destino</Label>
                  <Input id="destino-lote" placeholder="Endereço de destino" />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="manual" className="py-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ordem-oca">Código OCA</Label>
                  <Input id="ordem-oca" placeholder="Ordem OCA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cliente-manual">Cliente</Label>
                  <Select>
                    <SelectTrigger id="cliente-manual">
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="abc">Indústria ABC Ltda</SelectItem>
                      <SelectItem value="xyz">Distribuidora XYZ</SelectItem>
                      <SelectItem value="rapidos">Transportes Rápidos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data-manual">Data da Coleta</Label>
                  <Input id="data-manual" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volumes-manual">Volumes</Label>
                  <Input id="volumes-manual" type="number" placeholder="Quantidade" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="peso-manual">Peso (kg)</Label>
                  <Input id="peso-manual" type="number" placeholder="Peso total" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origem-manual">Origem</Label>
                  <Input id="origem-manual" placeholder="Endereço de origem" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destino-manual">Destino</Label>
                  <Input id="destino-manual" placeholder="Endereço de destino" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="descricao-manual">Descrição da Carga</Label>
                <Textarea id="descricao-manual" placeholder="Detalhes da mercadoria" />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="excel" className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="arquivo-excel">Arquivo Excel</Label>
                <Input id="arquivo-excel" type="file" accept=".xlsx,.xls" />
              </div>
              
              <div className="p-4 border border-dashed rounded-lg text-center">
                <p className="text-gray-500 mb-2">
                  Faça download do modelo padrão para importação
                </p>
                <Button variant="outline" size="sm">
                  Download Modelo
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button className="bg-cross-blue hover:bg-cross-blueDark">Solicitar Coleta</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NovaSolicitacaoDialog;
