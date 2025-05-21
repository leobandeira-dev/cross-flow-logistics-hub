
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building } from 'lucide-react';
import EmpresasListTable from './EmpresasListTable';
import SearchFilter from '@/components/common/SearchFilter';
import { FilterConfig } from '@/components/common/SearchFilter';
import { supabase } from '@/integrations/supabase/client';

interface EmpresasListTabProps {
  empresas: any[];
  onViewDetails: (empresa: any) => void;
}

const EmpresasListTab: React.FC<EmpresasListTabProps> = ({ empresas: initialEmpresas, onViewDetails }) => {
  const [empresas, setEmpresas] = useState(initialEmpresas);
  const [filteredEmpresas, setFilteredEmpresas] = useState(initialEmpresas);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const fetchEmpresas = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('empresas')
          .select('*');

        if (error) {
          throw error;
        }

        const formattedData = data.map(item => ({
          id: item.id,
          nome: item.nome_fantasia || item.razao_social,
          razao_social: item.razao_social,
          nome_fantasia: item.nome_fantasia,
          cnpj: item.cnpj,
          email: item.email,
          telefone: item.telefone,
          logradouro: item.logradouro,
          numero: item.numero,
          complemento: item.complemento,
          bairro: item.bairro,
          cidade: item.cidade,
          uf: item.uf || item.estado,
          cep: item.cep,
          inscricao_estadual: item.inscricao_estadual,
          status: item.status,
          perfil: item.perfil,
          transportadora_principal: item.transportadora_principal,
        }));

        setEmpresas(formattedData);
        setFilteredEmpresas(formattedData);
      } catch (err) {
        console.error('Erro ao buscar empresas:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmpresas();
  }, []);

  const handleSearch = (term: string, activeFilters?: Record<string, string[]>) => {
    setSearchTerm(term);
    
    let results = empresas;
    
    // Apply search term filter
    if (term) {
      const searchLower = term.toLowerCase();
      results = results.filter(empresa => 
        (empresa.nome && empresa.nome.toLowerCase().includes(searchLower)) ||
        (empresa.razao_social && empresa.razao_social.toLowerCase().includes(searchLower)) ||
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
        
        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Carregando empresas...</div>
        ) : (
          <EmpresasListTable empresas={filteredEmpresas} onViewDetails={onViewDetails} />
        )}
      </CardContent>
    </Card>
  );
};

export default EmpresasListTab;
