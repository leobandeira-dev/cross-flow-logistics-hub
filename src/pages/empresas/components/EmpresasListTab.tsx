
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SearchFilter, { FilterConfig } from '@/components/common/SearchFilter';
import EmpresasListTable from './EmpresasListTable';
import { Loader2 } from 'lucide-react';

interface EmpresasListTabProps {
  empresas: any[];
  isLoading?: boolean;
  onViewDetails: (empresa: any) => void;
}

// Configuração de filtros para empresas
const filterConfig: FilterConfig[] = [
  {
    id: 'perfil',
    name: 'Perfil',
    options: [
      { label: 'Transportadora', value: 'Transportadora' },
      { label: 'Filial', value: 'Filial' },
      { label: 'Cliente', value: 'Cliente' },
      { label: 'Fornecedor', value: 'Fornecedor' },
    ],
  },
  {
    id: 'status',
    name: 'Status',
    options: [
      { label: 'Ativo', value: 'ativo' },
      { label: 'Inativo', value: 'inativo' },
    ],
  },
];

const EmpresasListTab: React.FC<EmpresasListTabProps> = ({ 
  empresas, 
  isLoading = false, 
  onViewDetails 
}) => {
  const [filteredEmpresas, setFilteredEmpresas] = React.useState(empresas);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string[]>>({});

  // Atualiza os dados filtrados quando a lista de empresas mudar
  React.useEffect(() => {
    handleFilterChange(searchTerm, activeFilters);
  }, [empresas]);

  const handleFilterChange = (term: string, filters?: Record<string, string[]>) => {
    setSearchTerm(term);
    setActiveFilters(filters || {});
    
    let filtered = [...empresas];
    
    // Filtrar por termo de busca
    if (term) {
      const searchLower = term.toLowerCase();
      filtered = filtered.filter(
        empresa =>
          (empresa.nome && empresa.nome.toLowerCase().includes(searchLower)) ||
          (empresa.razaoSocial && empresa.razaoSocial.toLowerCase().includes(searchLower)) ||
          (empresa.cnpj && empresa.cnpj.includes(searchLower))
      );
    }
    
    // Aplicar filtros
    if (filters) {
      Object.entries(filters).forEach(([key, values]) => {
        if (values.length > 0) {
          filtered = filtered.filter(empresa => {
            // Tratamento especial para o campo "status" que pode estar em diferentes formatos
            if (key === 'status') {
              return values.includes(empresa[key]?.toLowerCase() || '');
            }
            return values.includes(empresa[key]);
          });
        }
      });
    }
    
    setFilteredEmpresas(filtered);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Empresas Cadastradas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <SearchFilter
            placeholder="Buscar por nome ou CNPJ..."
            filterConfig={filterConfig}
            onFilterChange={handleFilterChange}
          />
        </div>
        
        {isLoading ? (
          <div className="w-full py-10 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Carregando empresas...</span>
          </div>
        ) : (
          <EmpresasListTable 
            empresas={filteredEmpresas} 
            onViewDetails={onViewDetails}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default EmpresasListTab;
