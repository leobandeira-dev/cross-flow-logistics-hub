
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
  
  const { handleSubmit, handleFileUpload, handleKeySearch } = useNotaFiscalForm();
  
  const onSubmit = (data: NotaFiscalSchemaType) => {
    handleSubmit(data);
  };

  return (
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
            />
          </TabsContent>
          
          <TabsContent value="xml" className="space-y-4 py-4">
            <ImportarViaXML 
              onFileUpload={(e) => handleFileUpload(e, form.setValue)} 
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
          <Button type="button" variant="outline">Cancelar</Button>
          <Button type="submit" className="bg-cross-blue hover:bg-cross-blue/90">
            Cadastrar Nota Fiscal
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NotaFiscalForm;
