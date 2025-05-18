
import React from 'react';
import { InternalFormData } from './hooks/solicitacaoFormTypes';
import { Card, CardContent } from '@/components/ui/card';
import { calcularTotaisColeta, formatarNumero, formatarMoeda } from '../../utils/volumes/index';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ConfirmationStepProps {
  formData: InternalFormData;
  handleInputChange: <K extends keyof InternalFormData>(field: K, value: InternalFormData[K]) => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ formData, handleInputChange }) => {
  // Calculate totals
  const totais = calcularTotaisColeta(formData.notasFiscais);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-4">Resumo da Solicitação</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="block text-xs text-gray-500">Tipo de Frete</span>
              <span className="font-medium">{formData.tipoFrete}</span>
            </div>
            <div>
              <span className="block text-xs text-gray-500">Data da Coleta</span>
              <span className="font-medium">
                {new Date(formData.dataColeta).toLocaleDateString('pt-BR')}
                {formData.horaColeta && ` às ${formData.horaColeta}`}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="block text-xs text-gray-500">Remetente</span>
              <span className="font-medium">{formData.remetente.razaoSocial}</span>
              <span className="block text-xs">CNPJ: {formData.remetente.cnpj}</span>
              <span className="block text-xs text-gray-500">
                {formData.remetente.endereco}, {formData.remetente.numero} - {formData.remetente.bairro}, {formData.remetente.cidade} - {formData.remetente.uf}
              </span>
            </div>
            <div>
              <span className="block text-xs text-gray-500">Destinatário</span>
              <span className="font-medium">{formData.destinatario.razaoSocial}</span>
              <span className="block text-xs">CNPJ: {formData.destinatario.cnpj}</span>
              <span className="block text-xs text-gray-500">
                {formData.destinatario.endereco}, {formData.destinatario.numero} - {formData.destinatario.bairro}, {formData.destinatario.cidade} - {formData.destinatario.uf}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-gray-50 p-3 rounded">
              <span className="block text-xs text-gray-500">Valor Total</span>
              <span className="font-semibold">{formatarMoeda(formData.notasFiscais.reduce((sum, nf) => sum + nf.valorTotal, 0))}</span>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="block text-xs text-gray-500">Peso Total</span>
              <span className="font-semibold">{formatarNumero(totais.pesoTotal)} kg</span>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <span className="block text-xs text-gray-500">Volume Total</span>
              <span className="font-semibold">{formatarNumero(totais.volumeTotal)} m³</span>
            </div>
          </div>
          
          <div className="mt-4">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={formData.observacoes || ''}
              onChange={(e) => handleInputChange('observacoes', e.target.value)}
              placeholder="Observações adicionais para a coleta..."
              className="resize-none h-24"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-2">Notas Fiscais ({formData.notasFiscais.length})</h3>
          <div className="space-y-3">
            {formData.notasFiscais.map((nf, index) => (
              <div key={index} className="p-3 border rounded-md">
                <div className="flex justify-between">
                  <div>
                    <span className="font-medium">NF {nf.numeroNF}</span>
                    {nf.chaveNF && <span className="block text-xs text-gray-500">Chave: {nf.chaveNF}</span>}
                  </div>
                  <div className="text-right">
                    <span className="font-medium">{formatarMoeda(nf.valorTotal)}</span>
                    <span className="block text-xs text-gray-500">{formatarNumero(nf.pesoTotal)} kg</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <span>{nf.volumes.reduce((sum, vol) => sum + vol.quantidade, 0)} volumes • </span>
                  <span>{formatarNumero(nf.volumes.reduce((sum, vol) => sum + ((vol.altura * vol.largura * vol.comprimento * vol.quantidade) / 1000000), 0))} m³</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfirmationStep;
