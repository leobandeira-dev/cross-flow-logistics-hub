
import React, { useState } from 'react';
import { SolicitacaoFormData } from './SolicitacaoTypes';
import { Card, CardContent } from '@/components/ui/card';
import NotasFiscaisManager from '../NotasFiscaisManager';
import ImportacaoTabs from './ImportacaoTabs';
import EmpresaInfoForm from './EmpresaInfoForm';

interface NotasFiscaisStepProps {
  formData: SolicitacaoFormData;
  handleInputChange: <K extends keyof SolicitacaoFormData>(field: K, value: SolicitacaoFormData[K]) => void;
  handleImportSuccess: (notasFiscais: any[], remetenteInfo?: any, destinatarioInfo?: any) => void;
  isImporting?: boolean;
}

const NotasFiscaisStep: React.FC<NotasFiscaisStepProps> = ({ 
  formData, 
  handleInputChange, 
  handleImportSuccess,
  isImporting = false
}) => {
  const [activeTab, setActiveTab] = useState('unica');

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4">Importação de Notas Fiscais</h3>
          <ImportacaoTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onImportSuccess={handleImportSuccess}
            isLoading={isImporting}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <NotasFiscaisManager 
            notasFiscais={formData.notasFiscais}
            onChangeNotasFiscais={(notasFiscais) => handleInputChange('notasFiscais', notasFiscais)}
            isLoading={isImporting}
          />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-4">Dados do Remetente</h3>
            <EmpresaInfoForm
              tipo="remetente"
              dados={formData.remetente}
              onDadosChange={(remetente) => handleInputChange('remetente', remetente)}
              label="Remetente"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-4">Dados do Destinatário</h3>
            <EmpresaInfoForm
              tipo="destinatario"
              dados={formData.destinatario}
              onDadosChange={(destinatario) => handleInputChange('destinatario', destinatario)}
              label="Destinatário"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotasFiscaisStep;
