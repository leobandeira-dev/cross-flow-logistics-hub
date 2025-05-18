
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SolicitacaoFormData } from './SolicitacaoTypes';

interface ObservacoesStepProps {
  formData: SolicitacaoFormData;
  handleInputChange: <K extends keyof SolicitacaoFormData>(field: K, value: SolicitacaoFormData[K]) => void;
}

const ObservacoesStep: React.FC<ObservacoesStepProps> = ({ formData, handleInputChange }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4">Informações Adicionais</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes || ''}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                placeholder="Digite aqui observações importantes sobre a coleta..."
                className="min-h-[150px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4">Resumo da Solicitação</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <span className="block text-xs text-gray-500">Cliente</span>
              <span className="text-base font-medium">{formData.cliente || 'Não informado'}</span>
            </div>
            
            <div className="bg-gray-50 p-3 rounded">
              <span className="block text-xs text-gray-500">Data da Coleta</span>
              <span className="text-base font-medium">
                {formData.dataColeta ? new Date(formData.dataColeta).toLocaleDateString('pt-BR') : 'Não informada'}
                {formData.horaColeta ? ` às ${formData.horaColeta}` : ''}
              </span>
            </div>
            
            <div className="bg-gray-50 p-3 rounded">
              <span className="block text-xs text-gray-500">Origem</span>
              <span className="text-base font-medium">{formData.origem || 'Não informada'}</span>
            </div>
            
            <div className="bg-gray-50 p-3 rounded">
              <span className="block text-xs text-gray-500">Destino</span>
              <span className="text-base font-medium">{formData.destino || 'Não informado'}</span>
            </div>
            
            <div className="bg-gray-50 p-3 rounded">
              <span className="block text-xs text-gray-500">Notas Fiscais</span>
              <span className="text-base font-medium">{formData.notasFiscais.length} nota(s) fiscal(is)</span>
            </div>
            
            <div className="bg-gray-50 p-3 rounded">
              <span className="block text-xs text-gray-500">Volumes</span>
              <span className="text-base font-medium">
                {formData.notasFiscais.reduce((acc, nf) => 
                  acc + nf.volumes.reduce((sum, vol) => sum + vol.quantidade, 0), 0)} volume(s)
              </span>
            </div>
            
            <div className="col-span-full bg-gray-50 p-3 rounded">
              <span className="block text-xs text-gray-500">Remetente</span>
              <span className="text-base font-medium">{formData.remetente?.razaoSocial || 'Não informado'}</span>
              <span className="block text-xs text-gray-600 mt-1">
                {formData.remetente && `${formData.remetente.endereco}, ${formData.remetente.numero} - ${formData.remetente.cidade}/${formData.remetente.uf}`}
              </span>
            </div>
            
            <div className="col-span-full bg-gray-50 p-3 rounded">
              <span className="block text-xs text-gray-500">Destinatário</span>
              <span className="text-base font-medium">{formData.destinatario?.razaoSocial || 'Não informado'}</span>
              <span className="block text-xs text-gray-600 mt-1">
                {formData.destinatario && `${formData.destinatario.endereco}, ${formData.destinatario.numero} - ${formData.destinatario.cidade}/${formData.destinatario.uf}`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ObservacoesStep;
