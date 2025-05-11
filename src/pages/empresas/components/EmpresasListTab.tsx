
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building } from 'lucide-react';
import EmpresasListTable from './EmpresasListTable';
import SearchFilter from '@/components/common/SearchFilter';
import { FilterConfig } from '@/components/common/SearchFilter';

interface EmpresasListTabProps {
  empresas: any[];
  onViewDetails: (empresa: any) => void;
}

const EmpresasListTab: React.FC<EmpresasListTabProps> = ({ empresas, onViewDetails }) => {
  const [filteredEmpresas, setFilteredEmpresas] = useState(empresas);
  const [searchTerm, setSearchTerm] = useState('');

  const filterConfigs: FilterConfig[] = [
    {
      id: 'perfil',
      label: 'Perfil',
      options: [
        { id: 'Transportadora', label: 'Transportadora' },
        { id: 'Filial', label: 'Filial' },
        { id: 'Cliente', label: 'Cliente' },
        { id: 'Fornecedor', label: 'Fornecedor' }
      ]
    },
    {
      id: 'status',
      label: 'Status',
      options: [
        { id: 'ativo', label: 'Ativo' },
        { id: 'inativo', label: 'Inativo' }
      ]
    }
  ];

  const handleSearch = (term: string, activeFilters?: Record<string, string[]>) => {
    setSearchTerm(term);
    
    let results = empresas;
    
    // Apply search term filter
    if (term) {
      const searchLower = term.toLowerCase();
      results = results.filter(empresa => 
        (empresa.nome && empresa.nome.toLowerCase().includes(searchLower)) ||
        (empresa.razaoSocial && empresa.razaoSocial.toLowerCase().includes(searchLower)) ||
        (empresa.cnpj && empresa.cnpj.includes(term))
      );
    }
    
    // Apply perfil filters
    if (activeFilters && activeFilters.perfil && activeFilters.perfil.length > 0) {
      results = results.filter(empresa => activeFilters.perfil.includes(empresa.perfil));
    }
    
    // Apply status filters
    if (activeFilters && activeFilters.status && activeFilters.status.length > 0) {
      results = results.filter(empresa => activeFilters.status.includes(empresa.status));
    }
    
    setFilteredEmpresas(results);
  };

  useEffect(() => {
    setFilteredEmpresas(empresas);
  }, [empresas]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Building className="mr-2 text-cross-blue" size={20} />
          Listagem de Empresas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SearchFilter 
          placeholder="Buscar por nome, razão social ou CNPJ..." 
          onSearch={handleSearch}
          filters={filterConfigs}
        />
        <EmpresasListTable empresas={filteredEmpresas} onViewDetails={onViewDetails} />
      </CardContent>
    </Card>
  );
};

export default EmpresasListTab;
