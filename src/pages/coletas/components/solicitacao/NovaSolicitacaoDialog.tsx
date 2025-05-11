
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { NotaFiscalVolume } from '../../utils/volumeCalculations';
import NotasFiscaisManager from '../NotasFiscaisManager';
import SolicitacaoFormHeader from './SolicitacaoFormHeader';
import ImportacaoTabs from './ImportacaoTabs';
import { SolicitacaoDialogProps, SolicitacaoFormData } from './SolicitacaoTypes';

const NovaSolicitacaoDialog: React.FC<SolicitacaoDialogProps> = ({ 
  isOpen, 
  setIsOpen,
  activeTab,
  setActiveTab
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SolicitacaoFormData>({
    cliente: '',
    origem: '',
    destino: '',
    dataColeta: '',
    observacoes: '',
    notasFiscais: []
  });

  const handleInputChange = (field: keyof SolicitacaoFormData, value: any) => {
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

  const handleImportSuccess = (notasFiscais: NotaFiscalVolume[]) => {
    setFormData(prev => ({
      ...prev,
      notasFiscais
    }));
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
          <SolicitacaoFormHeader 
            cliente={formData.cliente}
            dataColeta={formData.dataColeta}
            origem={formData.origem}
            destino={formData.destino}
            onClienteChange={(value) => handleInputChange('cliente', value)}
            onDataColetaChange={(value) => handleInputChange('dataColeta', value)}
            onOrigemChange={(value) => handleInputChange('origem', value)}
            onDestinoChange={(value) => handleInputChange('destino', value)}
          />

          <ImportacaoTabs 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onImportSuccess={handleImportSuccess}
          />

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
