
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SolicitacaoFormData } from './SolicitacaoTypes';

interface ConfirmationStepProps {
  formData: SolicitacaoFormData;
  onChangeObservacoes: (value: string) => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ 
  formData, 
  onChangeObservacoes 
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea 
          id="observacoes" 
          placeholder="Informações adicionais"
          value={formData.observacoes}
          onChange={(e) => onChangeObservacoes(e.target.value)}
        />
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md border">
        <h3 className="font-medium text-lg mb-2">Resumo da Solicitação</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Remetente:</p>
            <p>{formData.remetente.razaoSocial}</p>
            <p className="text-sm">{formData.remetente.cnpj}</p>
            <p className="text-xs text-gray-500 mt-1">{formData.remetente.enderecoFormatado}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Destinatário:</p>
            <p>{formData.destinatario.razaoSocial}</p>
            <p className="text-sm">{formData.destinatario.cnpj || formData.destinatario.cpf}</p>
            <p className="text-xs text-gray-500 mt-1">{formData.destinatario.enderecoFormatado}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Data da Coleta:</p>
            <p>{formData.dataColeta || 'Não informada'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Notas Fiscais:</p>
            <p>{formData.notasFiscais.length}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Volumes:</p>
            <p>{formData.notasFiscais.reduce((acc, nf) => acc + nf.volumes.length, 0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationStep;
