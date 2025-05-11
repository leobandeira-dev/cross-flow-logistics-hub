
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EmpresaMock } from './types';

interface EmpresaSelectorProps {
  selectedEmpresa: string;
  handleEmpresaChange: (value: string) => void;
  filteredEmpresas: EmpresaMock[];
}

const EmpresaSelector: React.FC<EmpresaSelectorProps> = ({
  selectedEmpresa,
  handleEmpresaChange,
  filteredEmpresas
}) => {
  return (
    <div className="mb-6">
      <Label htmlFor="empresa-select" className="mb-2 block">Selecione uma Empresa</Label>
      <Select value={selectedEmpresa} onValueChange={handleEmpresaChange}>
        <SelectTrigger id="empresa-select" className="w-full md:w-[400px]">
          <SelectValue placeholder="Selecione uma empresa" />
        </SelectTrigger>
        <SelectContent>
          {filteredEmpresas.map(empresa => (
            <SelectItem key={empresa.id} value={empresa.id}>
              {empresa.nome} - {empresa.cnpj} ({empresa.perfil})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default EmpresaSelector;
