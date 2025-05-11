
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotaFiscalVolume } from '../../utils/volumeCalculations';
import XmlImportForm from '../importacao/XmlImportForm';
import ExcelImportForm from '../importacao/ExcelImportForm';

interface ImportacaoTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onImportSuccess: (notasFiscais: NotaFiscalVolume[]) => void;
}

const ImportacaoTabs: React.FC<ImportacaoTabsProps> = ({ 
  activeTab, 
  setActiveTab, 
  onImportSuccess 
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="unica">NF Única</TabsTrigger>
        <TabsTrigger value="lote">NF em Lote</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
        <TabsTrigger value="excel">Importar Excel</TabsTrigger>
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
        <div className="text-sm text-gray-500 mb-4">
          Cadastre manualmente as notas fiscais e volumes na seção abaixo.
        </div>
      </TabsContent>
      
      <TabsContent value="excel" className="py-4">
        <ExcelImportForm onImportSuccess={onImportSuccess} />
      </TabsContent>
    </Tabs>
  );
};

export default ImportacaoTabs;
