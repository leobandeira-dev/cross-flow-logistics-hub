
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import NotasFiscaisManager from '../NotasFiscaisManager';
import EmpresaInfoForm from './EmpresaInfoForm';
import ImportacaoTabs from './ImportacaoTabs';
import { SolicitacaoFormData } from './SolicitacaoTypes';
import { NotaFiscalVolume } from '../../utils/volumeCalculations';

interface NotasFiscaisStepProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  formData: SolicitacaoFormData;
  onImportSuccess: (notasFiscais: NotaFiscalVolume[], remetenteInfo?: any, destinatarioInfo?: any) => void;
  onChangeRemetente: (dados: any) => void;
  onChangeDestinatario: (dados: any) => void;
  onChangeDataColeta: (data: string) => void;
  onChangeNotasFiscais: (notasFiscais: NotaFiscalVolume[]) => void;
}

const NotasFiscaisStep: React.FC<NotasFiscaisStepProps> = ({
  activeTab,
  setActiveTab,
  formData,
  onImportSuccess,
  onChangeRemetente,
  onChangeDestinatario,
  onChangeDataColeta,
  onChangeNotasFiscais
}) => {
  return (
    <>
      <ImportacaoTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onImportSuccess={onImportSuccess}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmpresaInfoForm 
          tipo="remetente"
          dados={formData.remetente}
          onDadosChange={onChangeRemetente}
          readOnly={!!formData.remetenteInfo}
        />
        
        <EmpresaInfoForm 
          tipo="destinatario"
          dados={formData.destinatario}
          onDadosChange={onChangeDestinatario}
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
            onChange={(e) => onChangeDataColeta(e.target.value)}
          />
        </div>
      </div>

      <NotasFiscaisManager 
        notasFiscais={formData.notasFiscais}
        onChangeNotasFiscais={onChangeNotasFiscais}
      />
    </>
  );
};

export default NotasFiscaisStep;
