
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SearchFilterProps {
  placeholder?: string;
  filters?: { 
    name: string;
    options: {
      label: string;
      value: string;
    }[];
  }[];
  onSearch?: (value: string) => void;
  onFilterChange?: (filter: string, value: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ 
  placeholder = "Buscar...", 
  filters = [],
  onSearch,
  onFilterChange
}) => {
  const [searchValue, setSearchValue] = React.useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="search"
            placeholder={placeholder}
            className="pl-10"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        {filters.map((filter) => (
          <div key={filter.name} className="w-full lg:w-64">
            <Select onValueChange={(value) => onFilterChange && onFilterChange(filter.name, value)}>
              <SelectTrigger>
                <SelectValue placeholder={`Filtrar por ${filter.name}`} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        <Button onClick={handleSearch} className="bg-cross-blue hover:bg-cross-blueDark">
          <Search size={18} className="mr-2" /> Buscar
        </Button>
        
        <Button variant="outline">
          <Filter size={18} className="mr-2" /> Filtros
        </Button>
      </div>
    </div>
  );
};

export default SearchFilter;
