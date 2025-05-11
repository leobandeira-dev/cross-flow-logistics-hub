
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
import SolicitacaoProgress from './SolicitacaoProgress';

const NovaSolicitacaoDialog: React.FC<SolicitacaoDialogProps> = ({ 
  isOpen, 
  setIsOpen,
  activeTab,
  setActiveTab
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
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

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!formData.cliente) {
        toast({
          title: "Campo obrigatório",
          description: "Selecione um cliente.",
          variant: "destructive"
        });
        return false;
      }

      if (!formData.origem || !formData.destino) {
        toast({
          title: "Campos obrigatórios",
          description: "Informe os endereços de origem e destino.",
          variant: "destructive"
        });
        return false;
      }

      if (!formData.dataColeta) {
        toast({
          title: "Campo obrigatório",
          description: "Informe a data da coleta.",
          variant: "destructive"
        });
        return false;
      }
      return true;
    }
    
    if (step === 2) {
      if (formData.notasFiscais.length === 0) {
        toast({
          title: "Nenhuma nota fiscal",
          description: "Adicione pelo menos uma nota fiscal para continuar.",
          variant: "destructive"
        });
        return false;
      }
      return true;
    }
    
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(current => Math.min(current + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(current => Math.max(current - 1, 1));
  };

  const handleSubmit = () => {
    setIsLoading(true);
    
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
      setCurrentStep(1);
      setIsOpen(false);
    }, 1500);
  };

  const handleImportSuccess = (notasFiscais: NotaFiscalVolume[]) => {
    setFormData(prev => ({
      ...prev,
      notasFiscais
    }));
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
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
        );
      case 2:
        return (
          <>
            <ImportacaoTabs 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onImportSuccess={handleImportSuccess}
            />

            <NotasFiscaisManager 
              notasFiscais={formData.notasFiscais}
              onChangeNotasFiscais={(notasFiscais) => handleInputChange('notasFiscais', notasFiscais)}
            />
          </>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea 
                id="observacoes" 
                placeholder="Informações adicionais"
                value={formData.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
              />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md border">
              <h3 className="font-medium text-lg mb-2">Resumo da Solicitação</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Cliente:</p>
                  <p>{formData.cliente === 'abc' ? 'Indústria ABC Ltda' : 
                     formData.cliente === 'xyz' ? 'Distribuidora XYZ' : 
                     formData.cliente === 'rapidos' ? 'Transportes Rápidos' : '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Data da Coleta:</p>
                  <p>{formData.dataColeta}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Origem:</p>
                  <p>{formData.origem}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Destino:</p>
                  <p>{formData.destino}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Notas Fiscais:</p>
                  <p>{formData.notasFiscais.length}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Volumes:</p>
                  <p>{formData.notasFiscais.reduce((acc, nf) => acc + nf.volumes.length, 0)}</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderFooter = () => {
    if (currentStep === 1) {
      return (
        <>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>Cancelar</Button>
          <Button 
            className="bg-cross-blue hover:bg-cross-blueDark"
            onClick={nextStep}
          >
            Continuar
          </Button>
        </>
      );
    } else if (currentStep === 2) {
      return (
        <>
          <Button variant="outline" onClick={prevStep} disabled={isLoading}>Voltar</Button>
          <Button 
            className="bg-cross-blue hover:bg-cross-blueDark"
            onClick={nextStep}
          >
            Continuar
          </Button>
        </>
      );
    } else {
      return (
        <>
          <Button variant="outline" onClick={prevStep} disabled={isLoading}>Voltar</Button>
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
        </>
      );
    }
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
        
        <SolicitacaoProgress currentStep={currentStep} />
        
        <div className="grid gap-6 py-4">
          {renderStep()}
        </div>
        
        <DialogFooter>
          {renderFooter()}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NovaSolicitacaoDialog;
