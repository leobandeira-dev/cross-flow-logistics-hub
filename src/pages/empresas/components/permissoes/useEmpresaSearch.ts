
import { useState } from 'react';
import { empresasMock } from './mockData';
import { EmpresaMock } from './types';

export const useEmpresaSearch = () => {
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>("");
  const [filteredEmpresas, setFilteredEmpresas] = useState<EmpresaMock[]>(empresasMock);
  
  const handleEmpresaChange = (value: string) => {
    setSelectedEmpresa(value);
  };
  
  // Handle search and filtering
  const handleSearch = (term: string, activeFilters?: Record<string, string[]>) => {
    let results = empresasMock;
    
    // Apply search term filter
    if (term) {
      const searchLower = term.toLowerCase();
      results = results.filter(empresa => 
        empresa.nome.toLowerCase().includes(searchLower) ||
        empresa.cnpj.includes(term)
      );
    }
    
    // Apply perfil filters
    if (activeFilters && activeFilters.perfil && activeFilters.perfil.length > 0) {
      results = results.filter(empresa => activeFilters.perfil.includes(empresa.perfil));
    }
    
    setFilteredEmpresas(results);
  };

  const getEmpresaName = (id: string) => {
    const empresa = empresasMock.find(e => e.id === id);
    return empresa ? `${empresa.nome} (${empresa.cnpj})` : '';
  };

  return {
    selectedEmpresa,
    filteredEmpresas,
    handleEmpresaChange,
    handleSearch,
    getEmpresaName
  };
};
