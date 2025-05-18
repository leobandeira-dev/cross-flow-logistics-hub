
import React, { useState } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X } from 'lucide-react';
import ConfirmationDialog from '@/components/carregamento/enderecamento/ConfirmationDialog';

// Import schema and types
import { notaFiscalSchema, defaultValues, NotaFiscalSchemaType } from './forms/notaFiscalSchema';

// Import form sections
import ImportarPorChave from './forms/ImportarPorChave';
import ImportarViaXML from './forms/ImportarViaXML';
import CadastroManual from './forms/CadastroManual';
import DadosNotaFiscal from './forms/DadosNotaFiscal';
import DadosEmitente from './forms/DadosEmitente';
import DadosDestinatario from './forms/DadosDestinatario';
import InformacoesAdicionais from './forms/InformacoesAdicionais';
import InformacoesTransporte from './forms/InformacoesTransporte';
import InformacoesComplementares from './forms/InformacoesComplementares';

// Import custom hook for form logic
import { useNotaFiscalForm } from './forms/useNotaFiscalForm';

const NotaFiscalForm: React.FC = () => {
  const form = useForm<NotaFiscalSchemaType>({
    resolver: zodResolver(notaFiscalSchema),
    defaultValues,
  });
  
  const { handleSubmit, handleFileUpload, handleKeySearch, isLoading } = useNotaFiscalForm();
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  
  const onSubmit = (data: NotaFiscalSchemaType) => {
    setConfirmSubmitOpen(true);
  };
  
  const onConfirmSubmit = () => {
    const data = form.getValues();
    handleSubmit(data);
    form.reset(defaultValues);
  };
  
  const handleCancel = () => {
    setConfirmCancelOpen(true);
  };
  
  const onConfirmCancel = () => {
    form.reset(defaultValues);
  };
  
  const handleClear = () => {
    form.reset(defaultValues);
  };

  // Handle file uploads for batch processing
  const handleBatchFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Override handleFileUpload to handle multiple files
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      // Process each file
      files.forEach(file => {
        const syntheticEvent = {
          target: {
            files: [file] as unknown as FileList
          }
        } as React.ChangeEvent<HTMLInputElement>;
        
        handleFileUpload(syntheticEvent, form.setValue);
      });
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="chave" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="chave">Importar por Chave de Acesso</TabsTrigger>
              <TabsTrigger value="xml">Importar via XML</TabsTrigger>
              <TabsTrigger value="manual">Cadastro Manual</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chave" className="space-y-4 py-4">
              <ImportarPorChave 
                onBuscarNota={() => handleKeySearch(form.getValues, form.setValue)} 
                isLoading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="xml" className="space-y-4 py-4">
              <ImportarViaXML 
                onFileUpload={(e) => {
                  if (e.target.multiple) {
                    handleBatchFileUpload(e);
                  } else {
                    handleFileUpload(e, form.setValue);
                  }
                }} 
                isLoading={isLoading}
              />
            </TabsContent>
            
            <TabsContent value="manual" className="py-4">
              <CadastroManual />
            </TabsContent>
          </Tabs>

          {/* Formulário de dados da nota fiscal */}
          <DadosNotaFiscal />
          <DadosEmitente />
          <DadosDestinatario />
          <InformacoesAdicionais />
          <InformacoesTransporte />
          <InformacoesComplementares />

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClear}
              disabled={isLoading}
              className="flex items-center"
            >
              <X className="mr-2 h-4 w-4" />
              Limpar
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-cross-blue hover:bg-cross-blue/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                'Cadastrar Nota Fiscal'
              )}
            </Button>
          </div>
        </form>
      </Form>

      <ConfirmationDialog
        open={confirmSubmitOpen}
        onOpenChange={setConfirmSubmitOpen}
        onConfirm={onConfirmSubmit}
        title="Confirmar cadastro"
        description="Deseja confirmar o cadastro desta nota fiscal?"
      />

      <ConfirmationDialog
        open={confirmCancelOpen}
        onOpenChange={setConfirmCancelOpen}
        onConfirm={onConfirmCancel}
        title="Cancelar cadastro"
        description="Deseja cancelar o cadastro? Todos os dados inseridos serão perdidos."
      />
    </>
  );
};

export default NotaFiscalForm;
