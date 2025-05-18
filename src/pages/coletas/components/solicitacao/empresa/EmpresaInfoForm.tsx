
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { EnderecoCompleto, DadosEmpresa } from '../../../types/coleta.types';
import { EmpresaInfoFormProps, EMPTY_ENDERECO, EMPTY_EMPRESA } from './empresaTypes';
import EnderecoForm from './EnderecoForm';

const EmpresaInfoForm: React.FC<EmpresaInfoFormProps> = ({
  tipo,
  dados,
  onDadosChange,
  readOnly = false,
  empresa, // For backward compatibility
  onChange, // For backward compatibility
  label
}) => {
  // Use either the new API or the backward compatible one
  const empresaData = dados || empresa || EMPTY_EMPRESA;
  const handleChange = onDadosChange || onChange || (() => {});
  
  const [empresaState, setEmpresaState] = useState<DadosEmpresa>(empresaData);
  
  useEffect(() => {
    setEmpresaState(dados || empresa || EMPTY_EMPRESA);
  }, [dados, empresa]);

  // Handle empresa field change (except endereco)
  const handleEmpresaChange = (field: keyof DadosEmpresa, value: any) => {
    if (readOnly) return;
    
    const updatedEmpresa = { ...empresaState, [field]: value };
    
    // Update endereco formatado when any part of endereco changes
    if (field === 'endereco') {
      const end = value as EnderecoCompleto;
      updatedEmpresa.enderecoFormatado = `${end.logradouro}, ${end.numero} ${end.complemento ? end.complemento + ', ' : ''}${end.bairro}, ${end.cidade}/${end.uf}, CEP: ${end.cep}`;
    }
    
    setEmpresaState(updatedEmpresa);
    handleChange(updatedEmpresa);
  };
  
  // Handle address field changes
  const handleEnderecoChange = (field: keyof EnderecoCompleto, value: string) => {
    if (readOnly) return;
    
    const updatedEndereco = { ...empresaState.endereco, [field]: value };
    handleEmpresaChange('endereco', updatedEndereco);
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${tipo}-cnpj`}>CNPJ</Label>
          <div className="flex gap-2">
            <Input
              id={`${tipo}-cnpj`}
              value={empresaState.cnpj}
              onChange={(e) => handleEmpresaChange('cnpj', e.target.value)}
              placeholder="00.000.000/0000-00"
              readOnly={readOnly}
            />
            {!readOnly && (
              <Button variant="outline" size="icon" type="button">
                <Search className="h-4 w-4" />
                <span className="sr-only">Buscar CNPJ</span>
              </Button>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`${tipo}-razao`}>Razão Social</Label>
          <Input
            id={`${tipo}-razao`}
            value={empresaState.razaoSocial}
            onChange={(e) => handleEmpresaChange('razaoSocial', e.target.value)}
            placeholder="Razão Social"
            readOnly={readOnly}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`${tipo}-nome`}>Nome Fantasia</Label>
        <Input
          id={`${tipo}-nome`}
          value={empresaState.nomeFantasia}
          onChange={(e) => handleEmpresaChange('nomeFantasia', e.target.value)}
          placeholder="Nome Fantasia"
          readOnly={readOnly}
        />
      </div>
      
      <Card>
        <CardContent className="pt-4">
          <EnderecoForm
            endereco={empresaState.endereco}
            readOnly={readOnly}
            tipo={tipo}
            onEnderecoChange={handleEnderecoChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmpresaInfoForm;
