
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotaFiscalVolume } from '../../../utils/volumeCalculations';
import NotasFiscaisManager from '../../NotasFiscaisManager';
import ClienteDataSection from './ClienteDataSection';
import ImportTabs from './ImportTabs';

interface SolicitacaoFormProps {
  formData: {
    cliente: string;
    origem: string;
    destino: string;
    dataColeta: string;
    observacoes: string;
    notasFiscais: NotaFiscalVolume[];
    [key: string]: any;
  };
  handleInputChange: (field: string, value: any) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoading: boolean;
  handleSingleXmlUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleBatchXmlUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleExcelUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleDownloadTemplate: () => void;
}

const SolicitacaoForm: React.FC<SolicitacaoFormProps> = ({
  formData,
  handleInputChange,
  activeTab,
  setActiveTab,
  isLoading,
  handleSingleXmlUpload,
  handleBatchXmlUpload,
  handleExcelUpload,
  handleDownloadTemplate
}) => {
  return (
    <div className="grid gap-6 py-4">
      <ClienteDataSection 
        formData={formData} 
        handleInputChange={handleInputChange} 
      />
      
      <ImportTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoading={isLoading}
        handleSingleXmlUpload={handleSingleXmlUpload}
        handleBatchXmlUpload={handleBatchXmlUpload}
        handleExcelUpload={handleExcelUpload}
        handleDownloadTemplate={handleDownloadTemplate}
      />

      {/* Gerenciamento de Notas Fiscais e Volumes */}
      <NotasFiscaisManager 
        notasFiscais={formData.notasFiscais}
        onChangeNotasFiscais={(notasFiscais) => handleInputChange('notasFiscais', notasFiscais)}
        isLoading={isLoading}
      />
    </div>
  );
};

export default SolicitacaoForm;
