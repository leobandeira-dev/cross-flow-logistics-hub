import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DadosEmpresa, EnderecoCompleto, EmpresaInfoFormProps } from './SolicitacaoTypes';

const EMPTY_ENDERECO: EnderecoCompleto = {
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
  cep: ''
};

const EMPTY_EMPRESA: DadosEmpresa = {
  cnpj: '',
  razaoSocial: '',
  nomeFantasia: '',
  endereco: EMPTY_ENDERECO,
  enderecoFormatado: ''
};

export { EMPTY_EMPRESA, EMPTY_ENDERECO };

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
    const newEndereco = { ...actualDados.endereco, [field]: value };
    actualOnDadosChange({ 
      ...actualDados, 
      endereco: newEndereco,
      enderecoFormatado: formatarEndereco(newEndereco)
    });
  };
  
  const formatarEndereco = (endereco: EnderecoCompleto): string => {
    const parts = [
      endereco.logradouro,
      endereco.numero ? `nº ${endereco.numero}` : '',
      endereco.complemento,
      endereco.bairro ? `${endereco.bairro},` : '',
      `${endereco.cidade}/${endereco.uf}`,
      endereco.cep ? `CEP: ${endereco.cep.replace(/^(\d{5})(\d{3})$/, '$1-$2')}` : ''
    ].filter(Boolean);
    
    return parts.join(' ');
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
      
      <div className="pt-2">
        <h4 className="text-sm font-medium mb-2">Endereço</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${tipo}-logradouro`}>Logradouro</Label>
            <Input 
              id={`${tipo}-logradouro`}
              placeholder="Rua/Avenida" 
              value={actualDados.endereco.logradouro || ''}
              onChange={(e) => handleEnderecoChange('logradouro', e.target.value)}
              readOnly={readOnly}
              className={readOnly ? "bg-gray-100" : ""}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor={`${tipo}-numero`}>Número</Label>
              <Input 
                id={`${tipo}-numero`}
                placeholder="Número" 
                value={actualDados.endereco.numero || ''}
                onChange={(e) => handleEnderecoChange('numero', e.target.value)}
                readOnly={readOnly}
                className={readOnly ? "bg-gray-100" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`${tipo}-complemento`}>Complemento</Label>
              <Input 
                id={`${tipo}-complemento`}
                placeholder="Complemento" 
                value={actualDados.endereco.complemento || ''}
                onChange={(e) => handleEnderecoChange('complemento', e.target.value)}
                readOnly={readOnly}
                className={readOnly ? "bg-gray-100" : ""}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`${tipo}-bairro`}>Bairro</Label>
            <Input 
              id={`${tipo}-bairro`}
              placeholder="Bairro" 
              value={actualDados.endereco.bairro || ''}
              onChange={(e) => handleEnderecoChange('bairro', e.target.value)}
              readOnly={readOnly}
              className={readOnly ? "bg-gray-100" : ""}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor={`${tipo}-cidade`}>Cidade</Label>
              <Input 
                id={`${tipo}-cidade`}
                placeholder="Cidade" 
                value={actualDados.endereco.cidade || ''}
                onChange={(e) => handleEnderecoChange('cidade', e.target.value)}
                readOnly={readOnly}
                className={readOnly ? "bg-gray-100" : ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`${tipo}-uf`}>UF</Label>
              <Input 
                id={`${tipo}-uf`}
                placeholder="UF" 
                value={actualDados.endereco.uf || ''}
                onChange={(e) => handleEnderecoChange('uf', e.target.value)}
                readOnly={readOnly}
                maxLength={2}
                className={readOnly ? "bg-gray-100" : ""}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`${tipo}-cep`}>CEP</Label>
            <Input 
              id={`${tipo}-cep`}
              placeholder="00000-000" 
              value={actualDados.endereco.cep || ''}
              onChange={(e) => handleEnderecoChange('cep', e.target.value)}
              readOnly={readOnly}
              className={readOnly ? "bg-gray-100" : ""}
            />
          </div>
        </div>
      </div>
      
      {readOnly && (
        <p className="text-xs text-gray-500 mt-1">Dados obtidos do XML da nota fiscal</p>
      )}
    </div>
  );
};

export default EmpresaInfoForm;
