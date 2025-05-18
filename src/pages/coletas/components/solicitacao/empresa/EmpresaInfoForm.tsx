
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { EmpresaInfoFormProps, EMPTY_EMPRESA } from './empresaTypes';
import { formatarEndereco, processUFValue } from './empresaUtils';
import { EnderecoCompleto, DadosEmpresa } from '../../types/coleta.types';
import EnderecoForm from './EnderecoForm';

const EmpresaInfoForm: React.FC<EmpresaInfoFormProps> = ({ 
  tipo, 
  dados = EMPTY_EMPRESA,
  onDadosChange,
  readOnly = false,
  empresa,
  onChange,
  label
}) => {
  // Support both new and old prop patterns
  const actualDados = dados || empresa || EMPTY_EMPRESA;
  const actualOnDadosChange = onDadosChange || onChange || (() => {});
  const title = label || (tipo === 'remetente' ? 'Remetente' : 'Destinatário');
  
  const handleChange = (field: keyof DadosEmpresa, value: string) => {
    actualOnDadosChange({ ...actualDados, [field]: value });
  };
  
  const handleEnderecoChange = (field: keyof EnderecoCompleto, value: string) => {
    // Se for o campo UF, converter para maiúsculas e limitar a 2 caracteres
    const processedValue = field === 'uf' 
      ? processUFValue(value)
      : value;
      
    const newEndereco = { ...actualDados.endereco, [field]: processedValue };
    actualOnDadosChange({ 
      ...actualDados, 
      endereco: newEndereco,
      enderecoFormatado: formatarEndereco(newEndereco)
    });
  };
  
  return (
    <div className="space-y-4 border p-4 rounded-md bg-gray-50">
      <h3 className="text-lg font-medium">{title}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${tipo}-cnpj`}>CNPJ</Label>
          <Input 
            id={`${tipo}-cnpj`}
            placeholder="00.000.000/0000-00" 
            value={actualDados.cnpj || ''}
            onChange={(e) => handleChange('cnpj', e.target.value)}
            readOnly={readOnly}
            className={readOnly ? "bg-gray-100" : ""}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`${tipo}-cpf`}>CPF (se aplicável)</Label>
          <Input 
            id={`${tipo}-cpf`}
            placeholder="000.000.000-00" 
            value={actualDados.cpf || ''}
            onChange={(e) => handleChange('cpf', e.target.value)}
            readOnly={readOnly}
            className={readOnly ? "bg-gray-100" : ""}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`${tipo}-razao`}>Razão Social</Label>
          <Input 
            id={`${tipo}-razao`}
            placeholder="Razão Social" 
            value={actualDados.razaoSocial || ''}
            onChange={(e) => handleChange('razaoSocial', e.target.value)}
            readOnly={readOnly}
            className={readOnly ? "bg-gray-100" : ""}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`${tipo}-nome`}>Nome Fantasia</Label>
          <Input 
            id={`${tipo}-nome`}
            placeholder="Nome Fantasia" 
            value={actualDados.nomeFantasia || ''}
            onChange={(e) => handleChange('nomeFantasia', e.target.value)}
            readOnly={readOnly}
            className={readOnly ? "bg-gray-100" : ""}
          />
        </div>
      </div>
      
      <EnderecoForm 
        endereco={actualDados.endereco}
        readOnly={readOnly}
        tipo={tipo}
        onEnderecoChange={handleEnderecoChange}
      />
      
      {readOnly && (
        <p className="text-xs text-gray-500 mt-1">Dados obtidos do XML da nota fiscal</p>
      )}
    </div>
  );
};

export default EmpresaInfoForm;
