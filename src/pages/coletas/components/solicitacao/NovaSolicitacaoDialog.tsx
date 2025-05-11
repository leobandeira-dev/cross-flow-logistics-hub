
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { NotaFiscalVolume } from '../../utils/volumeCalculations';
import NotasFiscaisManager from '../NotasFiscaisManager';
import EmpresaInfoForm, { EMPTY_EMPRESA } from './EmpresaInfoForm';
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
    remetente: EMPTY_EMPRESA,
    destinatario: EMPTY_EMPRESA,
    dataColeta: '',
    observacoes: '',
    notasFiscais: []
  });

  // Effect to update remetente/destinatario when XML data changes
  useEffect(() => {
    if (formData.remetenteInfo) {
      const newRemetente = {
        cnpj: formData.remetenteInfo.cnpj || '',
        razaoSocial: formData.remetenteInfo.nome || '',
        nomeFantasia: formData.remetenteInfo.nome || '',
        endereco: {
          logradouro: formData.remetenteInfo.endereco?.logradouro || '',
          numero: formData.remetenteInfo.endereco?.numero || '',
          complemento: formData.remetenteInfo.endereco?.complemento || '',
          bairro: formData.remetenteInfo.endereco?.bairro || '',
          cidade: formData.remetenteInfo.endereco?.cidade || '',
          uf: formData.remetenteInfo.endereco?.uf || '',
          cep: formData.remetenteInfo.endereco?.cep || '',
        },
        enderecoFormatado: formData.remetenteInfo.enderecoFormatado || ''
      };
      
      setFormData(prev => ({
        ...prev,
        remetente: newRemetente
      }));
    }
    
    if (formData.destinatarioInfo) {
      const newDestinatario = {
        cnpj: formData.destinatarioInfo.cnpj || '',
        cpf: formData.destinatarioInfo.cpf || '',
        razaoSocial: formData.destinatarioInfo.nome || '',
        nomeFantasia: formData.destinatarioInfo.nome || '',
        endereco: {
          logradouro: formData.destinatarioInfo.endereco?.logradouro || '',
          numero: formData.destinatarioInfo.endereco?.numero || '',
          complemento: formData.destinatarioInfo.endereco?.complemento || '',
          bairro: formData.destinatarioInfo.endereco?.bairro || '',
          cidade: formData.destinatarioInfo.endereco?.cidade || '',
          uf: formData.destinatarioInfo.endereco?.uf || '',
          cep: formData.destinatarioInfo.endereco?.cep || '',
        },
        enderecoFormatado: formData.destinatarioInfo.enderecoFormatado || ''
      };
      
      setFormData(prev => ({
        ...prev,
        destinatario: newDestinatario
      }));
    }
  }, [formData.remetenteInfo, formData.destinatarioInfo]);

  const handleInputChange = <K extends keyof SolicitacaoFormData>(field: K, value: SolicitacaoFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (formData.notasFiscais.length === 0) {
        toast({
          title: "Nenhuma nota fiscal",
          description: "Adicione pelo menos uma nota fiscal para continuar.",
          variant: "destructive"
        });
        return false;
      }
      
      if (!formData.remetente.cnpj && !formData.remetente.cpf) {
        toast({
          title: "Campo obrigatório",
          description: "Informe o CNPJ ou CPF do remetente.",
          variant: "destructive"
        });
        return false;
      }
      
      if (!formData.destinatario.cnpj && !formData.destinatario.cpf) {
        toast({
          title: "Campo obrigatório",
          description: "Informe o CNPJ ou CPF do destinatário.",
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
      setCurrentStep(current => Math.min(current + 1, 2));
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
        remetente: EMPTY_EMPRESA,
        destinatario: EMPTY_EMPRESA,
        dataColeta: '',
        observacoes: '',
        notasFiscais: []
      });
      setCurrentStep(1);
      setIsOpen(false);
    }, 1500);
  };

  const handleImportSuccess = (notasFiscais: NotaFiscalVolume[], remetenteInfo?: any, destinatarioInfo?: any) => {
    setFormData(prev => ({
      ...prev,
      notasFiscais,
      remetenteInfo,
      destinatarioInfo
    }));
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <>
            <ImportacaoTabs 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onImportSuccess={handleImportSuccess}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EmpresaInfoForm 
                tipo="remetente"
                dados={formData.remetente}
                onDadosChange={(dados) => handleInputChange('remetente', dados)}
                readOnly={!!formData.remetenteInfo}
              />
              
              <EmpresaInfoForm 
                tipo="destinatario"
                dados={formData.destinatario}
                onDadosChange={(dados) => handleInputChange('destinatario', dados)}
                readOnly={!!formData.destinatarioInfo}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <NotasFiscaisManager 
              notasFiscais={formData.notasFiscais}
              onChangeNotasFiscais={(notasFiscais) => handleInputChange('notasFiscais', notasFiscais)}
            />
          </>
        );
      case 2:
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Remetente:</p>
                  <p>{formData.remetente.razaoSocial}</p>
                  <p className="text-sm">{formData.remetente.cnpj}</p>
                  <p className="text-xs text-gray-500 mt-1">{formData.remetente.enderecoFormatado}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Destinatário:</p>
                  <p>{formData.destinatario.razaoSocial}</p>
                  <p className="text-sm">{formData.destinatario.cnpj || formData.destinatario.cpf}</p>
                  <p className="text-xs text-gray-500 mt-1">{formData.destinatario.enderecoFormatado}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Data da Coleta:</p>
                  <p>{formData.dataColeta || 'Não informada'}</p>
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
        
        <SolicitacaoProgress currentStep={currentStep} totalSteps={2} />
        
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
