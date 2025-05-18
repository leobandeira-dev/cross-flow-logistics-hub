
import React, { useState } from 'react';
import { SolicitacaoFormData } from './SolicitacaoTypes';
import { Card, CardContent } from '@/components/ui/card';
import NotasFiscaisManager from '../NotasFiscaisManager';
import ImportacaoTabs from './ImportacaoTabs';
import EmpresaInfoForm from './EmpresaInfoForm';
import SolicitacaoFormHeader from './formHeader/SolicitacaoFormHeader';

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

  // Calculate totals from all invoices for header display
  const calcularTotais = () => {
    let valorTotal = 0;
    let pesoTotal = 0;
    let volumeTotal = 0;
    let quantidadeVolumes = 0;
    
    formData.notasFiscais.forEach(nf => {
      valorTotal += nf.valorTotal || 0;
      pesoTotal += nf.pesoTotal || 0;
      
      // Calculate volumes
      nf.volumes.forEach(vol => {
        quantidadeVolumes += vol.quantidade || 0;
        volumeTotal += (vol.altura * vol.largura * vol.comprimento * vol.quantidade) / 1000000;
      });
    });
    
    return {
      valorTotal,
      pesoTotal,
      volumeTotal,
      quantidadeVolumes
    };
  };
  
  // Get calculated totals
  const totais = calcularTotais();
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4">Cabeçalho da Solicitação</h3>
          <SolicitacaoFormHeader 
            cliente={formData.cliente}
            dataColeta={formData.dataColeta}
            horaColeta={formData.horaColeta}
            dataAprovacao={formData.dataAprovacao}
            horaAprovacao={formData.horaAprovacao}
            dataInclusao={formData.dataInclusao}
            horaInclusao={formData.horaInclusao}
            origem={formData.origem}
            origemEndereco={formData.origemEndereco}
            origemCEP={formData.origemCEP}
            destino={formData.destino}
            destinoEndereco={formData.destinoEndereco}
            destinoCEP={formData.destinoCEP}
            onClienteChange={(cliente) => handleInputChange('cliente', cliente)}
            onDataColetaChange={(data) => handleInputChange('dataColeta', data)}
            onHoraColetaChange={(hora) => handleInputChange('horaColeta', hora)}
            onOrigemChange={(origem) => handleInputChange('origem', origem)}
            onDestinoChange={(destino) => handleInputChange('destino', destino)}
            readOnlyAddresses={formData.notasFiscais.length > 0}
          />
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-gray-50 p-3 rounded">
              <span className="block text-xs text-gray-500">Valor Total</span>
              <span className="text-lg font-semibold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totais.valorTotal)}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="block text-xs text-gray-500">Peso Total</span>
              <span className="text-lg font-semibold">{totais.pesoTotal.toFixed(2)} kg</span>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="block text-xs text-gray-500">Volume Total</span>
              <span className="text-lg font-semibold">{totais.volumeTotal.toFixed(3)} m³ ({totais.quantidadeVolumes} volumes)</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
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
