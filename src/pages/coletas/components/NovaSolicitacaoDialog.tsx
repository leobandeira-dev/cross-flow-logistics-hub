
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Plus, Upload, Download, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { NotaFiscalVolume } from '../utils/volumeCalculations';
import NotasFiscaisManager from './NotasFiscaisManager';
import { extractNFInfoFromXML, processMultipleXMLFiles, generateExcelTemplate, processExcelFile } from '../utils/xmlImportHelper';

interface NovaSolicitacaoDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface SolicitacaoForm {
  cliente: string;
  origem: string;
  destino: string;
  dataColeta: string;
  observacoes: string;
  notasFiscais: NotaFiscalVolume[];
  remetente_cnpj?: string;
  destinatario_cnpj?: string;
  remetenteInfo?: any;
  destinatarioInfo?: any;
}

const NovaSolicitacaoDialog: React.FC<NovaSolicitacaoDialogProps> = ({ 
  isOpen, 
  setIsOpen,
  activeTab,
  setActiveTab
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SolicitacaoForm>({
    cliente: '',
    origem: '',
    destino: '',
    dataColeta: '',
    observacoes: '',
    notasFiscais: []
  });

  const handleInputChange = (field: keyof SolicitacaoForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setIsLoading(true);
    
    // Validate required fields
    if (!formData.cliente) {
      toast({
        title: "Campo obrigatório",
        description: "Selecione um cliente.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (!formData.origem || !formData.destino) {
      toast({
        title: "Campos obrigatórios",
        description: "Informe os endereços de origem e destino.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (!formData.dataColeta) {
      toast({
        title: "Campo obrigatório",
        description: "Informe a data da coleta.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (formData.notasFiscais.length === 0) {
      toast({
        title: "Nenhuma nota fiscal",
        description: "Adicione pelo menos uma nota fiscal para continuar.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Submit form
    setTimeout(() => {
      toast({
        title: "Solicitação enviada",
        description: "Sua solicitação de coleta foi registrada com sucesso."
      });
      setIsLoading(false);
      setFormData({
        cliente: '',
        origem: '',
        destino: '',
        dataColeta: '',
        observacoes: '',
        notasFiscais: []
      });
      setIsOpen(false);
    }, 1500);
  };

  // Handler for XML file upload in "NF Única" tab
  const handleSingleXmlUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsLoading(true);
    
    try {
      const result = await extractNFInfoFromXML(file);
      if (result && result.nfInfo && result.nfInfo.numeroNF) {
        // Ensure we create a complete NotaFiscalVolume object
        const completeNotaFiscal: NotaFiscalVolume = {
          numeroNF: result.nfInfo.numeroNF || '',
          volumes: result.nfInfo.volumes || [],
          remetente: result.remetente?.razaoSocial || '',
          destinatario: result.destinatario?.razaoSocial || '',
          valorTotal: result.nfInfo.valorTotal || 0
        };
        
        // Update form data with XML results
        setFormData(prev => ({
          ...prev,
          notasFiscais: [completeNotaFiscal],
          remetenteInfo: result.remetente,
          destinatarioInfo: result.destinatario,
          origem: result.remetente?.enderecoFormatado || prev.origem,
          destino: result.destinatario?.enderecoFormatado || prev.destino,
          remetente_cnpj: result.remetente?.cnpj,
          destinatario_cnpj: result.destinatario?.cnpj || result.destinatario?.cpf
        }));
        
        toast({
          title: "XML importado",
          description: `Nota fiscal ${result.nfInfo.numeroNF} importada com sucesso.`
        });
      }
    } catch (error) {
      console.error("Erro ao importar XML:", error);
      toast({
        title: "Erro",
        description: "Não foi possível importar o arquivo XML.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for batch XML upload
  const handleBatchXmlUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsLoading(true);
    
    try {
      const result = await processMultipleXMLFiles(files);
      
      if (result.notasFiscais.length > 0) {
        // Ensure each nota fiscal has all required properties
        const completeNotasFiscais: NotaFiscalVolume[] = result.notasFiscais.map(nf => ({
          numeroNF: nf.numeroNF || '',
          volumes: nf.volumes || [],
          remetente: nf.remetente || result.remetente?.razaoSocial || '',
          destinatario: nf.destinatario || result.destinatario?.razaoSocial || '',
          valorTotal: nf.valorTotal || 0
        }));
        
        // Update form data with batch XML results
        setFormData(prev => ({
          ...prev,
          notasFiscais: completeNotasFiscais,
          remetenteInfo: result.remetente,
          destinatarioInfo: result.destinatario,
          origem: result.remetente?.enderecoFormatado || prev.origem,
          destino: result.destinatario?.enderecoFormatado || prev.destino,
          remetente_cnpj: result.remetente?.cnpj,
          destinatario_cnpj: result.destinatario?.cnpj || result.destinatario?.cpf
        }));
        
        toast({
          title: "XML importados",
          description: `${completeNotasFiscais.length} notas fiscais importadas com sucesso.`
        });
      } else {
        toast({
          title: "Atenção",
          description: "Nenhuma nota fiscal válida encontrada nos arquivos XML."
        });
      }
    } catch (error) {
      console.error("Erro ao importar XMLs em lote:", error);
      toast({
        title: "Erro",
        description: "Não foi possível importar os arquivos XML.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for Excel file upload
  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsLoading(true);
    
    try {
      const result = await processExcelFile(file);
      
      if (result.notasFiscais.length > 0) {
        // Ensure each nota fiscal has all required properties
        const completeNotasFiscais: NotaFiscalVolume[] = result.notasFiscais.map(nf => ({
          numeroNF: nf.numeroNF || '',
          volumes: nf.volumes || [],
          remetente: nf.remetente || result.remetente?.razaoSocial || '',
          destinatario: nf.destinatario || result.destinatario?.razaoSocial || '',
          valorTotal: nf.valorTotal || 0
        }));
        
        setFormData(prev => ({
          ...prev,
          notasFiscais: completeNotasFiscais,
          remetenteInfo: result.remetente,
          destinatarioInfo: result.destinatario,
          remetente_cnpj: result.remetente?.cnpj,
          destinatario_cnpj: result.destinatario?.cnpj || result.destinatario?.cpf
        }));
        
        toast({
          title: "Planilha importada",
          description: `${completeNotasFiscais.length} notas fiscais importadas com sucesso.`
        });
      } else {
        toast({
          title: "Atenção",
          description: "Nenhuma nota fiscal válida encontrada na planilha."
        });
      }
    } catch (error) {
      console.error("Erro ao importar Excel:", error);
      toast({
        title: "Erro",
        description: "Não foi possível importar o arquivo. Verifique se está no formato correto.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to download Excel template
  const handleDownloadTemplate = () => {
    generateExcelTemplate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-cross-blue hover:bg-cross-blueDark">
          <Plus className="mr-2 h-4 w-4" /> Nova Solicitação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Solicitação de Coleta</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para criar uma nova solicitação de coleta.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente</Label>
              <Select
                value={formData.cliente}
                onValueChange={(value) => handleInputChange('cliente', value)}
              >
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
            <div className="space-y-2">
              <Label htmlFor="data">Data da Coleta</Label>
              <Input 
                id="data" 
                type="date" 
                value={formData.dataColeta}
                onChange={(e) => handleInputChange('dataColeta', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origem">Origem</Label>
              <Input 
                id="origem" 
                placeholder="Endereço de origem" 
                value={formData.origem}
                onChange={(e) => handleInputChange('origem', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destino">Destino</Label>
              <Input 
                id="destino" 
                placeholder="Endereço de destino" 
                value={formData.destino}
                onChange={(e) => handleInputChange('destino', e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="unica" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="unica">NF Única</TabsTrigger>
              <TabsTrigger value="lote">NF em Lote</TabsTrigger>
              <TabsTrigger value="manual">Manual</TabsTrigger>
              <TabsTrigger value="excel">Importar Excel</TabsTrigger>
            </TabsList>
            
            <TabsContent value="unica" className="space-y-4 py-4">
              <div className="border rounded-md p-4">
                <Label className="mb-2 block">Importar Nota Fiscal via XML</Label>
                <div className="flex flex-col items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {isLoading ? (
                        <Loader2 className="w-10 h-10 mb-3 text-gray-400 animate-spin" />
                      ) : (
                        <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      )}
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                      </p>
                      <p className="text-xs text-gray-500">Arquivo XML da nota fiscal</p>
                    </div>
                    <input 
                      id="xml-upload" 
                      type="file" 
                      className="hidden" 
                      accept=".xml"
                      onChange={handleSingleXmlUpload}
                      disabled={isLoading}
                    />
                  </label>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="lote" className="py-4">
              <div className="border rounded-md p-4">
                <Label className="mb-2 block">Importar Múltiplas Notas Fiscais via XML</Label>
                <div className="flex flex-col items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {isLoading ? (
                        <Loader2 className="w-10 h-10 mb-3 text-gray-400 animate-spin" />
                      ) : (
                        <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      )}
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Selecione múltiplos arquivos XML</span>
                      </p>
                      <p className="text-xs text-gray-500">Um arquivo por nota fiscal</p>
                    </div>
                    <input 
                      id="xml-multiple-upload" 
                      type="file" 
                      className="hidden" 
                      accept=".xml"
                      multiple
                      onChange={handleBatchXmlUpload}
                      disabled={isLoading}
                    />
                  </label>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="manual" className="py-4">
              <div className="text-sm text-gray-500 mb-4">
                Cadastre manualmente as notas fiscais e volumes na seção abaixo.
              </div>
            </TabsContent>
            
            <TabsContent value="excel" className="py-4">
              <div className="border rounded-md p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Arquivo Excel/CSV</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadTemplate}
                    className="flex items-center gap-1"
                    type="button"
                  >
                    <Download className="h-4 w-4" /> Baixar Modelo
                  </Button>
                </div>
                
                <div className="flex flex-col items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {isLoading ? (
                        <Loader2 className="w-10 h-10 mb-3 text-gray-400 animate-spin" />
                      ) : (
                        <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      )}
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Clique para fazer upload</span> ou arraste e solte
                      </p>
                      <p className="text-xs text-gray-500">Arquivos Excel (.xlsx, .xls) ou CSV (.csv)</p>
                    </div>
                    <input 
                      id="excel-upload" 
                      type="file" 
                      className="hidden" 
                      accept=".xlsx,.xls,.csv"
                      onChange={handleExcelUpload}
                      disabled={isLoading}
                    />
                  </label>
                </div>
                
                <div className="text-xs text-gray-500">
                  <p>Faça download do modelo acima e preencha conforme as instruções:</p>
                  <ul className="list-disc list-inside mt-1">
                    <li>Mantenha a estrutura do arquivo sem alterar as colunas</li>
                    <li>Para volumes da mesma nota fiscal, repita o número da NF em linhas diferentes</li>
                    <li>Salve o arquivo como Excel (.xlsx) ou CSV (.csv) antes de fazer o upload</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Gerenciamento de Notas Fiscais e Volumes */}
          <NotasFiscaisManager 
            notasFiscais={formData.notasFiscais}
            onChangeNotasFiscais={(notasFiscais) => handleInputChange('notasFiscais', notasFiscais)}
          />
          
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea 
              id="observacoes" 
              placeholder="Informações adicionais"
              value={formData.observacoes}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>Cancelar</Button>
          <Button 
            className="bg-cross-blue hover:bg-cross-blueDark"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...
              </>
            ) : (
              'Solicitar Coleta'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NovaSolicitacaoDialog;
