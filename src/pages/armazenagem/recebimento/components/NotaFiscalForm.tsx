
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { notaFiscalSchema, NotaFiscalSchemaType } from './forms/notaFiscalSchema';
import { useNotaFiscalForm } from './forms/useNotaFiscalForm';
import CadastroManual from './forms/CadastroManual';
import ImportarPorChave from './forms/ImportarPorChave';
import ImportarViaXMLWithSave from './forms/ImportarViaXMLWithSave';
import ImportarXMLEmLoteWithSave from './forms/ImportarXMLEmLoteWithSave';

const NotaFiscalForm: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('manual');
  const [importedNotas, setImportedNotas] = useState<any[]>([]);
  
  const form = useForm<NotaFiscalSchemaType>({
    resolver: zodResolver(notaFiscalSchema),
    defaultValues: {
      currentTab: 'manual',
      numeroNF: '',
      serieNF: '',
      chaveNF: '',
      valorTotal: '0',
      pesoTotalBruto: '0',
      volumesTotal: '0',
      emitenteRazaoSocial: '',
      emitenteCNPJ: '',
      destinatarioRazaoSocial: '',
      destinatarioCNPJ: '',
    }
  });

  const { handleSubmit, handleFileUpload, handleKeySearch, isLoading } = useNotaFiscalForm();

  const handleFormPopulated = (formData: any) => {
    // Populate form fields with imported data
    Object.entries(formData).forEach(([field, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        form.setValue(field as keyof NotaFiscalSchemaType, String(value));
      }
    });
    
    form.setValue('currentTab', 'xml');
    setCurrentTab('xml');
  };

  const handleNotasImported = (notas: any[]) => {
    setImportedNotas(notas);
    setCurrentTab('lote');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Cadastro de Nota Fiscal</h2>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="manual">Cadastro Manual</TabsTrigger>
          <TabsTrigger value="chave">Buscar por Chave</TabsTrigger>
          <TabsTrigger value="xml">Importar XML</TabsTrigger>
          <TabsTrigger value="lote">Importar em Lote</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual">
          <CadastroManual 
            onSubmit={handleSubmit} 
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="chave">
          <ImportarPorChave 
            onBuscarNota={() => handleKeySearch(form.getValues, form.setValue)}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="xml">
          <ImportarViaXMLWithSave 
            onFormPopulated={handleFormPopulated}
          />
        </TabsContent>
        
        <TabsContent value="lote">
          <ImportarXMLEmLoteWithSave 
            handleNotasImported={handleNotasImported}
          />
          
          {importedNotas.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Notas Importadas ({importedNotas.length})</h3>
              <div className="space-y-2">
                {importedNotas.map((nota, index) => (
                  <div key={index} className="border rounded p-3 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">NF: {nota.numero}</span>
                      <span className="text-sm text-gray-600">
                        Valor: R$ {parseFloat(nota.valor_total || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Emitente: {nota.emitente_razao_social}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotaFiscalForm;
