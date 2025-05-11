
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotaFiscalVolume } from '../../utils/volumeCalculations';
import XmlImportForm from '../importacao/XmlImportForm';
import ExcelImportForm from '../importacao/ExcelImportForm';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, FileText, Table } from 'lucide-react';

interface ImportacaoTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onImportSuccess: (notasFiscais: NotaFiscalVolume[], remetenteInfo?: any, destinatarioInfo?: any) => void;
  isLoading?: boolean;
}

const ImportacaoTabs: React.FC<ImportacaoTabsProps> = ({ 
  activeTab, 
  setActiveTab, 
  onImportSuccess,
  isLoading = false
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="unica" disabled={isLoading}>
          <FileText className="h-4 w-4 mr-2" />
          NF Única
        </TabsTrigger>
        <TabsTrigger value="lote" disabled={isLoading}>
          <Upload className="h-4 w-4 mr-2" />
          NF em Lote
        </TabsTrigger>
        <TabsTrigger value="manual" disabled={isLoading}>
          <Table className="h-4 w-4 mr-2" />
          Manual
        </TabsTrigger>
        <TabsTrigger value="excel" disabled={isLoading}>
          <FileText className="h-4 w-4 mr-2" />
          Importar Excel
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="unica" className="space-y-4 py-4">
        <XmlImportForm 
          onImportSuccess={onImportSuccess}
          isSingleFile={true}
        />
      </TabsContent>
      
      <TabsContent value="lote" className="py-4">
        <XmlImportForm 
          onImportSuccess={onImportSuccess}
          isSingleFile={false}
        />
      </TabsContent>
      
      <TabsContent value="manual" className="py-4">
        <div className="text-sm text-gray-500 mb-4 p-4 bg-gray-50 rounded-md border border-gray-200">
          <p className="font-medium mb-2">Cadastro Manual</p>
          <p>Cadastre manualmente as notas fiscais e volumes na seção abaixo.</p>
          <p className="mt-2">Para adicionar uma nota fiscal, clique no botão "Adicionar Nota Fiscal" na seção de Notas Fiscais.</p>
        </div>
      </TabsContent>
      
      <TabsContent value="excel" className="py-4">
        <ExcelImportForm onImportSuccess={onImportSuccess} />
      </TabsContent>
    </Tabs>
  );
};

export default ImportacaoTabs;
