
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotaFiscalVolume } from '../../utils/volumeCalculations';
import NotasFiscaisManager from '../NotasFiscaisManager';
import ImportTabContent from './ImportTabContent';
import BatchImportTabContent from './BatchImportTabContent';
import ManualTabContent from './ManualTabContent';
import ExcelImportTabContent from './ExcelImportTabContent';

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
          <ImportTabContent isLoading={isLoading} handleUpload={handleSingleXmlUpload} />
        </TabsContent>
        
        <TabsContent value="lote" className="py-4">
          <BatchImportTabContent isLoading={isLoading} handleUpload={handleBatchXmlUpload} />
        </TabsContent>
        
        <TabsContent value="manual" className="py-4">
          <ManualTabContent />
        </TabsContent>
        
        <TabsContent value="excel" className="py-4">
          <ExcelImportTabContent 
            isLoading={isLoading} 
            handleUpload={handleExcelUpload} 
            handleDownloadTemplate={handleDownloadTemplate} 
          />
        </TabsContent>
      </Tabs>

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
